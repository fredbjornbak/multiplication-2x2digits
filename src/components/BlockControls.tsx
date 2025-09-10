import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MathBlock from './MathBlock';

interface BlockControlsProps {
  onAddBlock: (value: 1 | 10 | 100) => void;
  onResetCell: () => void;
  onCheckGrid: () => void;
  isDisabled?: boolean;
  className?: string;
  isActive?: boolean;
  isComplete?: boolean;
}

const BlockControls: React.FC<BlockControlsProps> = ({
  onAddBlock,
  onResetCell,
  onCheckGrid,
  isDisabled = false,
  className
}) => {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-1 shadow-sm", className)}>
      {/* Click Blocks Section */}
      <div className="text-center mb-1">
        <h3 className="text-xs font-semibold text-foreground mb-1">Click!</h3>
        <div className="flex justify-center gap-3">
          <MathBlock 
            value={100} 
            onClick={() => onAddBlock(100)}
            className="hover:scale-110 transition-transform w-10 h-10 text-sm cursor-pointer" 
          />
          <MathBlock 
            value={10} 
            onClick={() => onAddBlock(10)}
            className="hover:scale-110 transition-transform w-10 h-10 text-sm cursor-pointer" 
          />
          <MathBlock 
            value={1} 
            onClick={() => onAddBlock(1)}
            className="hover:scale-110 transition-transform w-10 h-10 text-sm cursor-pointer" 
          />
        </div>
      </div>
        
      {/* Action Buttons */}
      <div className="flex gap-1 justify-center flex-wrap">
        <Button 
          onClick={onResetCell} 
          disabled={isDisabled} 
          data-testid="reset-btn" 
          variant="outline" 
          size="sm" 
          className="min-w-[50px] text-xs px-2 h-6"
        >
          <RotateCcw size={8} className="mr-1" />
          Reset
        </Button>
        
        <Button 
          onClick={onCheckGrid} 
          disabled={isDisabled} 
          data-testid="check-btn" 
          variant="default" 
          size="sm" 
          className="min-w-[50px] text-xs px-2 h-6 gradeaid-button-shadow hover-scale"
        >
          <Check size={8} className="mr-1" />
          Check
        </Button>
      </div>
    </div>
  );
};

export default BlockControls;