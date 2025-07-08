
import { useTts } from '@/contexts/TtsContext';
import { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useTranslation } from 'react-i18next';

interface TtsSpeechBubbleProps {
  className?: string;
}

const TtsSpeechBubble: React.FC<TtsSpeechBubbleProps> = ({ className }) => {
  const { isSpeaking, isMuted, toggleMute, displayedWords, currentWordIndex, stopSpeaking } = useTts();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { preferences } = usePreferencesStore();
  const lastWordCount = useRef<number>(0);
  const { t } = useTranslation();

  // Auto-scroll as new words appear
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
    
    // If words have changed (new message), update lastWordCount
    if (displayedWords.length !== lastWordCount.current) {
      lastWordCount.current = displayedWords.length;
    }
  }, [displayedWords, currentWordIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // No need to call stopSpeaking here as it might interfere with other components
      // The TtsContext will handle cleanup when the app unmounts
    };
  }, []);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Message display area */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-auto p-4 bg-green-50 rounded-t-lg"
        style={{ 
          fontFamily: preferences.fontFamily === 'openDyslexic' ? 'OpenDyslexic, sans-serif' : 'inherit'
        }}
      >
        {displayedWords.length > 0 ? (
          <p className="text-lg">
            {displayedWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className={cn(
                  "inline-block mr-1",
                  index <= currentWordIndex && "text-green-800",
                  index > currentWordIndex && "text-green-500"
                )}
              >
                {word}
              </span>
            ))}
          </p>
        ) : (
          <div className="text-center text-green-600 h-full flex items-center justify-center">
            <p className="text-sm">{t('aiTutorBubble.readyToHelp')}</p>
          </div>
        )}
      </div>

      {/* Mute button */}
      <div className="p-2 border-t border-green-200 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="text-green-700 hover:text-green-800 hover:bg-green-100"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        
        {isSpeaking && (
          <div 
            className="text-sm text-[#8E9196] animate-pulse"
            style={{ 
              fontFamily: preferences.fontFamily === 'openDyslexic' ? 'OpenDyslexic, sans-serif' : 'inherit'
            }}
          >
            {isMuted ? "Typing..." : "Speaking..."}
          </div>
        )}
        
        {/* Stop button - only show when speaking */}
        {isSpeaking && (
          <Button
            variant="ghost"
            size="sm"
            onClick={stopSpeaking}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Stop speaking"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </Button>
        )}
      </div>

      {/* Add voice.gif display when tutor is speaking */}
      {isSpeaking && (
        <div className="flex justify-center mb-2">
          <div className="sound-wave">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      )}
      <style>
        {`
        .sound-wave {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 30px;
        }
        .bar {
          width: 3px;
          height: 100%;
          background-color: #16a34a;
          border-radius: 3px;
          animation: sound 0.5s ease-in-out infinite;
        }
        .bar:nth-child(1) { animation-delay: 0.0s; }
        .bar:nth-child(2) { animation-delay: 0.1s; }
        .bar:nth-child(3) { animation-delay: 0.2s; }
        .bar:nth-child(4) { animation-delay: 0.3s; }
        .bar:nth-child(5) { animation-delay: 0.4s; }
        @keyframes sound {
          0% { height: 5px; }
          50% { height: 30px; }
          100% { height: 5px; }
        }
        `}
      </style>
    </div>
  );
};

export default TtsSpeechBubble;
