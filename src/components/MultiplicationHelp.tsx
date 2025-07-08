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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4">
            How to solve {problem}
          </DialogTitle>
        </DialogHeader>
        
        {/* Basic Equation with Place Value Breakdown */}
        <div className="bg-muted/30 p-6 rounded-lg border-2 border-border max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground text-xl">Place Value Breakdown</h3>
          </div>
          <div className="text-center space-y-4">
            {(() => {
              const breakdown = generatePlaceValueBreakdown();
              return (
                <>
                  <div className="text-2xl font-bold text-foreground">
                    {breakdown.factor1Breakdown} × {breakdown.factor2Breakdown} = {result}
                  </div>
                  <p className="text-muted-foreground">
                    Breaking down {factor1} × {factor2} using place values
                  </p>
                </>
              );
            })()}
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