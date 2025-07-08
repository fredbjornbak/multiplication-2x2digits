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
  expectedProduct,
  className
}) => {
  const currentSum = blocks.reduce((sum, block) => sum + block, 0);
  
  return (
    <div 
      className={cn(
        "h-full border rounded-md p-3 transition-all", 
        isActive ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white",
        isComplete ? "border-green-500 bg-green-50" : "",
        className
      )}
      onClick={() => onClick(row, col)}
      data-testid={`grid-cell-${row}-${col}`}
    >
      <div className="text-gray-600 text-sm font-medium mb-2">{label}</div>
      
      {isComplete ? (
        <div className="text-green-600 font-bold text-lg flex items-center justify-center gap-1">
          <CheckCircle2 size={18} />
          <span>Complete</span>
        </div>
      ) : (
        <>
          <div className="text-blue-600 font-bold text-lg mb-2">
            Blocks: {currentSum}
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