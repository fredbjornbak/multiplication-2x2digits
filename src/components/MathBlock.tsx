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
}

const MathBlock: React.FC<MathBlockProps> = ({ 
  value, 
  isAnimated = true,
  className,
  onRemove,
  isRemovable = false,
  isDraggable = false,
  onDragStart
}) => {
  // Define different styles based on block value (made smaller)
  const getBlockStyles = () => {
    const baseStyles = "flex items-center justify-center font-medium text-white rounded-md transition-all relative group cursor-pointer";
    
    switch (value) {
      case 1:
        return cn(baseStyles, "w-6 h-6 text-xs bg-amber-500 hover:bg-amber-600", isDraggable ? "cursor-grab active:cursor-grabbing" : "", className);
      case 10:
        return cn(baseStyles, "w-7 h-7 text-xs bg-green-600 hover:bg-green-700", isDraggable ? "cursor-grab active:cursor-grabbing" : "", className);
      case 100:
        return cn(baseStyles, "w-8 h-8 text-sm bg-indigo-700 hover:bg-indigo-800", isDraggable ? "cursor-grab active:cursor-grabbing" : "", className);
      default:
        return cn(baseStyles, "w-6 h-6 text-xs bg-amber-500 hover:bg-amber-600", isDraggable ? "cursor-grab active:cursor-grabbing" : "", className);
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
      {value}
      {isRemovable && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-md flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
          <Minus size={10} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default MathBlock; 