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
  return <div className={cn("relative bg-background rounded-2xl overflow-hidden w-fit mx-auto border-4 border-border", className)}>
      {/* Top row with factor2 digits */}
      <div className="flex">
        <div className="w-20 h-16 flex items-center justify-center bg-muted border-b-2 border-r-2 border-border">
        </div>
        {factor2Digits.map((digit, index) => (
          <div key={`top-${index}`} className="flex-1 min-w-36 flex items-center justify-center h-16 font-bold text-lg text-foreground bg-muted border-b-2 border-r-2 border-border">
            {digit}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {factor1Digits.map((digit1, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {/* Left column with factor1 digits */}
          <div className="w-20 min-h-60 flex items-center justify-center font-bold text-lg text-foreground bg-muted border-b-2 border-r-2 border-border">
            {digit1}
          </div>
          
          {/* Grid cells */}
          {factor2Digits.map((digit2, colIndex) => {
            const cellId = `${rowIndex}-${colIndex}`;
            const isActive = activeCell === cellId;
            const isComplete = completedCells.includes(cellId);
            const product = digit1 * digit2;
            return (
              <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 min-w-36 min-h-60 border-b-2 border-r-2 border-border relative">
                {/* Help button for this specific cell */}
                {onShowHelp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShowHelp(digit1, digit2, `${digit1} × ${digit2}`)}
                    className="absolute top-3 right-3 z-20 rounded-full w-7 h-7 p-0 bg-background/90 hover:bg-background border-border shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
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
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>;
};
export default MultiplicationGrid;