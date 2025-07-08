import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

const Confetti: React.FC<ConfettiProps> = ({
  active,
  duration = 3000,
  particleCount = 200
}) => {
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (active && !confettiActive) {
      setConfettiActive(true);
      
      // Launch confetti
      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4B9CD3', '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2']
      });
      
      // For a continuous effect during the duration
      const interval = setInterval(() => {
        confetti({
          particleCount: particleCount / 3,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4B9CD3', '#FF6B6B', '#FFD166', '#06D6A0', '#118AB2']
        });
      }, 750);
      
      // Stop after duration
      setTimeout(() => {
        clearInterval(interval);
        setConfettiActive(false);
      }, duration);
      
      return () => clearInterval(interval);
    }
  }, [active, confettiActive, duration, particleCount]);

  return null; // This component doesn't render anything visible
};

export default Confetti; 