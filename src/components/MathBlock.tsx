import React from 'react';
import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';

interface MathBlockProps {
  value: 1 | 10 | 100;
  isAnimated?: boolean;
  className?: string;
  onRemove?: () => void;
  isRemovable?: boolean;
  onClick?: () => void;
  showAsDots?: boolean;
}

const MathBlock: React.FC<MathBlockProps> = ({ 
  value, 
  isAnimated = true,
  className,
  onRemove,
  isRemovable = false,
  onClick,
  showAsDots = false
}) => {
  // Define different styles based on block value and display mode
  const getBlockStyles = () => {
    if (showAsDots) {
      // Smaller, dot-based styling for grid cells
      const baseDotStyles = "flex items-center justify-center rounded-full transition-all relative group cursor-pointer shadow-sm";
      switch (value) {
        case 1:
          return cn(baseDotStyles, "bg-amber-500 hover:bg-amber-600 w-4 h-4", className);
        case 10:
          return cn(baseDotStyles, "bg-green-600 hover:bg-green-700 w-5 h-5", className);
        case 100:
          return cn(baseDotStyles, "bg-indigo-700 hover:bg-indigo-800 w-6 h-6", className);
        default:
          return cn(baseDotStyles, "bg-amber-500 hover:bg-amber-600 w-4 h-4", className);
      }
    } else {
      // Regular numbered block styling for click controls
      const baseStyles = "flex items-center justify-center font-medium text-white rounded-md transition-all relative group cursor-pointer w-16 h-16 text-lg shadow-md";
      switch (value) {
        case 1:
          return cn(baseStyles, "bg-amber-500 hover:bg-amber-600 hover:scale-105", className);
        case 10:
          return cn(baseStyles, "bg-green-600 hover:bg-green-700 hover:scale-105", className);
        case 100:
          return cn(baseStyles, "bg-indigo-700 hover:bg-indigo-800 hover:scale-105", className);
        default:
          return cn(baseStyles, "bg-amber-500 hover:bg-amber-600 hover:scale-105", className);
      }
    }
  };

  // Render dots for different values
  const renderDots = () => {
    switch (value) {
      case 1:
        return null; // Just the colored background circle
      case 10:
        return null; // Just the colored background circle
      case 100:
        return null; // Just the colored background circle
      default:
        return null; // Just the colored background circle
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the GridCell onClick
    if (isRemovable && onRemove) {
      onRemove();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={getBlockStyles()}
      data-testid={`math-block-${value}`}
      onClick={handleClick}
      role="button"
      aria-label={isRemovable ? `Remove ${value} block` : `Add ${value} block`}
    >
      {showAsDots ? renderDots() : value}
      {isRemovable && (
        <div className={cn(
          "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100",
          showAsDots ? "rounded-full" : "rounded-md"
        )}>
          <Minus size={showAsDots ? 8 : 16} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default MathBlock; 