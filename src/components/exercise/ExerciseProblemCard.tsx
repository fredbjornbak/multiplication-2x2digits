import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MultiplicationGrid from '@/components/MultiplicationGrid';
import BlockControls from '@/components/BlockControls';
import GridTotalCounter from './GridTotalCounter';
import { Block } from '@/utils/boxMethod/types';

interface ExerciseProblemCardProps {
  problem: string;
  factor1: number;
  factor2: number;
  onCellClick: (row: number, col: number) => void;
  onRemoveBlock: (cellId: string, blockIndex: number) => void;
  onDropBlock: (cellId: string, value: Block) => void;
  cellBlocks: Record<string, Block[]>;
  completedCells: string[];
  activeCell: string | null;
  onAddBlock: (value: Block) => void;
  onResetCell: () => void;
  onCheckGrid: () => void;
  cellValidationStatus: Record<string, 'correct' | 'incorrect' | null>;
}

const ExerciseProblemCard = ({
  problem,
  factor1,
  factor2,
  onCellClick,
  onRemoveBlock,
  onDropBlock,
  cellBlocks,
  completedCells,
  activeCell,
  onAddBlock,
  onResetCell,
  onCheckGrid,
  cellValidationStatus
}: ExerciseProblemCardProps) => {
  return (
    <Card className="h-full flex flex-col w-full max-w-5xl mx-auto border border-border">
      <CardHeader className="flex-shrink-0 text-center bg-muted/30 py-1">
        <CardTitle className="text-sm font-bold text-foreground">
          {problem}
        </CardTitle>
      </CardHeader>
      
      {/* Control Panel */}
      <div className="bg-muted/20 border-b p-1 flex-shrink-0">
        <BlockControls 
          onAddBlock={onAddBlock} 
          onResetCell={onResetCell} 
          onCheckGrid={onCheckGrid} 
          isDisabled={false} 
          className="max-w-4xl mx-auto" 
        />
      </div>

      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Multiplication Grid */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6">
          <MultiplicationGrid 
            factor1={factor1} 
            factor2={factor2} 
            onCellClick={onCellClick} 
            onRemoveBlock={onRemoveBlock} 
            onDropBlock={onDropBlock} 
            cellBlocks={cellBlocks} 
            completedCells={completedCells} 
            activeCell={activeCell} 
            className="border border-border" 
            cellValidationStatus={cellValidationStatus}
          />
          
          {/* Grid Total Counter - positioned directly under the grid */}
          <GridTotalCounter 
            cellBlocks={cellBlocks}
            className="mt-2 max-w-32"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseProblemCard;