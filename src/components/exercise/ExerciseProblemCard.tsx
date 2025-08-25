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
  onAutoComplete?: () => void;
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
  onAutoComplete,
  onShowHelp
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
          onAutoComplete={onAutoComplete}
          onShowHelp={() => onShowHelp(factor1, factor2, problem)}
          isDisabled={false} 
          className="max-w-4xl mx-auto" 
        />
      </div>

      <CardContent className="flex-1 flex flex-col pt-1 px-1 pb-0 min-h-0">
        {/* Grid Total Counter */}
        <GridTotalCounter 
          cellBlocks={cellBlocks}
          className="mx-auto flex-shrink-0 mb-1 max-w-32"
        />
        
        {/* Multiplication Grid */}
        <div className="flex-1 min-h-0 flex items-start justify-center pt-2">
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
            onShowHelp={onShowHelp}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseProblemCard;