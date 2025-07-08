// DEPRECATED: This component is deprecated and will be removed in a future version.
// Please use the TTS context (useTts) for speech functionality and the TtsSpeechBubble component for UI.
// Example:
// import { useTts } from '@/contexts/TtsContext';
// const { speak } = useTts();
// speak("Your message");

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Volume2, VolumeX, HelpCircle, Lightbulb, ThumbsUp } from 'lucide-react';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useTranslation } from 'react-i18next';

export type ConceptType = 'singleDigit' | 'doubleDigitSingle' | 'doubleDigitDouble';

export interface AITutorSidebarProps {
  exerciseId?: string;
  exerciseType: 'multiplication' | 'boxMethod3D' | 'selector' | 'addition';
  showNextButton?: boolean;
  onNextClick?: () => void;
  className?: string;
  conceptType?: ConceptType;
  rowValue?: number;
  columnValue?: number;
  userAnswer?: string;
  isSubmitted?: boolean;
}

export type AITutorSidebarHandle = {
  speak: (message: string) => Promise<void>;
};

const AITutorSidebar = forwardRef<AITutorSidebarHandle, AITutorSidebarProps>(
  ({ exerciseType, showNextButton = false, onNextClick, className, conceptType, rowValue, columnValue, userAnswer, isSubmitted }, ref) => {
    const [displayedWords, setDisplayedWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // Default to sound on
    const [hasWelcomed, setHasWelcomed] = useState(false);
    const [hasGivenFeedback, setHasGivenFeedback] = useState(false);
    const { preferences } = usePreferencesStore();
    const { t, i18n } = useTranslation();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const wordsRef = useRef<string[]>([]);
    const displayIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const animationStartedRef = useRef<boolean>(false);
    const isSpeakingRef = useRef<boolean>(false);
    const lastExerciseTypeRef = useRef<string>(exerciseType);
    const lastConceptTypeRef = useRef<string | undefined>(conceptType);

    // Initialize with welcome message based on exercise type
    useEffect(() => {
      const key = `${exerciseType}_${conceptType}`;
      
      // Reset flag if new exercise or concept is selected
      if (lastExerciseTypeRef.current !== exerciseType || lastConceptTypeRef.current !== conceptType) {
        setHasWelcomed(false);
        lastExerciseTypeRef.current = exerciseType;
        lastConceptTypeRef.current = conceptType;
      }

      if (!hasWelcomed && !isSpeakingRef.current) {
        stopCurrentSpeech();
        const context = {
          exerciseType,
          conceptType,
          rowValue,
          columnValue,
          isFirstInteraction: true,
          language: i18n.language // Pass current language to the AI
        };
        
        setTimeout(() => {
          generateAIMessage(context).then(message => {
            if (message && !isSpeakingRef.current) {
              speakMessage(message);
              setHasWelcomed(true);
            }
          });
        }, 500);
      }
    }, [exerciseType, conceptType, hasWelcomed, i18n.language]);

    // Reset feedback state when exercise changes
    useEffect(() => {
      setHasGivenFeedback(false);
    }, [rowValue, columnValue, exerciseType]);

    // Respond to answer submissions
    useEffect(() => {
      if (isSubmitted && userAnswer && !isSpeakingRef.current && !hasGivenFeedback) {
        const correctAnswer = rowValue && columnValue ? rowValue * columnValue : null;
        const submittedAnswer = parseInt(userAnswer);

        // Generate context-aware feedback using OpenAI
        const context = {
          exerciseType,
          conceptType,
          rowValue,
          columnValue,
          userAnswer,
          isCorrect: correctAnswer === submittedAnswer,
          correctAnswer,
          language: i18n.language // Pass current language to the AI
        };

        setTimeout(() => {
          generateAIMessage(context).then(message => {
            if (message && !isSpeakingRef.current) {
              stopCurrentSpeech();
              speakMessage(message);
              setHasGivenFeedback(true);
            }
          });
        }, 500);
      }
    }, [isSubmitted, userAnswer, hasGivenFeedback, i18n.language]);

    // Clean up on unmount or when exercise type changes
    useEffect(() => {
      return () => {
        stopCurrentSpeech();
        setHasWelcomed(false);
      };
    }, [exerciseType]);

    // Auto-scroll as new words appear
    useEffect(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    }, [displayedWords, currentWordIndex]);

    const stopCurrentSpeech = () => {
      // Clear any running animation/interval
      if (displayIntervalRef.current) {
        clearInterval(displayIntervalRef.current);
        displayIntervalRef.current = null;
      }
      
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      
      // Reset states
      animationStartedRef.current = false;
      isSpeakingRef.current = false;
      setIsPlaying(false);
      setDisplayedWords([]);
      setCurrentWordIndex(-1);
    };

    const generateAIMessage = async (context: any): Promise<string> => {
      try {
        const apiKey = import.meta.env.VITE_OPEN_AI_API_KEY;
        if (!apiKey) {
          console.warn('OpenAI API key is not configured.');
          return '';
        }

        // Adjust system prompt to include language
        const language = context.language || 'en';
        const languageInstruction = language === 'da' ? 
          'Respond in Danish (dansk) only.' : 
          'Respond in English only.';

        const systemPrompt = `You are a friendly and encouraging math tutor for children with learning difficulties. 
        You are teaching multiplication using the box method visualization, where students can see and count the boxes.
        Use simple language, be patient, and include emojis to make learning fun. 
        Keep responses short and focused on one concept at a time.
        For welcome messages, focus on introducing the concept and getting started.
        For feedback messages, focus on the specific answer given and provide clear guidance.
        For help requests, provide specific guidance for the current problem.
        Always refer to the visual boxes and encourage counting them.
        ${languageInstruction}`;

        let userPrompt = '';
        if (context.isFirstInteraction) {
          userPrompt = `The student has just started a ${context.exerciseType} exercise. 
          ${context.conceptType ? `They are working on ${context.conceptType} multiplication.` : ''}
          They can see a grid of boxes that they can count.
          Give them a warm welcome and explain how they can use the boxes to learn multiplication.
          Keep it focused on getting started with counting the boxes.`;
        } else if (context.isHelpRequest) {
          userPrompt = `The student needs help with the current problem: ${context.rowValue} × ${context.columnValue}.
          They can see a grid of ${context.rowValue} rows and ${context.columnValue} columns of boxes.
          Guide them to count the boxes by rows or columns.
          For example, they can count how many boxes are in each row and then count how many rows there are.
          Provide specific guidance on how to count the boxes to find the answer.`;
        } else if (context.isStuck) {
          userPrompt = `The student is stuck on the problem: ${context.rowValue} × ${context.columnValue}.
          They can see a grid of ${context.rowValue} rows and ${context.columnValue} columns of boxes.
          Break down the problem into smaller steps:
          1. First, count how many boxes are in one row (${context.columnValue} boxes)
          2. Then, count how many rows there are (${context.rowValue} rows)
          3. Finally, count all the boxes together
          Provide encouragement and guide them to count the boxes step by step.`;
        } else if (context.needsExplanation) {
          userPrompt = `The student answered ${context.userAnswer} for ${context.rowValue} × ${context.columnValue} (correct answer is ${context.correctAnswer}).
          They can see a grid of ${context.rowValue} rows and ${context.columnValue} columns of boxes.
          Explain why the answer is incorrect by showing them how to count the boxes:
          1. Count the boxes in one row (${context.columnValue} boxes)
          2. Count how many rows there are (${context.rowValue} rows)
          3. Count all the boxes together to get ${context.correctAnswer}
          Help them understand by focusing on counting the boxes they can see.`;
        } else {
          userPrompt = `The student ${context.isCorrect ? 'correctly' : 'incorrectly'} answered ${context.rowValue} × ${context.columnValue}.
          Their answer was ${context.userAnswer} ${context.isCorrect ? '' : `(correct answer is ${context.correctAnswer})`}.
          They can see a grid of ${context.rowValue} rows and ${context.columnValue} columns of boxes.
          ${context.isCorrect ? 
            'Congratulate them on counting the boxes correctly and encourage them to try another problem.' :
            'Guide them to count the boxes again, focusing on counting the rows and columns.'}
          Focus on the visual boxes and what to do next.`;
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 150
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('Error generating AI message:', error);
        return '';
      }
    };

    const generateSpeech = async (text: string): Promise<string> => {
      try {
        const apiKey = import.meta.env.VITE_OPEN_AI_API_KEY;
        if (!apiKey) {
          console.warn('OpenAI API key is not configured. TTS functionality will not work.');
          throw new Error('OpenAI API key not configured');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        // Select appropriate voice based on language
        const voice = i18n.language === 'da' ? 'nova' : 'alloy';

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
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
          throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error generating speech:', error);
        throw error;
      }
    };

    const displayWordsSequentially = (words: string[], msPerWord: number) => {
      // Prevent multiple initializations
      if (animationStartedRef.current) return;
      animationStartedRef.current = true;
      
      wordsRef.current = words;
      setDisplayedWords(words); // Show all words immediately
      setCurrentWordIndex(-1); // Start with no words highlighted
      
      // Clear any existing interval
      if (displayIntervalRef.current) {
        clearInterval(displayIntervalRef.current);
      }

      let wordIndex = 0;
      // Highlight words one by one with a timing based on speech duration
      displayIntervalRef.current = setInterval(() => {
        if (wordIndex < words.length) {
          setCurrentWordIndex(wordIndex);
          wordIndex++;
        } else {
          if (displayIntervalRef.current) {
            clearInterval(displayIntervalRef.current);
            displayIntervalRef.current = null;
            animationStartedRef.current = false;
          }
        }
      }, msPerWord);
    };

    const playAudio = (audioUrl: string, words: string[]): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }

        if (isMuted) {
          displayWordsSequentially(words, 200);
          resolve();
          return;
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        const cleanup = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('ended', onEnded);
          audio.removeEventListener('error', onError);
        };

        const onCanPlay = () => {
          const wordTiming = audio.duration * 1000 / words.length;
          displayWordsSequentially(words, wordTiming);
        };

        const onEnded = () => {
          cleanup();
          setIsPlaying(false);
          isSpeakingRef.current = false;
          setDisplayedWords(words);
          setCurrentWordIndex(words.length - 1);
          animationStartedRef.current = false;
          resolve();
        };

        const onError = (error: Event) => {
          cleanup();
          console.error('Audio playback error:', error);
          setIsPlaying(false);
          isSpeakingRef.current = false;
          setDisplayedWords(words);
          setCurrentWordIndex(words.length - 1);
          animationStartedRef.current = false;
          reject(error);
        };

        audio.addEventListener('canplaythrough', onCanPlay);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        audio.play().catch((err) => {
          cleanup();
          console.error('Failed to play audio:', err);
          setIsPlaying(false);
          isSpeakingRef.current = false;
          setDisplayedWords(words);
          setCurrentWordIndex(words.length - 1);
          animationStartedRef.current = false;
          reject(err);
        });
      });
    };

    const speakMessage = async (message: string): Promise<void> => {
      try {
        // Set speaking state
        isSpeakingRef.current = true;
        
        // Reset animation flag
        animationStartedRef.current = false;
        
        // Reset the UI state
        setIsPlaying(true);
        const words = message.split(' ');
        setDisplayedWords(words);
        setCurrentWordIndex(-1);
        
        if (isMuted) {
          // Just display the words without audio
          displayWordsSequentially(words, 200);
          await new Promise(resolve => setTimeout(resolve, words.length * 200));
          setIsPlaying(false);
          isSpeakingRef.current = false;
          return;
        }
        
        try {
          const audioUrl = await generateSpeech(message);
          await playAudio(audioUrl, words);
        } catch (error) {
          console.warn('Speech synthesis failed, continuing with text only');
          // Display the words with a fixed timing
          displayWordsSequentially(words, 300);
          await new Promise(resolve => setTimeout(resolve, words.length * 300));
          setIsPlaying(false);
          isSpeakingRef.current = false;
        }
      } catch (error) {
        console.error('Error in speak function:', error);
        setIsPlaying(false);
        isSpeakingRef.current = false;
        animationStartedRef.current = false;
      }
    };

    // Expose the speak function via ref
    useImperativeHandle(ref, () => ({
      speak: (message: string) => {
        // Stop any current speech before starting new one
        stopCurrentSpeech();
        return speakMessage(message);
      }
    }));

    const toggleMute = () => {
      setIsMuted(!isMuted);
      if (!isMuted && audioRef.current) {
        audioRef.current.pause();
      }
    };

    const getHelpButtons = () => {
      // Define the font style based on preferences
      const fontStyle = preferences.fontFamily === 'openDyslexic' 
        ? { fontFamily: 'OpenDyslexic, sans-serif' } 
        : {};
        
      if (!exerciseType || exerciseType === 'selector') {
        return (
          <Button 
            variant="outline" 
            className="w-full mb-2 bg-green-50 hover:bg-green-100"
            style={fontStyle}
            onClick={() => {
              stopCurrentSpeech();
              setTimeout(() => {
                generateAIMessage({ 
                  exerciseType: 'selector', 
                  isFirstInteraction: true, 
                  language: i18n.language 
                }).then(message => {
                  if (message && !isSpeakingRef.current) {
                    speakMessage(message);
                  }
                });
              }, 500);
            }}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            {t('aiTutor.helpButtons.howToStart')}
          </Button>
        );
      }

      if (!isSubmitted) {
        return (
          <>
            <Button 
              variant="outline" 
              className="w-full mb-2 bg-green-50 hover:bg-green-100"
              style={fontStyle}
              onClick={() => {
                stopCurrentSpeech();
                generateAIMessage({ 
                  exerciseType, 
                  conceptType,
                  rowValue,
                  columnValue,
                  isFirstInteraction: false,
                  isHelpRequest: true,
                  language: i18n.language
                }).then(message => {
                  if (message && !isSpeakingRef.current) {
                    speakMessage(message);
                  }
                });
              }}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              {t('aiTutor.helpButtons.howToSolve')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full mb-2 bg-blue-50 hover:bg-blue-100"
              style={fontStyle}
              onClick={() => {
                stopCurrentSpeech();
                generateAIMessage({ 
                  exerciseType, 
                  conceptType,
                  rowValue,
                  columnValue,
                  isFirstInteraction: false,
                  isStuck: true,
                  language: i18n.language
                }).then(message => {
                  if (message && !isSpeakingRef.current) {
                    speakMessage(message);
                  }
                });
              }}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              {t('aiTutor.helpButtons.imStuck')}
            </Button>
          </>
        );
      }

      if (isSubmitted && userAnswer) {
        const correctAnswer = rowValue && columnValue ? rowValue * columnValue : null;
        const submittedAnswer = parseInt(userAnswer);

        if (correctAnswer && submittedAnswer === correctAnswer) {
          return (
            <Button 
              variant="outline" 
              className="w-full mb-2 bg-green-50 hover:bg-green-100"
              style={fontStyle}
              onClick={() => {
                stopCurrentSpeech();
                generateAIMessage({ 
                  exerciseType, 
                  conceptType,
                  rowValue,
                  columnValue,
                  isFirstInteraction: false,
                  isCorrect: true,
                  userAnswer,
                  language: i18n.language
                }).then(message => {
                  if (message && !isSpeakingRef.current) {
                    speakMessage(message);
                  }
                });
              }}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              {t('aiTutor.helpButtons.whatsNext')}
            </Button>
          );
        } else {
          return (
            <>
              <Button 
                variant="outline" 
                className="w-full mb-2 bg-blue-50 hover:bg-blue-100"
                style={fontStyle}
                onClick={() => {
                  stopCurrentSpeech();
                  generateAIMessage({ 
                    exerciseType, 
                    conceptType,
                    rowValue,
                    columnValue,
                    isFirstInteraction: false,
                    isCorrect: false,
                    userAnswer,
                    correctAnswer,
                    language: i18n.language
                  }).then(message => {
                    if (message && !isSpeakingRef.current) {
                      speakMessage(message);
                    }
                  });
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                {t('aiTutor.helpButtons.showMeHow')}
              </Button>
              <Button 
                variant="outline" 
                className="w-full mb-2 bg-yellow-50 hover:bg-yellow-100"
                style={fontStyle}
                onClick={() => {
                  stopCurrentSpeech();
                  generateAIMessage({ 
                    exerciseType, 
                    conceptType,
                    rowValue,
                    columnValue,
                    isFirstInteraction: false,
                    isCorrect: false,
                    userAnswer,
                    correctAnswer,
                    needsExplanation: true,
                    language: i18n.language
                  }).then(message => {
                    if (message && !isSpeakingRef.current) {
                      speakMessage(message);
                    }
                  });
                }}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                {t('aiTutor.helpButtons.helpMeUnderstand')}
              </Button>
            </>
          );
        }
      }

      return null;
    };

    return (
      <aside 
        className={cn(
          "h-full w-64 lg:w-80 bg-[#F2FCE2] overflow-hidden flex flex-col shadow-md border-l border-green-100",
          className
        )}
      >
        <header className="p-4 flex items-center justify-between border-b border-green-200">
          <h2 
            className="text-xl font-medium text-[#1A1F2C]"
            style={{ 
              fontFamily: preferences.fontFamily === 'openDyslexic' ? 'OpenDyslexic, sans-serif' : 'inherit'
            }}
          >
            {t('aiTutor.title')}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-gray-900"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </header>

        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto py-4 px-4 font-sans text-lg"
          style={{ 
            fontFamily: preferences.fontFamily === 'openDyslexic' ? 'OpenDyslexic, sans-serif' : 'inherit'
          }}
        >
          <div className="text-[#1A1F2C] leading-relaxed">
            {displayedWords.map((word, index) => (
              <span 
                key={`${word}-${index}`}
                className={cn(
                  "inline mx-[3px]", // Ensure words have spacing between them
                  index === currentWordIndex && "underline font-medium text-green-600", // Highlight current word
                  index < currentWordIndex && "opacity-100", // Show previous words normally
                  index > currentWordIndex && "opacity-80" // Slightly dim future words
                )}
              >
                {word}{' '}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-green-200">
          {getHelpButtons()}
        </div>

        {isPlaying && (
          <div 
            className="text-sm text-[#8E9196] p-4 border-t border-green-200"
            style={{ 
              fontFamily: preferences.fontFamily === 'openDyslexic' ? 'OpenDyslexic, sans-serif' : 'inherit'
            }}
          >
            {isMuted ? t('aiTutor.typingStatus') : t('aiTutor.listeningStatus')}
          </div>
        )}

        {showNextButton && (
          <button
            onClick={onNextClick}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            style={{ 
              fontFamily: preferences.fontFamily === 'openDyslexic' ? 'OpenDyslexic, sans-serif' : 'inherit'
            }}
          >
            {t('aiTutor.nextButton')}
          </button>
        )}
      </aside>
    );
  }
);

AITutorSidebar.displayName = 'AITutorSidebar';
export default AITutorSidebar; 