import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BoxMethodIntro2Props {
  onComplete: () => void;
}

const BoxMethodIntro2 = ({ onComplete }: BoxMethodIntro2Props) => {
  const [step, setStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  // Demo numbers for second tutorial - different from first
  const factor1 = 47;
  const factor2 = 38;

  // Break down factors for visual representation
  const factor1Parts = [40, 7];
  const factor2Parts = [30, 8];

  const steps = [
    'show-numbers',
    'create-grid',
    'fill-products',
    'show-addition',
    'show-result'
  ];

  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 600);
    return () => clearTimeout(timer);
  }, [step]);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const resetIntro = () => {
    setStep(0);
  };

  const currentStepName = steps[step];

  return (
    <div className="flex flex-col items-center space-y-3 p-2 lg:space-y-4 lg:p-4">
      {/* Main visual area */}
      <Card className="w-full max-w-xl lg:max-w-2xl p-3 lg:p-6">
        <div className="flex flex-col items-center space-y-3 lg:space-y-6">
          
          {/* Step 1: Show numbers */}
          {currentStepName === 'show-numbers' && (
            <div className={cn(
              "flex items-center space-x-4 transition-all duration-500",
              showAnimation && "animate-scale-in"
            )}>
              <div className="text-3xl lg:text-5xl font-bold text-primary bg-primary/10 rounded-full w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center">
                {factor1}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-muted-foreground">×</div>
              <div className="text-3xl lg:text-5xl font-bold text-accent bg-accent/10 rounded-full w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center">
                {factor2}
              </div>
            </div>
          )}

          {/* Step 2: Create grid */}
          {currentStepName === 'create-grid' && (
            <div className={cn(
              "flex flex-col items-center space-y-6",
              showAnimation && "animate-scale-in"
            )}>
              {/* Headers */}
              <div className="flex space-x-2 lg:space-x-3">
                <div className="w-12 lg:w-16"></div>
                <div className="text-lg lg:text-2xl font-bold text-accent bg-accent/10 rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center">
                  {factor2Parts[0]}
                </div>
                <div className="text-lg lg:text-2xl font-bold text-accent bg-accent/10 rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center">
                  {factor2Parts[1]}
                </div>
              </div>
              
              {/* Grid */}
              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                <div className="text-lg lg:text-2xl font-bold text-primary bg-primary/10 rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center">
                  {factor1Parts[0]}
                </div>
                <div className="border-2 lg:border-4 border-dashed border-muted-foreground rounded-lg w-12 h-10 lg:w-16 lg:h-12"></div>
                <div className="border-2 lg:border-4 border-dashed border-muted-foreground rounded-lg w-12 h-10 lg:w-16 lg:h-12"></div>
                
                <div className="text-lg lg:text-2xl font-bold text-primary bg-primary/10 rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center">
                  {factor1Parts[1]}
                </div>
                <div className="border-2 lg:border-4 border-dashed border-muted-foreground rounded-lg w-12 h-10 lg:w-16 lg:h-12"></div>
                <div className="border-2 lg:border-4 border-dashed border-muted-foreground rounded-lg w-12 h-10 lg:w-16 lg:h-12"></div>
              </div>
            </div>
          )}

          {/* Step 3: Fill products */}
          {currentStepName === 'fill-products' && (
            <div className={cn(
              "flex flex-col items-center space-y-3 lg:space-y-4",
              showAnimation && "animate-fade-in"
            )}>
              {/* Headers */}
              <div className="flex space-x-2 lg:space-x-3">
                <div className="w-12 lg:w-16"></div>
                <div className="text-lg lg:text-2xl font-bold text-accent bg-accent/10 rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center">
                  {factor2Parts[0]}
                </div>
                <div className="text-lg lg:text-2xl font-bold text-accent bg-accent/10 rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center">
                  {factor2Parts[1]}
                </div>
              </div>
              
              {/* Grid with products */}
              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                <div className="text-lg lg:text-2xl font-bold text-primary bg-primary/10 rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center">
                  {factor1Parts[0]}
                </div>
                <div className="text-sm lg:text-lg font-bold bg-card border-2 lg:border-4 border-foreground rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center animate-scale-in">
                  {factor1Parts[0] * factor2Parts[0]}
                </div>
                <div className="text-sm lg:text-lg font-bold bg-card border-2 lg:border-4 border-foreground rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center animate-scale-in">
                  {factor1Parts[0] * factor2Parts[1]}
                </div>
                
                <div className="text-lg lg:text-2xl font-bold text-primary bg-primary/10 rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center">
                  {factor1Parts[1]}
                </div>
                <div className="text-sm lg:text-lg font-bold bg-card border-2 lg:border-4 border-foreground rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center animate-scale-in">
                  {factor1Parts[1] * factor2Parts[0]}
                </div>
                <div className="text-sm lg:text-lg font-bold bg-card border-2 lg:border-4 border-foreground rounded-lg w-12 h-10 lg:w-16 lg:h-12 flex items-center justify-center animate-scale-in">
                  {factor1Parts[1] * factor2Parts[1]}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Show addition */}
          {currentStepName === 'show-addition' && (
            <div className={cn(
              "flex flex-col items-center space-y-4 lg:space-y-6",
              showAnimation && "animate-fade-in"
            )}>
              {/* Products in a row */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="text-lg lg:text-xl font-bold bg-card border-2 lg:border-4 border-foreground rounded-lg w-12 h-8 lg:w-14 lg:h-10 flex items-center justify-center">
                  {factor1Parts[0] * factor2Parts[0]}
                </div>
                <div className="text-lg lg:text-xl font-bold text-muted-foreground">+</div>
                <div className="text-lg lg:text-xl font-bold bg-card border-2 lg:border-4 border-foreground rounded-lg w-12 h-8 lg:w-14 lg:h-10 flex items-center justify-center">
                  {factor1Parts[0] * factor2Parts[1]}
                </div>
                <div className="text-lg lg:text-xl font-bold text-muted-foreground">+</div>
                <div className="text-lg lg:text-xl font-bold bg-card border-2 lg:border-4 border-foreground rounded-lg w-12 h-8 lg:w-14 lg:h-10 flex items-center justify-center">
                  {factor1Parts[1] * factor2Parts[0]}
                </div>
                <div className="text-lg lg:text-xl font-bold text-muted-foreground">+</div>
                <div className="text-lg lg:text-xl font-bold bg-card border-2 lg:border-4 border-foreground rounded-lg w-12 h-8 lg:w-14 lg:h-10 flex items-center justify-center">
                  {factor1Parts[1] * factor2Parts[1]}
                </div>
              </div>
              
              {/* Equals */}
              <div className="text-2xl lg:text-3xl font-bold text-muted-foreground">=</div>
              
              {/* Calculation */}
              <div className="text-lg lg:text-xl font-medium text-muted-foreground text-center">
                {factor1Parts[0] * factor2Parts[0]} + {factor1Parts[0] * factor2Parts[1]} + {factor1Parts[1] * factor2Parts[0]} + {factor1Parts[1] * factor2Parts[1]}
              </div>
            </div>
          )}

          {/* Step 5: Show result */}
          {currentStepName === 'show-result' && (
            <div className={cn(
              "flex flex-col items-center space-y-4 lg:space-y-6",
              showAnimation && "animate-scale-in"
            )}>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="text-2xl lg:text-3xl font-bold text-primary bg-primary/10 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center">
                  {factor1}
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-muted-foreground">×</div>
                <div className="text-2xl lg:text-3xl font-bold text-accent bg-accent/10 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center">
                  {factor2}
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-muted-foreground">=</div>
                <div className="text-3xl lg:text-4xl font-bold text-secondary bg-secondary/10 rounded-full w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center animate-pulse">
                  {factor1 * factor2}
                </div>
              </div>
              
              {/* Celebration particles */}
              <div className="text-4xl lg:text-5xl animate-bounce">🎉</div>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation controls */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={resetIntro}
          className="rounded-full"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === step 
                  ? "bg-primary scale-125" 
                  : index < step 
                    ? "bg-secondary" 
                    : "bg-muted"
              )}
            />
          ))}
        </div>
        
        <Button
          onClick={nextStep}
          size="icon"
          className="rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BoxMethodIntro2;