import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grid3X3, Image, Plus, ArrowRight, Calculator, Repeat, SkipForward } from "lucide-react";
import ArrayVisual from "./ArrayVisual";

interface MultiplicationHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factor1: number;
  factor2: number;
  problem: string;
}

const MultiplicationHelp = ({ open, onOpenChange, factor1, factor2, problem }: MultiplicationHelpProps) => {
  const result = factor1 * factor2;
  
  // Helper functions for zero-based problems
  const hasTrailingZeros = (num: number) => num % 10 === 0 && num > 0;
  const removeTrailingZeros = (num: number) => {
    while (num % 10 === 0 && num > 0) {
      num = num / 10;
    }
    return num;
  };
  const countTrailingZeros = (num: number) => {
    let count = 0;
    while (num % 10 === 0 && num > 0) {
      num = num / 10;
      count++;
    }
    return count;
  };
  
  // Check if this is a zero-based problem
  const isZeroBased = hasTrailingZeros(factor1) || hasTrailingZeros(factor2);
  
  // Generate simplified zero-based calculation
  const generateZeroBasedHelp = () => {
    const simplifiedFactor1 = removeTrailingZeros(factor1);
    const simplifiedFactor2 = removeTrailingZeros(factor2);
    const simplifiedResult = simplifiedFactor1 * simplifiedFactor2;
    const totalZeros = countTrailingZeros(factor1) + countTrailingZeros(factor2);
    
    return {
      simplifiedFactor1,
      simplifiedFactor2,
      simplifiedResult,
      totalZeros,
      finalResult: simplifiedResult * Math.pow(10, totalZeros)
    };
  };
  
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
        
        {isZeroBased ? (
          /* Zero-based problems: Show simplified equation with zero reminder */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Calculator className="h-6 w-6 text-yellow-600" />
                <h3 className="font-bold text-xl text-yellow-700 dark:text-yellow-300">Basic Equation</h3>
              </div>
              <div className="text-center space-y-4">
                {(() => {
                  const zeroHelp = generateZeroBasedHelp();
                  return (
                    <>
                      <div className="space-y-3">
                        <div className="text-lg text-yellow-700 dark:text-yellow-300">
                          First, solve the simpler problem:
                        </div>
                        <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-lg">
                          {zeroHelp.simplifiedFactor1} × {zeroHelp.simplifiedFactor2} = ?
                        </div>
                        <div className="flex items-center justify-center gap-2 text-lg text-yellow-700 dark:text-yellow-300">
                          <ArrowRight className="h-5 w-5" />
                          <span className="font-bold">Then add {zeroHelp.totalZeros} zero{zeroHelp.totalZeros !== 1 ? 's' : ''}</span>
                          <ArrowRight className="h-5 w-5" />
                        </div>
                        <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 bg-yellow-200 dark:bg-yellow-800/50 p-4 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
                          {factor1} × {factor2} = ?
                        </div>
                      </div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-4">
                        When multiplying with zeros, solve without the zeros first, then add them back!
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Array Model */}
            <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Grid3X3 className="h-6 w-6 text-blue-600" />
                <h3 className="font-bold text-xl text-blue-700 dark:text-blue-300">Array Model</h3>
              </div>
              <div className="text-center space-y-4">
                {(() => {
                  const zeroHelp = generateZeroBasedHelp();
                  return (
                    <>
                      <div className="text-lg text-blue-700 dark:text-blue-300">
                        {zeroHelp.simplifiedFactor1} × {zeroHelp.simplifiedFactor2} array:
                      </div>
                      <ArrayVisual 
                        rows={zeroHelp.simplifiedFactor1} 
                        columns={zeroHelp.simplifiedFactor2}
                        className="my-4"
                      />
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        {zeroHelp.simplifiedFactor1} rows × {zeroHelp.simplifiedFactor2} columns = ? squares
                      </div>
                      <div className="text-lg text-blue-700 dark:text-blue-300 font-bold">
                        Don't forget to add {zeroHelp.totalZeros} zero{zeroHelp.totalZeros !== 1 ? 's' : ''}!
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : (
          /* Regular problems: Show only Basic Equation */
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Calculator className="h-6 w-6 text-yellow-600" />
                <h3 className="font-bold text-xl text-yellow-700 dark:text-yellow-300">Basic Equation</h3>
              </div>
              <div className="text-center space-y-4">
                {(() => {
                  const breakdown = generatePlaceValueBreakdown();
                  return (
                    <>
                      <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-lg">
                        {breakdown.factor1Breakdown} × {breakdown.factor2Breakdown} = ?
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
        )}

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