import React from 'react';
import GridCell from './GridCell';
import { cn } from '@/lib/utils';

interface MultiplicationGridProps {
  factor1: number;
  factor2: number;
  onCellClick: (row: number, col: number) => void;
  onRemoveBlock?: (cellId: string, blockIndex: number) => void;
  onDropBlock?: (cellId: string, value: 1 | 10 | 100) => void;
  cellBlocks: Record<string, Array<1 | 10 | 100>>;
  completedCells: string[];
  activeCell: string | null;
  className?: string;
}

const MultiplicationGrid: React.FC<MultiplicationGridProps> = ({
  factor1,
  factor2,
  onCellClick,
  onRemoveBlock,
  onDropBlock,
  cellBlocks,
  completedCells,
  activeCell,
  className
}) => {
  // Split numbers into digits for place value
  const splitNumber = (num: number): number[] => {
    const digits = [];
    let remaining = num;
    
    // Handle tens digit
    const tens = Math.floor(remaining / 10);
    if (tens > 0) {
      digits.push(tens * 10);
      remaining -= tens * 10;
    }
    
    // Handle ones digit
    if (remaining > 0) {
      digits.push(remaining);
    }
    
    return digits;
  };

  const factor1Digits = splitNumber(factor1);
  const factor2Digits = splitNumber(factor2);

  // Handle removing a block from a cell
  const handleRemoveBlock = (cellId: string, blockIndex: number) => {
    if (onRemoveBlock) {
      onRemoveBlock(cellId, blockIndex);
    }
  };

  return (
    <div className={cn("relative bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto", className)}>
      {/* Top row with factor2 digits */}
      <div className="flex">
        <div className="w-20 h-20 flex items-center justify-center bg-gray-50 border-b border-r border-gray-200"></div> {/* Empty top-left corner */}
        {factor2Digits.map((digit, index) => (
          <div key={`top-${index}`} className="flex-1 flex items-center justify-center h-20 font-bold text-2xl text-gray-700 bg-gray-50 border-b border-r border-gray-200">
            {digit}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {factor1Digits.map((digit1, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {/* Left column with factor1 digits */}
          <div className="w-20 flex items-center justify-center font-bold text-2xl text-gray-700 bg-gray-50 border-b border-r border-gray-200">
            {digit1}
          </div>
          
          {/* Grid cells */}
          {factor2Digits.map((digit2, colIndex) => {
            const cellId = `${rowIndex}-${colIndex}`;
            const isActive = activeCell === cellId;
            const isComplete = completedCells.includes(cellId);
            const product = digit1 * digit2;
            
            return (
              <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 h-64 border-b border-r border-gray-200">
                <GridCell
                  row={rowIndex}
                  col={colIndex}
                  isActive={isActive}
                  isComplete={isComplete}
                  label={`${digit1} × ${digit2}`}
                  blocks={cellBlocks[cellId] || []}
                  onClick={onCellClick}
                  onRemoveBlock={
                    onRemoveBlock && !isComplete
                      ? (blockIndex) => handleRemoveBlock(cellId, blockIndex)
                      : undefined
                  }
                  onDropBlock={
                    onDropBlock && !isComplete
                      ? (value) => onDropBlock(cellId, value)
                      : undefined
                  }
                  expectedProduct={product}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MultiplicationGrid; 