import { cn } from "@/lib/utils";
import { Block } from "@/utils/boxMethod/types";

interface GridTotalCounterProps {
  cellBlocks: Record<string, Block[]>;
  expectedTotal: number;
  className?: string;
}

const GridTotalCounter = ({ cellBlocks, expectedTotal, className }: GridTotalCounterProps) => {
  // Calculate current total from all cell blocks
  const currentTotal = Object.values(cellBlocks).reduce((total, blocks) => {
    return total + blocks.reduce((sum, block) => sum + block, 0);
  }, 0);

  const isCorrect = currentTotal === expectedTotal;
  const isOverTarget = currentTotal > expectedTotal;

  return (
    <div className={cn("flex items-center justify-center gap-4 p-4 rounded-lg border-2", className, {
      "border-green-200 bg-green-50": isCorrect,
      "border-red-200 bg-red-50": isOverTarget && !isCorrect,
      "border-blue-200 bg-blue-50": !isOverTarget && !isCorrect
    })}>
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Grid Total</div>
        <div className={cn("text-2xl font-bold", {
          "text-green-600": isCorrect,
          "text-red-600": isOverTarget && !isCorrect,
          "text-blue-600": !isOverTarget && !isCorrect
        })}>
          {currentTotal}
        </div>
      </div>
      
      <div className="text-xl text-muted-foreground">/</div>
      
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Target</div>
        <div className="text-2xl font-bold text-muted-foreground">
          {expectedTotal}
        </div>
      </div>
    </div>
  );
};

export default GridTotalCounter;