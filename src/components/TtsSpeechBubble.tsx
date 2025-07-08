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
const TtsSpeechBubble: React.FC<TtsSpeechBubbleProps> = ({
  className
}) => {
  const {
    isSpeaking,
    isMuted,
    toggleMute,
    displayedWords,
    currentWordIndex,
    stopSpeaking
  } = useTts();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const {
    preferences
  } = usePreferencesStore();
  const lastWordCount = useRef<number>(0);
  const {
    t
  } = useTranslation();

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
  return;
};
export default TtsSpeechBubble;