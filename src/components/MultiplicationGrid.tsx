import React from 'react';
import GridCell from './GridCell';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

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
  onShowHelp?: (factor1: number, factor2: number, problem: string) => void;
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
  className,
  onShowHelp
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

  // Calculate dynamic sizing based on grid dimensions
  const gridRows = factor1Digits.length;
  const gridCols = factor2Digits.length;
  const isLargeGrid = gridRows > 2 || gridCols > 2;
  
  // More compact sizing classes
  const headerSize = isLargeGrid ? "h-5 text-xs" : "h-6 text-xs";
  const labelWidth = isLargeGrid ? "w-6" : "w-8";
  const cellWidth = isLargeGrid ? "min-w-12" : "min-w-16";
  const cellHeight = isLargeGrid ? "min-h-12" : "min-h-16";

  return (
    <div className={cn("relative bg-background rounded-xl overflow-hidden w-fit mx-auto border border-border", className)}>
      {/* Top row with factor2 digits */}
      <div className="flex">
        <div className={cn("flex items-center justify-center bg-muted border-b border-r border-border", labelWidth, headerSize)}>
        </div>
        {factor2Digits.map((digit, index) => (
          <div key={`top-${index}`} className={cn("flex-1 flex items-center justify-center font-bold text-foreground bg-muted border-b border-r border-border", cellWidth, headerSize)}>
            {digit}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {factor1Digits.map((digit1, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {/* Left column with factor1 digits */}
          <div className={cn("flex items-center justify-center font-bold text-foreground bg-muted border-b border-r border-border", labelWidth, cellHeight, headerSize)}>
            {digit1}
          </div>
          
          {/* Grid cells */}
          {factor2Digits.map((digit2, colIndex) => {
            const cellId = `${rowIndex}-${colIndex}`;
            const isActive = activeCell === cellId;
            const isComplete = completedCells.includes(cellId);
            const product = digit1 * digit2;
            return (
              <div key={`cell-${rowIndex}-${colIndex}`} className={cn("flex-1 border-b border-r border-border relative", cellWidth, cellHeight)}>
                {/* Help button for this specific cell */}
                {onShowHelp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShowHelp(digit1, digit2, `${digit1} × ${digit2}`)}
                    className={cn("absolute top-0.5 right-0.5 z-20 rounded-full p-0 bg-background/90 hover:bg-background border-border shadow-sm hover:shadow-md transition-all duration-200",
                      isLargeGrid ? "w-3 h-3" : "w-4 h-4"
                    )}
                  >
                    <HelpCircle className={cn("text-muted-foreground hover:text-foreground transition-colors",
                      isLargeGrid ? "h-2 w-2" : "h-2.5 w-2.5"
                    )} />
                  </Button>
                )}
                <GridCell 
                  row={rowIndex} 
                  col={colIndex} 
                  isActive={false} 
                  isComplete={isComplete} 
                  label={`${digit1} × ${digit2}`} 
                  blocks={cellBlocks[cellId] || []} 
                  onClick={() => {}} 
                  onRemoveBlock={!isComplete ? blockIndex => handleRemoveBlock(cellId, blockIndex) : undefined}
                  onDropBlock={onDropBlock && !isComplete ? value => onDropBlock(cellId, value) : undefined} 
                  expectedProduct={product} 
                  className="h-full" 
                  isLargeGrid={isLargeGrid}
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