import React from 'react';
import MathBlock from './MathBlock';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

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
  isLargeGrid = false
}) => {
  const currentSum = blocks.reduce((sum, block) => sum + block, 0);
  const [isDragOver, setIsDragOver] = React.useState(false);
  
  // Count blocks by type for compact display
  const blockCounts = blocks.reduce((counts, block) => {
    counts[block] = (counts[block] || 0) + 1;
    return counts;
  }, {} as Record<number, number>);
  
  // Use compact view when there are many blocks or in large grids
  const useCompactView = blocks.length > 8 || isLargeGrid;
  
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
  
  // Dynamic sizing based on grid size
  const cellPadding = isLargeGrid ? "p-1" : "p-2 lg:p-3";
  const labelSize = isLargeGrid ? "text-xs" : "text-sm lg:text-base";
  const currentSize = isLargeGrid ? "text-sm" : "text-lg";
  const completeSize = isLargeGrid ? "text-sm" : "text-lg";
  const blockAreaHeight = isLargeGrid ? "min-h-[40px]" : "min-h-[60px] md:min-h-[80px] lg:min-h-[100px]";

  return (
    <div 
      className={cn(
        "h-full border-2 rounded-xl transition-all border-border bg-card",
        isComplete ? "border-green-500 bg-green-50" : "",
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
      
      {isComplete ? (
        <div className={cn("text-green-600 font-bold flex items-center justify-center gap-1 mt-1", completeSize)}>
          <CheckCircle2 size={isLargeGrid ? 14 : 18} />
          <span className={isLargeGrid ? "text-xs" : "text-sm"}>Complete!</span>
        </div>
      ) : (
        <>
          <div className={cn("text-blue-600 font-bold mb-1", currentSize)}>
            Current: {currentSum}
          </div>
          
          <div className={cn("flex flex-wrap gap-1 justify-center items-center p-1 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30", blockAreaHeight)}>
            {blocks.length === 0 ? (
              <div className={cn("text-muted-foreground font-medium", isLargeGrid ? "text-xs" : "text-sm")}>
                Drop blocks here
              </div>
            ) : useCompactView ? (
              // Compact view - show counts instead of individual blocks
              <div className="flex flex-col gap-1 text-center">
                {Object.entries(blockCounts).map(([value, count]) => (
                  <div key={value} className={cn("font-medium text-foreground", isLargeGrid ? "text-xs" : "text-sm")}>
                    {count}×{value}
                  </div>
                ))}
                <button 
                  onClick={() => onRemoveBlock?.(blocks.length - 1)}
                  className={cn("text-red-500 hover:text-red-700 font-bold", isLargeGrid ? "text-xs" : "text-sm")}
                >
                  Remove Last
                </button>
              </div>
            ) : (
              // Normal view - show individual blocks
              blocks.map((block, index) => (
                <MathBlock 
                  key={`${block}-${index}`} 
                  value={block} 
                  isRemovable={onRemoveBlock !== undefined}
                  onRemove={() => onRemoveBlock?.(index)}
                  showAsDots={!isLargeGrid}
                  className={isLargeGrid ? "w-6 h-6 text-xs" : undefined}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GridCell; 