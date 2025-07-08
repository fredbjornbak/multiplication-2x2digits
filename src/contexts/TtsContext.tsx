
import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TtsContextType {
  speak: (message: string) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  toggleMute: () => void;
  isMuted: boolean;
  displayedWords: string[];
  currentWordIndex: number;
}

const TtsContext = createContext<TtsContextType | null>(null);

export const TtsProvider = ({ children }: { children: ReactNode }) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { i18n } = useTranslation();
  const [apiKey] = useLocalStorage<string>('openai-api-key', '');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const displayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationStartedRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const wordsRef = useRef<string[]>([]);
  const speechQueueRef = useRef<string[]>([]);
  const processingQueueRef = useRef<boolean>(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Reset speaking state when language changes
  useEffect(() => {
    // Only if we're currently speaking, we need to stop and restart
    if (isSpeakingRef.current && displayedWords.length > 0) {
      const currentMessage = displayedWords.join(' ');
      stopSpeaking();
      // Small delay to ensure proper cleanup before starting again
      setTimeout(() => {
        speak(currentMessage);
      }, 300);
    }
  }, [i18n.language]);

  const displayWordsSequentially = (words: string[], delay: number) => {
    if (displayIntervalRef.current) {
      clearInterval(displayIntervalRef.current);
      displayIntervalRef.current = null;
    }
    
    wordsRef.current = words;
    let index = 0;
    
    displayIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        setCurrentWordIndex(index);
        index++;
      } else {
        if (displayIntervalRef.current) {
          clearInterval(displayIntervalRef.current);
          displayIntervalRef.current = null;
        }
      }
    }, delay);
  };

  const stopSpeaking = () => {
    // Clear any running animation/interval
    if (displayIntervalRef.current) {
      clearInterval(displayIntervalRef.current);
      displayIntervalRef.current = null;
    }
    
    // Stop any playing audio
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      } catch (e) {
        console.warn('Error stopping audio:', e);
      }
    }
    
    // Reset states
    animationStartedRef.current = false;
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setDisplayedWords([]);
    setCurrentWordIndex(-1);
    
    // Clear the speech queue
    speechQueueRef.current = [];
    processingQueueRef.current = false;
  };

  const processNextInQueue = async () => {
    if (processingQueueRef.current || speechQueueRef.current.length === 0) {
      return;
    }

    processingQueueRef.current = true;
    const nextMessage = speechQueueRef.current.shift();
    
    if (nextMessage) {
      try {
        await speakInternal(nextMessage);
      } catch (error) {
        console.error('Error processing speech queue:', error);
      }
    }
    
    processingQueueRef.current = false;
    
    // Process next item if available
    if (speechQueueRef.current.length > 0) {
      processNextInQueue();
    }
  };

  const generateSpeech = async (text: string): Promise<string> => {
    try {
      // Use API key from localStorage first, then fallback to env variable
      const openAiApiKey = apiKey || import.meta.env.VITE_OPEN_AI_API_KEY;
      
      if (!openAiApiKey) {
        console.warn('OpenAI API key is not configured. TTS functionality will not work.');
        throw new Error('OpenAI API key not configured');
      }

      console.log('Generating speech with API key available:', !!openAiApiKey);
      console.log('Current language:', i18n.language);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Select appropriate voice based on language
      // Use a voice that works well for Danish when language is set to Danish
      const voice = i18n.language === 'da' ? 'shimmer' : 'alloy';
      console.log('Selected voice for TTS:', voice);

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: voice,
          input: text,
          speed: 1.0,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('TTS API error:', response.status, response.statusText);
        const errorData = await response.text();
        console.error('Error details:', errorData);
        throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  };

  const playAudio = (audioUrl: string, words: string[]): Promise<void> => {
    return new Promise((resolve) => {
      if (isSpeakingRef.current && audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
        } catch (e) {
          console.warn('Error stopping previous audio:', e);
        }
      }
      
      // Create a new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // Set up event listeners
      audio.addEventListener('ended', () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        audioRef.current = null;
        resolve();
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        audioRef.current = null;
        resolve();
      });
      
      // Sync text display with audio playback
      audio.addEventListener('playing', () => {
        if (!animationStartedRef.current) {
          displayWordsSequentially(words, audio.duration * 1000 / words.length);
          animationStartedRef.current = true;
        }
      });
      
      // Start playback
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
        // Fallback to text-only display in case audio fails
        displayWordsSequentially(words, 300);
        setTimeout(() => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          resolve();
        }, words.length * 300);
      });
    });
  };

  const speakInternal = async (message: string): Promise<void> => {
    if (!message || message.trim() === '') {
      return;
    }
    
    try {
      // Set speaking state
      isSpeakingRef.current = true;
      
      // Reset animation flag
      animationStartedRef.current = false;
      
      // Reset the UI state
      setIsSpeaking(true);
      const words = message.split(' ');
      setDisplayedWords(words);
      setCurrentWordIndex(-1);
      
      if (isMuted) {
        // Just display the words without audio
        displayWordsSequentially(words, 200);
        await new Promise(resolve => setTimeout(resolve, words.length * 200));
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        return;
      }
      
      try {
        const audioUrl = await generateSpeech(message);
        await playAudio(audioUrl, words);
      } catch (error) {
        console.warn('Speech synthesis failed, continuing with text only:', error);
        // Display the words with a fixed timing
        displayWordsSequentially(words, 300);
        await new Promise(resolve => setTimeout(resolve, words.length * 300));
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      }
    } catch (error) {
      console.error('Error in speak function:', error);
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      animationStartedRef.current = false;
    }
  };

  // Public speak function that manages the queue
  const speak = async (message: string): Promise<void> => {
    // Don't add empty messages to the queue
    if (!message || message.trim() === '') {
      return;
    }
    
    // If already speaking, add to queue and return
    if (isSpeakingRef.current) {
      speechQueueRef.current.push(message);
      return;
    }
    
    // Stop any previous speech first
    stopSpeaking();
    
    // Speak the message directly
    await speakInternal(message);
    
    // Process any messages that were queued while speaking
    processNextInQueue();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <TtsContext.Provider value={{ 
      speak, 
      stopSpeaking, 
      isSpeaking, 
      toggleMute, 
      isMuted,
      displayedWords,
      currentWordIndex
    }}>
      {children}
    </TtsContext.Provider>
  );
};

export const useTts = () => {
  const context = useContext(TtsContext);
  if (!context) {
    throw new Error('useTts must be used within a TtsProvider');
  }
  return context;
};
