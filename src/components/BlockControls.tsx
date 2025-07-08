
import React from 'react';
import { Plus, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


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
    <div className={cn("bg-white p-4 rounded-lg shadow-md", className)}>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Button
          onClick={() => onAddBlock(100)}
          className="bg-indigo-700 text-white hover:bg-indigo-800 flex items-center justify-center"
          disabled={isDisabled}
          data-testid="add-100-block-btn"
          variant="default"
        >
          <Plus size={16} className="mr-1" />
          <span className="font-medium">100</span>
        </Button>
        
        <Button
          onClick={() => onAddBlock(10)}
          className="bg-green-600 text-white hover:bg-green-700 flex items-center justify-center"
          disabled={isDisabled}
          data-testid="add-10-block-btn"
          variant="default"
        >
          <Plus size={16} className="mr-1" />
          <span className="font-medium">10</span>
        </Button>
        
        <Button
          onClick={() => onAddBlock(1)}
          className="bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center"
          disabled={isDisabled}
          data-testid="add-1-block-btn"
          variant="default"
        >
          <Plus size={16} className="mr-1" />
          <span className="font-medium">1</span>
        </Button>
      </div>
        
      <div className="flex space-x-2">
        <Button
          onClick={onResetCell}
          className="flex-1"
          disabled={isDisabled}
          data-testid="reset-btn"
          variant="outline"
        >
          <RotateCcw size={18} className="mr-1" />
          <span>Reset</span>
        </Button>
        
        <Button
          onClick={onCheckCell}
          className="flex-1"
          disabled={isDisabled}
          data-testid="check-btn"
          variant="default"
        >
          <Check size={18} className="mr-1" />
          <span>Check Your Result</span>
        </Button>
      </div>
    </div>
  );
};

export default BlockControls;
