
import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MathBlock from './MathBlock';


interface BlockControlsProps {
  onAddBlock: (value: 1 | 10 | 100) => void;
  onResetCell: () => void;
  onCheckCell: () => void;
  isDisabled?: boolean;
  className?: string;
  isActive?: boolean;
  isComplete?: boolean;
}

const BlockControls: React.FC<BlockControlsProps> = ({
  onAddBlock,
  onResetCell,
  onCheckCell,
  isDisabled = false,
  className
}) => {
  

  return (
    <div className={cn("bg-white p-2 rounded-lg shadow-md", className)}>
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Drag blocks to add them:</div>
        <div className="flex justify-center gap-2">
          <MathBlock 
            value={100} 
            isDraggable={true}
            className="hover:scale-110 transition-transform"
          />
          <MathBlock 
            value={10} 
            isDraggable={true}
            className="hover:scale-110 transition-transform"
          />
          <MathBlock 
            value={1} 
            isDraggable={true}
            className="hover:scale-110 transition-transform"
          />
        </div>
      </div>
        
      <div className="flex space-x-2">
        <Button
          onClick={onResetCell}
          className="flex-1"
          disabled={isDisabled}
          data-testid="reset-btn"
          variant="outline"
          size="sm"
        >
          <RotateCcw size={14} className="mr-1" />
          <span className="text-sm">Reset</span>
        </Button>
        
        <Button
          onClick={onCheckCell}
          className="flex-1"
          disabled={isDisabled}
          data-testid="check-btn"
          variant="default"
          size="sm"
        >
          <Check size={14} className="mr-1" />
          <span className="text-sm">Check</span>
        </Button>
      </div>
    </div>
  );
};

export default BlockControls;
