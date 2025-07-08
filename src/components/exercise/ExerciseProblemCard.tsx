import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MultiplicationGrid from '@/components/MultiplicationGrid';
import BlockControls from '@/components/BlockControls';
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
    <Card className="overflow-hidden">
      <CardHeader className="text-center bg-muted/30 py-3">
        <CardTitle className="text-3xl font-bold text-foreground">
          {problem}
        </CardTitle>
      </CardHeader>
      
      {/* Control Panel */}
      <div className="bg-muted/20 border-b p-4">
        <BlockControls 
          onAddBlock={onAddBlock} 
          onResetCell={onResetCell} 
          onCheckGrid={onCheckGrid} 
          isDisabled={false} 
          className="max-w-2xl mx-auto" 
        />
      </div>

      <CardContent className="p-4">
        <div className="flex justify-center">
          <MultiplicationGrid 
            factor1={factor1} 
            factor2={factor2} 
            onCellClick={onCellClick} 
            onRemoveBlock={onRemoveBlock} 
            onDropBlock={onDropBlock} 
            cellBlocks={cellBlocks} 
            completedCells={completedCells} 
            activeCell={activeCell} 
            className="shadow-xl" 
            onShowHelp={onShowHelp}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseProblemCard;