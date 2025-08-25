import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MathBlock from './MathBlock';

interface BlockControlsProps {
  onAddBlock: (value: 1 | 10 | 100) => void;
  onResetCell: () => void;
  onCheckGrid: () => void;
  onAutoComplete?: () => void;
  isDisabled?: boolean;
  className?: string;
  isActive?: boolean;
  isComplete?: boolean;
}

const BlockControls: React.FC<BlockControlsProps> = ({
  onAddBlock,
  onResetCell,
  onCheckGrid,
  onAutoComplete,
  isDisabled = false,
  className
}) => {
  return (
    <div className={cn("bg-card border-2 border-border rounded-xl p-1 lg:p-2 shadow-sm", className)}>
      {/* Drag Blocks Section */}
      <div className="text-center mb-1 lg:mb-2">
        <h3 className="text-xs lg:text-sm font-semibold text-foreground mb-1 lg:mb-2">Drag!</h3>
        <div className="flex justify-center gap-1 lg:gap-2">
          <div className="text-center">
            <MathBlock 
              value={100} 
              isDraggable={true} 
              className="hover:scale-110 transition-transform mb-1 w-8 h-8 lg:w-12 lg:h-12 text-xs lg:text-sm" 
            />
          </div>
          <div className="text-center">
            <MathBlock 
              value={10} 
              isDraggable={true} 
              className="hover:scale-110 transition-transform mb-1 w-8 h-8 lg:w-12 lg:h-12 text-xs lg:text-sm" 
            />
          </div>
          <div className="text-center">
            <MathBlock 
              value={1} 
              isDraggable={true} 
              className="hover:scale-110 transition-transform mb-1 w-8 h-8 lg:w-12 lg:h-12 text-xs lg:text-sm" 
            />
          </div>
        </div>
      </div>
        
      {/* Action Buttons */}
      <div className="flex gap-1 lg:gap-2 justify-center flex-wrap">
        <Button 
          onClick={onResetCell} 
          disabled={isDisabled} 
          data-testid="reset-btn" 
          variant="outline" 
          size="sm" 
          className="min-w-[60px] lg:min-w-[80px] text-xs lg:text-sm px-2 lg:px-3 h-7 lg:h-8"
        >
          <RotateCcw size={10} className="mr-1" />
          Reset
        </Button>
        
        <Button 
          onClick={onCheckGrid} 
          disabled={isDisabled} 
          data-testid="check-btn" 
          variant="default" 
          size="sm" 
          className="min-w-[60px] lg:min-w-[80px] text-xs lg:text-sm px-2 lg:px-3 h-7 lg:h-8 gradeaid-button-shadow hover-scale"
        >
          <Check size={10} className="mr-1" />
          Check
        </Button>

        {onAutoComplete && (
          <Button 
            onClick={onAutoComplete} 
            disabled={isDisabled} 
            data-testid="auto-complete-btn" 
            variant="secondary" 
            size="sm" 
            className="min-w-[60px] lg:min-w-[80px] text-xs lg:text-sm px-2 lg:px-3 h-7 lg:h-8"
          >
            🎯 Auto
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlockControls;