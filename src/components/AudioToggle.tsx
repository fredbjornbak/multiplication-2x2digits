import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioToggleProps {
  isAudioEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

const AudioToggle: React.FC<AudioToggleProps> = ({ 
  isAudioEnabled, 
  onToggle,
  className
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={onToggle}
      aria-label={isAudioEnabled ? "Disable audio" : "Enable audio"}
      title={isAudioEnabled ? "Disable audio" : "Enable audio"}
    >
      {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </Button>
  );
};

export default AudioToggle; 