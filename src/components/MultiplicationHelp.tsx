import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grid3X3, Image, Plus, ArrowRight, Calculator } from "lucide-react";

interface MultiplicationHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factor1: number;
  factor2: number;
  problem: string;
}

const MultiplicationHelp = ({ open, onOpenChange, factor1, factor2, problem }: MultiplicationHelpProps) => {
  const result = factor1 * factor2;
  
  // Generate repeated addition sequence
  const repeatedAddition = Array(factor2).fill(factor1).join(' + ');
  
  // Generate skip counting sequence
  const skipCounting = Array(factor2).fill(0).map((_, i) => factor1 * (i + 1)).join(', ');

  // Generate dots for picture model (limited for large numbers)
  const generateDots = () => {
    const maxDots = 50; // Limit for visual clarity
    const totalDots = Math.min(factor1 * factor2, maxDots);
    const showEllipsis = factor1 * factor2 > maxDots;
    
    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {Array(totalDots).fill(0).map((_, i) => (
          <div key={i} className="w-2 h-2 bg-blue-500 rounded-full" />
        ))}
        {showEllipsis && <span className="text-blue-500 font-bold">...</span>}
      </div>
    );
  };

  // Generate array visualization
  const generateArray = () => {
    const maxCells = 48; // 6x8 or similar reasonable limit
    const showPartial = factor1 * factor2 > maxCells;
    const displayRows = showPartial ? Math.min(factor1, 6) : factor1;
    const displayCols = showPartial ? Math.min(factor2, 8) : factor2;
    
    return (
      <div className="flex flex-col gap-1 items-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${displayCols}, 1fr)` }}>
          {Array(displayRows * displayCols).fill(0).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-green-500 border border-green-600" />
          ))}
        </div>
        {showPartial && (
          <div className="text-green-600 text-xs font-medium">
            {factor1} × {factor2} = {result}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4">
            How to solve {problem}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Picture Model */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Image className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-800">🖼️ Picture Model</h3>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Draw {factor1 * factor2} dots in {factor1} groups of {factor2}
            </p>
            <div className="bg-white p-3 rounded border min-h-[80px] flex items-center justify-center">
              {generateDots()}
            </div>
          </div>

          {/* Array */}
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Grid3X3 className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-green-800">📊 Array</h3>
            </div>
            <p className="text-sm text-green-700 mb-3">
              {factor1} rows × {factor2} columns
            </p>
            <div className="bg-white p-3 rounded border min-h-[80px] flex items-center justify-center">
              {generateArray()}
            </div>
          </div>

          {/* Repeated Addition */}
          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="h-5 w-5 text-orange-600" />
              <h3 className="font-bold text-orange-800">➕ Repeated Addition</h3>
            </div>
            <p className="text-sm text-orange-700 mb-3">
              Add {factor1} a total of {factor2} times
            </p>
            <div className="bg-white p-3 rounded border min-h-[80px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-mono break-all">
                  {repeatedAddition} = {result}
                </div>
              </div>
            </div>
          </div>

          {/* Skip Counting */}
          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-purple-800">🔢 Skip Counting</h3>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              Count by {factor1}s, {factor2} times
            </p>
            <div className="bg-white p-3 rounded border min-h-[80px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-mono break-all">
                  {skipCounting}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Equation */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mt-4">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <Calculator className="h-5 w-5 text-gray-600" />
            <h3 className="font-bold text-gray-800">📝 Basic Equation</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {factor1} × {factor2} = {result}
            </div>
            <p className="text-gray-600">
              {factor1} groups of {factor2} equals {result}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={() => onOpenChange(false)} className="px-8">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiplicationHelp;