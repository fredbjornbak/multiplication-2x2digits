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
        "h-full border-2 rounded-xl p-2 lg:p-3 transition-all min-h-[100px] md:min-h-[120px] lg:min-h-[140px] border-gray-300 bg-white",
        isComplete ? "border-green-500 bg-green-50" : "",
        isDragOver && !isComplete ? "border-blue-400 bg-blue-100 border-dashed border-4" : "",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`grid-cell-${row}-${col}`}
    >
      <div className="text-gray-700 text-sm lg:text-base font-semibold mb-2">{label}</div>
      
      {isComplete ? (
        <div className="text-green-600 font-bold text-lg flex items-center justify-center gap-1 mt-2">
          <CheckCircle2 size={18} />
          <span className="text-sm">Complete!</span>
        </div>
      ) : (
        <>
          <div className="text-blue-600 font-bold text-lg mb-2">
            Current: {currentSum}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center items-center min-h-[60px] md:min-h-[80px] lg:min-h-[100px] p-2 bg-gray-50 rounded-lg border-2 border-dashed border-gray-400">
            {blocks.length === 0 ? (
              <div className="text-gray-500 text-sm font-medium">Drop blocks here</div>
            ) : (
              blocks.map((block, index) => (
                <MathBlock 
                  key={`${block}-${index}`} 
                  value={block} 
                  isRemovable={onRemoveBlock !== undefined}
                  onRemove={() => onRemoveBlock?.(index)}
                  showAsDots={true}
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