import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grid3X3, Image, Plus, ArrowRight, Calculator, Repeat, SkipForward } from "lucide-react";

interface MultiplicationHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factor1: number;
  factor2: number;
  problem: string;
}

const MultiplicationHelp = ({ open, onOpenChange, factor1, factor2, problem }: MultiplicationHelpProps) => {
  const result = factor1 * factor2;
  
  // Generate place value breakdown
  const generatePlaceValueBreakdown = () => {
    const breakdownFactor1 = (num: number) => {
      if (num < 10) return [num];
      const parts = [];
      if (num >= 100) {
        const hundreds = Math.floor(num / 100) * 100;
        parts.push(hundreds);
        num -= hundreds;
      }
      if (num >= 10) {
        const tens = Math.floor(num / 10) * 10;
        parts.push(tens);
        num -= tens;
      }
      if (num > 0) {
        parts.push(num);
      }
      return parts;
    };

    const factor1Parts = breakdownFactor1(factor1);
    const factor2Parts = breakdownFactor1(factor2);

    // Create breakdown string
    const factor1Breakdown = factor1Parts.length > 1 ? `(${factor1Parts.join(' + ')})` : factor1Parts[0].toString();
    const factor2Breakdown = factor2Parts.length > 1 ? `(${factor2Parts.join(' + ')})` : factor2Parts[0].toString();

    return {
      factor1Breakdown,
      factor2Breakdown,
      factor1Parts,
      factor2Parts
    };
  };

  // Generate repeated addition string
  const generateRepeatedAddition = () => {
    const terms = [];
    for (let i = 0; i < factor2; i++) {
      terms.push(factor1.toString());
    }
    return terms.join(' + ') + ' = ?';
  };

  // Generate skip counting sequence
  const generateSkipCounting = () => {
    const sequence = [];
    for (let i = 1; i <= factor2; i++) {
      sequence.push((factor1 * i).toString());
    }
    return sequence.join(', ');
  };

  // Generate picture model dots
  const generatePictureModel = () => {
    const groups = [];
    for (let i = 0; i < factor2; i++) {
      groups.push('●'.repeat(factor1));
    }
    return groups;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4">
            How to solve {problem}
          </DialogTitle>
        </DialogHeader>
        
        {/* Grid layout: 2x2 + 1 bottom center */}
        <div className="space-y-4">
          {/* Top row: Picture Model | Array */}
          <div className="grid grid-cols-2 gap-4">
            {/* Picture Model */}
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-3">
                <Image className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-green-700 dark:text-green-300">Picture Model</h3>
              </div>
              <div className="space-y-2">
                {generatePictureModel().map((group, index) => (
                  <div key={index} className="text-lg font-mono text-green-600 dark:text-green-400">
                    {group}
                  </div>
                ))}
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  {factor2} groups of {factor1} = {result}
                </p>
              </div>
            </div>

            {/* Array */}
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <Grid3X3 className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-blue-700 dark:text-blue-300">Array</h3>
              </div>
              <div className="space-y-2">
                <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${Math.min(factor1, 10)}, 1fr)`}}>
                  {Array.from({length: Math.min(factor1 * factor2, 100)}).map((_, index) => (
                    <div key={index} className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                  ))}
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {factor1} × {factor2} array = {result}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row: Repeated Addition | Skip Counting */}
          <div className="grid grid-cols-2 gap-4">
            {/* Repeated Addition */}
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <Plus className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-purple-700 dark:text-purple-300">Repeated Addition</h3>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-mono text-purple-600 dark:text-purple-400 break-all">
                  {generateRepeatedAddition()}
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Add {factor1} a total of {factor2} times
                </p>
              </div>
            </div>

            {/* Skip Counting */}
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-3">
                <SkipForward className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold text-orange-700 dark:text-orange-300">Skip Counting</h3>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-mono text-orange-600 dark:text-orange-400 break-all">
                  {generateSkipCounting()}
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Count by {factor1}s, {factor2} times
                </p>
              </div>
            </div>
          </div>

          {/* Bottom center: Basic Equation */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-3 justify-center">
                <Calculator className="h-5 w-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-700 dark:text-yellow-300">Basic Equation</h3>
              </div>
              <div className="text-center space-y-2">
                {(() => {
                  const breakdown = generatePlaceValueBreakdown();
                  return (
                    <>
                      <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                        {breakdown.factor1Breakdown} × {breakdown.factor2Breakdown} = {result}
                      </div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Breaking down {factor1} × {factor2} using place values
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
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