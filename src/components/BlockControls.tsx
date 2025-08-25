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
    <div className={cn("bg-card border-2 border-border rounded-xl p-2 lg:p-3 shadow-sm", className)}>
      {/* Drag Blocks Section */}
      <div className="text-center mb-2">
        <h3 className="text-sm lg:text-base font-semibold text-foreground mb-2">Drag!</h3>
        <div className="flex justify-center gap-2 lg:gap-3">
          <div className="text-center">
            <MathBlock 
              value={100} 
              isDraggable={true} 
              className="hover:scale-110 transition-transform mb-1 w-12 h-12 lg:w-14 lg:h-14 text-sm lg:text-base" 
            />
          </div>
          <div className="text-center">
            <MathBlock 
              value={10} 
              isDraggable={true} 
              className="hover:scale-110 transition-transform mb-1 w-12 h-12 lg:w-14 lg:h-14 text-sm lg:text-base" 
            />
          </div>
          <div className="text-center">
            <MathBlock 
              value={1} 
              isDraggable={true} 
              className="hover:scale-110 transition-transform mb-1 w-12 h-12 lg:w-14 lg:h-14 text-sm lg:text-base" 
            />
          </div>
        </div>
      </div>
        
      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <Button 
          onClick={onResetCell} 
          disabled={isDisabled} 
          data-testid="reset-btn" 
          variant="outline" 
          size="sm" 
          className="min-w-[80px] lg:min-w-[100px] text-xs lg:text-sm"
        >
          <RotateCcw size={12} className="mr-1" />
          Reset Cell
        </Button>
        
        <Button 
          onClick={onCheckGrid} 
          disabled={isDisabled} 
          data-testid="check-btn" 
          variant="default" 
          size="sm" 
          className="min-w-[80px] lg:min-w-[100px] text-xs lg:text-sm"
        >
          <Check size={12} className="mr-1" />
          Check Answer
        </Button>
      </div>
    </div>
  );
};

export default BlockControls;