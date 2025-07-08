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
  className
}) => {
  const currentSum = blocks.reduce((sum, block) => sum + block, 0);
  const [isDragOver, setIsDragOver] = React.useState(false);
  
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
  
  return (
    <div 
      className={cn(
        "h-full border rounded-md p-3 transition-all min-h-[120px]", 
        isActive ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white",
        isComplete ? "border-green-500 bg-green-50" : "",
        isDragOver && !isComplete ? "border-blue-400 bg-blue-100 border-dashed" : "",
        className
      )}
      onClick={() => onClick(row, col)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`grid-cell-${row}-${col}`}
    >
      <div className="text-gray-600 text-xs font-medium mb-1">{label}</div>
      
      {isComplete ? (
        <div className="text-green-600 font-bold text-sm flex items-center justify-center gap-1">
          <CheckCircle2 size={14} />
          <span className="text-xs">Done</span>
        </div>
      ) : (
        <>
          <div className="text-blue-600 font-bold text-sm mb-1">
            {currentSum}
          </div>
          
          <div className="flex flex-wrap gap-1 justify-center">
            {blocks.map((block, index) => (
              <MathBlock 
                key={`${block}-${index}`} 
                value={block} 
                isRemovable={isActive && onRemoveBlock !== undefined}
                onRemove={() => onRemoveBlock?.(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GridCell; 