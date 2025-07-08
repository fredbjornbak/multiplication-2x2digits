// Sound utility functions
type SoundType = 'click' | 'add' | 'reset' | 'correct' | 'incorrect' | 'celebration' | 'error';

// Global variable for audio context to avoid creating multiple instances
let audioContextInstance: AudioContext | null = null;

// Helper to get or create the audio context
const getAudioContext = (): AudioContext | null => {
  if (audioContextInstance) return audioContextInstance;
  
  // Create audio context only if we're in the browser
  if (typeof window !== 'undefined') {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextInstance = new AudioContext();
        return audioContextInstance;
      }
    } catch (error) {
      console.error('Error creating AudioContext:', error);
    }
  }
  
  return null;
};

// Play different sound effects
export const playSound = (type: SoundType): void => {
  const audioContext = getAudioContext();
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Configure sound based on type
  switch (type) {
    case 'click':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
      
    case 'add':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
      
    case 'reset':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
      
    case 'correct':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
      
    case 'incorrect':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
      
    case 'celebration':
      // Play a sequence of notes for celebration
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const noteOsc = audioContext.createOscillator();
        const noteGain = audioContext.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(audioContext.destination);
        
        const start = index * 0.15;
        const duration = 0.2;
        
        noteOsc.frequency.value = freq;
        noteGain.gain.setValueAtTime(0.2, audioContext.currentTime + start);
        noteGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
        
        noteOsc.start(audioContext.currentTime + start);
        noteOsc.stop(audioContext.currentTime + start + duration);
      });
      break;
      
    case 'error':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
  }
}; 