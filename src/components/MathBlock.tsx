import React from 'react';
import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';

interface MathBlockProps {
  value: 1 | 10 | 100;
  isAnimated?: boolean;
  className?: string;
  onRemove?: () => void;
  isRemovable?: boolean;
  isDraggable?: boolean;
  onDragStart?: (value: 1 | 10 | 100) => void;
  showAsDots?: boolean;
}

const MathBlock: React.FC<MathBlockProps> = ({ 
  value, 
  isAnimated = true,
  className,
  onRemove,
  isRemovable = false,
  isDraggable = false,
  onDragStart,
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
      // Regular numbered block styling for drag controls
      const baseStyles = "flex items-center justify-center font-medium text-white rounded-md transition-all relative group cursor-pointer w-16 h-16 text-lg shadow-md";
      switch (value) {
        case 1:
          return cn(baseStyles, "bg-amber-500 hover:bg-amber-600", isDraggable ? "cursor-grab active:cursor-grabbing" : "", className);
        case 10:
          return cn(baseStyles, "bg-green-600 hover:bg-green-700", isDraggable ? "cursor-grab active:cursor-grabbing" : "", className);
        case 100:
          return cn(baseStyles, "bg-indigo-700 hover:bg-indigo-800", isDraggable ? "cursor-grab active:cursor-grabbing" : "", className);
        default:
          return cn(baseStyles, "bg-amber-500 hover:bg-amber-600", isDraggable ? "cursor-grab active:cursor-grabbing" : "", className);
      }
    }
  };

  // Render dots for different values
  const renderDots = () => {
    switch (value) {
      case 1:
        return <div className="w-2 h-2 bg-white rounded-full"></div>;
      case 10:
        return (
          <div className="flex flex-wrap gap-0.5 justify-center items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
            ))}
          </div>
        );
      case 100:
        return (
          <div className="grid grid-cols-3 gap-0.5 justify-center items-center">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
            ))}
          </div>
        );
      default:
        return <div className="w-2 h-2 bg-white rounded-full"></div>;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the GridCell onClick
    if (isRemovable && onRemove) {
      onRemove();
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', value.toString());
    e.dataTransfer.effectAllowed = 'copy';
    if (onDragStart) {
      onDragStart(value);
    }
  };

  return (
    <div
      className={getBlockStyles()}
      data-testid={`math-block-${value}`}
      onClick={handleClick}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      role={isRemovable ? "button" : undefined}
      aria-label={isRemovable ? `Remove ${value} block` : isDraggable ? `Drag ${value} block` : undefined}
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