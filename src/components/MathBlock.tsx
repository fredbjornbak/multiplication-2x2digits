import React from 'react';
import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';

interface MathBlockProps {
  value: 1 | 10 | 100;
  isAnimated?: boolean;
  className?: string;
  onRemove?: () => void;
  isRemovable?: boolean;
}

const MathBlock: React.FC<MathBlockProps> = ({ 
  value, 
  isAnimated = true,
  className,
  onRemove,
  isRemovable = false
}) => {
  // Define different styles based on block value
  const getBlockStyles = () => {
    const baseStyles = "flex items-center justify-center font-medium text-white rounded-md transition-all relative group";
    
    switch (value) {
      case 1:
        return cn(baseStyles, "w-8 h-8 bg-amber-500 hover:bg-amber-600", className);
      case 10:
        return cn(baseStyles, "w-10 h-10 bg-green-600 hover:bg-green-700", className);
      case 100:
        return cn(baseStyles, "w-12 h-12 bg-indigo-700 hover:bg-indigo-800", className);
      default:
        return cn(baseStyles, "w-8 h-8 bg-amber-500 hover:bg-amber-600", className);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the GridCell onClick
    if (isRemovable && onRemove) {
      onRemove();
    }
  };

  return (
    <div
      className={getBlockStyles()}
      data-testid={`math-block-${value}`}
      onClick={handleClick}
      role={isRemovable ? "button" : undefined}
      aria-label={isRemovable ? `Remove ${value} block` : undefined}
    >
      {isRemovable && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-md flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
          <Minus size={14} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default MathBlock; 