import React from 'react';
import MathBlock from './MathBlock';
import { cn } from '@/lib/utils';
import { CheckCircle2, X } from 'lucide-react';

interface GridCellProps {
  row: number;
  col: number;
  isActive: boolean;
  isComplete: boolean;
  label: string;
  blocks: Array<1 | 10 | 100>;
  onClick: (row: number, col: number) => void;
  onRemoveBlock?: (index: number) => void;
  onDropBlock?: (value: 1 | 10 | 100) => void;
  expectedProduct: number;
  className?: string;
  isLargeGrid?: boolean;
  validationStatus?: 'correct' | 'incorrect' | null;
}

const GridCell: React.FC<GridCellProps> = ({
  row,
  col,
  isActive,
  isComplete,
  label,
  blocks,
  onClick,
  onRemoveBlock,
  onDropBlock,
  expectedProduct,
  className,
  isLargeGrid = false,
  validationStatus
}) => {
  const currentSum = blocks.reduce((sum, block) => sum + block, 0);
  const [isDragOver, setIsDragOver] = React.useState(false);
  
  // Always show visual blocks - no compact view
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (isComplete) return;
    
    const value = parseInt(e.dataTransfer.getData('text/plain')) as 1 | 10 | 100;
    if (value && onDropBlock) {
      onDropBlock(value);
    }
  };
  
  // Dynamic sizing based on grid size - More compact
  const cellPadding = isLargeGrid ? "p-0.5" : "p-1";
  const labelSize = isLargeGrid ? "text-xs" : "text-xs";
  const currentSize = isLargeGrid ? "text-xs" : "text-sm";
  const completeSize = isLargeGrid ? "text-xs" : "text-sm";
  const blockAreaHeight = isLargeGrid ? "min-h-[30px]" : "min-h-[40px]";

  return (
    <div 
      className={cn(
        "h-full border-2 rounded-xl transition-all border-border bg-card",
        isComplete ? "border-green-500 bg-green-50" : "",
        validationStatus === 'correct' && !isComplete ? "border-green-400 bg-green-50" : "",
        validationStatus === 'incorrect' ? "border-red-400 bg-red-50" : "",
        isDragOver && !isComplete ? "border-blue-400 bg-blue-100 border-dashed border-4" : "",
        cellPadding,
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`grid-cell-${row}-${col}`}
    >
      <div className={cn("text-foreground font-semibold mb-1", labelSize)}>{label}</div>
      
      {/* Individual cell counter */}
      {!isComplete && blocks.length > 0 && (
        <div className={cn("text-center font-bold text-primary mb-1", currentSize)}>
          {currentSum}
        </div>
      )}
      
      {isComplete ? (
        <div className={cn("text-green-600 font-bold flex items-center justify-center gap-1 mt-1", completeSize)}>
          <CheckCircle2 size={isLargeGrid ? 14 : 18} />
          <span className={isLargeGrid ? "text-xs" : "text-sm"}>Complete!</span>
        </div>
      ) : validationStatus === 'correct' ? (
        <div className={cn("text-green-600 font-bold flex items-center justify-center gap-1 mt-1", completeSize)}>
          <CheckCircle2 size={isLargeGrid ? 14 : 18} />
          <span className={isLargeGrid ? "text-xs" : "text-sm"}>Correct!</span>
        </div>
      ) : validationStatus === 'incorrect' ? (
        <div className={cn("text-red-600 font-bold flex items-center justify-center gap-1 mt-1", completeSize)}>
          <X size={isLargeGrid ? 14 : 18} />
          <span className={isLargeGrid ? "text-xs" : "text-sm"}>Incorrect</span>
        </div>
      ) : (
        <div className={cn("flex flex-wrap gap-1 justify-center items-center p-1 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30", blockAreaHeight)}>
            {blocks.length === 0 ? (
              <div className={cn("text-muted-foreground font-medium", isLargeGrid ? "text-xs" : "text-sm")}>
                Drop blocks here
              </div>
            ) : (
              <>
                {/* Always show individual visual blocks */}
                {blocks.map((block, index) => (
                  <MathBlock 
                    key={`${block}-${index}`} 
                    value={block} 
                    isRemovable={onRemoveBlock !== undefined}
                    onRemove={() => onRemoveBlock?.(index)}
                    showAsDots={!isLargeGrid}
                    className={isLargeGrid ? "w-6 h-6 text-xs" : undefined}
                  />
                ))}
              </>
            )}
          </div>
      )}
    </div>
  );
};

export default GridCell; 