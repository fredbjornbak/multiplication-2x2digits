import { cn } from "@/lib/utils";
import { Block } from "@/utils/boxMethod/types";

interface GridTotalCounterProps {
  cellBlocks: Record<string, Block[]>;
  className?: string;
}

const GridTotalCounter = ({ cellBlocks, className }: GridTotalCounterProps) => {
  // Calculate current total from all cell blocks
  const currentTotal = Object.values(cellBlocks).reduce((total, blocks) => {
    return total + blocks.reduce((sum, block) => sum + block, 0);
  }, 0);

  return (
    <div className={cn("flex items-center justify-center p-2 rounded-lg border-2 border-blue-200 bg-blue-50", className)}>
      <div className="text-center">
        <div className="text-xs lg:text-sm text-muted-foreground mb-1">Grid Total</div>
        <div className="text-lg lg:text-xl font-bold text-blue-600">
          {currentTotal}
        </div>
      </div>
    </div>
  );
};

export default GridTotalCounter;