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
    <div className={cn("relative bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto border-2 border-gray-200", className)}>
      {/* Top row with factor2 digits */}
      <div className="flex">
        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 border-b-2 border-r-2 border-gray-300"></div> {/* Empty top-left corner */}
        {factor2Digits.map((digit, index) => (
          <div key={`top-${index}`} className="flex-1 flex items-center justify-center h-32 font-bold text-4xl text-gray-700 bg-gray-100 border-b-2 border-r-2 border-gray-300">
            {digit}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {factor1Digits.map((digit1, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {/* Left column with factor1 digits */}
          <div className="w-32 flex items-center justify-center font-bold text-4xl text-gray-700 bg-gray-100 border-b-2 border-r-2 border-gray-300">
            {digit1}
          </div>
          
          {/* Grid cells */}
          {factor2Digits.map((digit2, colIndex) => {
            const cellId = `${rowIndex}-${colIndex}`;
            const isActive = activeCell === cellId;
            const isComplete = completedCells.includes(cellId);
            const product = digit1 * digit2;
            
            return (
              <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 h-80 border-b-2 border-r-2 border-gray-300">
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