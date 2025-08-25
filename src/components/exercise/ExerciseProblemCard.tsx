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
  onShowHelp: (factor1: number, factor2: number, problem: string) => void;
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
  onShowHelp
}: ExerciseProblemCardProps) => {
  return (
    <Card className="overflow-hidden h-full max-h-[calc(100vh-6rem)]">
      <CardHeader className="text-center bg-muted/30 py-1 lg:py-2 flex-shrink-0">
        <CardTitle className="text-lg lg:text-xl font-bold text-foreground">
          {problem}
        </CardTitle>
      </CardHeader>
      
      {/* Control Panel */}
      <div className="bg-muted/20 border-b p-2 lg:p-3 flex-shrink-0">
        <BlockControls 
          onAddBlock={onAddBlock} 
          onResetCell={onResetCell} 
          onCheckGrid={onCheckGrid} 
          isDisabled={false} 
          className="max-w-xl mx-auto" 
        />
      </div>

      <CardContent className="p-2 lg:p-3 space-y-2 flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* Grid Total Counter */}
        <GridTotalCounter 
          cellBlocks={cellBlocks}
          className="mx-auto max-w-md flex-shrink-0"
        />
        
        {/* Multiplication Grid */}
        <div className="flex justify-center flex-1 min-h-0 overflow-auto">
          <MultiplicationGrid 
            factor1={factor1} 
            factor2={factor2} 
            onCellClick={onCellClick} 
            onRemoveBlock={onRemoveBlock} 
            onDropBlock={onDropBlock} 
            cellBlocks={cellBlocks} 
            completedCells={completedCells} 
            activeCell={activeCell} 
            className="shadow-lg" 
            onShowHelp={onShowHelp}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseProblemCard;