import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Pause, Play } from 'lucide-react';
import MultiplicationGrid from './MultiplicationGrid';
import BlockControls from './BlockControls';
import { Block } from '@/utils/boxMethod/types';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/sounds';

interface InteractiveTutorialProps {
  onComplete: () => void;
}

const InteractiveTutorial = ({ onComplete }: InteractiveTutorialProps) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Tutorial problem: 23 × 15
  const factor1 = 23;
  const factor2 = 15;
  
  // State for the demo grid
  const [cellBlocks, setCellBlocks] = useState<Record<string, Block[]>>({});
  const [completedCells, setCompletedCells] = useState<string[]>([]);
  const [activeCell, setActiveCell] = useState<string | null>('0-0');
  const [cellValidationStatus, setCellValidationStatus] = useState<Record<string, 'correct' | 'incorrect' | null>>({});

  const tutorialSteps = [
    {
      title: "Welcome to the Interactive Tutorial!",
      description: "I'll show you how to solve 23 × 15 using our click-based system. Watch as I demonstrate each step.",
      action: null
    },
    {
      title: "Step 1: Starting with the first cell",
      description: "The highlighted cell shows 20 × 10 = 200. I need to click the blocks to make 200.",
      action: () => {
        setActiveCell('0-0');
        playSound('click');
      }
    },
    {
      title: "Adding 100 blocks",
      description: "I'll click the 100 block twice to get 200.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '0-0': [100]
        }));
        playSound('add');
      }
    },
    {
      title: "Adding the second 100 block",
      description: "One more 100 block to complete 200.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '0-0': [100, 100]
        }));
        playSound('add');
      }
    },
    {
      title: "Moving to the next cell",
      description: "Now I'll move to 20 × 5 = 100. Notice how the highlighting changes.",
      action: () => {
        setActiveCell('0-1');
        playSound('click');
      }
    },
    {
      title: "Adding 100 for the second cell",
      description: "This cell needs 100, so I'll click the 100 block once.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '0-1': [100]
        }));
        playSound('add');
      }
    },
    {
      title: "Third cell: 3 × 10 = 30",
      description: "Moving to the third cell which needs 30.",
      action: () => {
        setActiveCell('1-0');
        playSound('click');
      }
    },
    {
      title: "Adding blocks for 30",
      description: "I need 30, so I'll add three 10 blocks.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-0': [10]
        }));
        playSound('add');
      }
    },
    {
      title: "Adding more 10 blocks",
      description: "Second 10 block for a total of 20.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-0': [10, 10]
        }));
        playSound('add');
      }
    },
    {
      title: "Completing the 30",
      description: "Third 10 block to complete 30.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-0': [10, 10, 10]
        }));
        playSound('add');
      }
    },
    {
      title: "Final cell: 3 × 5 = 15",
      description: "Last cell needs 15. I'll use one 10 block and five 1 blocks.",
      action: () => {
        setActiveCell('1-1');
        playSound('click');
      }
    },
    {
      title: "Adding 10 for the final cell",
      description: "First, I'll add a 10 block.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-1': [10]
        }));
        playSound('add');
      }
    },
    {
      title: "Adding 1 blocks",
      description: "Now I need 5 more, so I'll add five 1 blocks.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-1': [10, 1]
        }));
        playSound('add');
      }
    },
    {
      title: "Adding more 1 blocks",
      description: "Adding more 1 blocks to reach 15.",
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-1': [10, 1, 1, 1, 1, 1]
        }));
        playSound('add');
      }
    },
    {
      title: "All done! Click Check to verify",
      description: "Now that all cells are filled, you would click the Check button to verify your answer. The total is 200 + 100 + 30 + 15 = 345!",
      action: () => {
        setCellValidationStatus({
          '0-0': 'correct',
          '0-1': 'correct',
          '1-0': 'correct',
          '1-1': 'correct'
        });
        setCompletedCells(['0-0', '0-1', '1-0', '1-1']);
        playSound('correct');
      }
    },
    {
      title: "Ready to try it yourself?",
      description: "That's how easy it is! You click the blocks you need, they get added to the highlighted cell, and you work through each cell until complete. Ready to practice?",
      action: null
    }
  ];

  const currentStep = tutorialSteps[step];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isPaused && step < tutorialSteps.length - 1) {
      const timer = setTimeout(() => {
        if (currentStep.action) {
          currentStep.action();
        }
        setStep(prev => prev + 1);
      }, 2500); // 2.5 seconds per step

      return () => clearTimeout(timer);
    }
  }, [step, isPlaying, isPaused, currentStep]);

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      if (currentStep.action) {
        currentStep.action();
      }
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
    setIsPaused(false);
    setCellBlocks({});
    setCompletedCells([]);
    setActiveCell('0-0');
    setCellValidationStatus({});
  };

  // Dummy handlers for the demo (no actual interaction allowed)
  const handleCellClick = () => {};
  const handleAddBlock = () => {};
  const handleResetCell = () => {};
  const handleCheckGrid = () => {};
  const handleRemoveBlock = () => {};

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto overflow-hidden">
      {/* Tutorial Header */}
      <Card className="flex-shrink-0 m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-lg">
            {currentStep.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-center text-muted-foreground mb-4">
            {currentStep.description}
          </p>
          
          {/* Tutorial Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComplete()}
              className="text-muted-foreground"
            >
              Skip Tutorial
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Reset Demo
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              className="min-w-[100px]"
            >
              {!isPlaying ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Auto Play
                </>
              ) : isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
            
            <Button
              onClick={handleNext}
              size="sm"
              className="min-w-[100px]"
            >
              {step === tutorialSteps.length - 1 ? 'Start Practice!' : 'Next Step'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-1 mt-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === step 
                    ? "bg-primary scale-125" 
                    : index < step 
                      ? "bg-secondary" 
                      : "bg-muted"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo Area */}
      <div className="flex-1 min-h-0 px-4">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0 text-center bg-muted/30 py-2">
            <CardTitle className="text-sm font-bold text-foreground">
              Tutorial: 23 × 15
            </CardTitle>
          </CardHeader>
          
          {/* Demo Control Panel */}
          <div className="bg-muted/20 border-b p-2 flex-shrink-0">
            <BlockControls 
              onAddBlock={handleAddBlock} 
              onResetCell={handleResetCell} 
              onCheckGrid={handleCheckGrid} 
              isDisabled={true} // Disabled during tutorial
              className="max-w-4xl mx-auto opacity-75" 
            />
            <p className="text-xs text-center text-muted-foreground mt-2">
              (Demo mode - buttons are disabled during tutorial)
            </p>
          </div>

          <CardContent className="flex-1 flex flex-col min-h-0">
            {/* Demo Grid */}
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6">
              <MultiplicationGrid 
                factor1={factor1} 
                factor2={factor2} 
                onCellClick={handleCellClick} 
                onRemoveBlock={handleRemoveBlock} 
                cellBlocks={cellBlocks} 
                completedCells={completedCells} 
                activeCell={activeCell} 
                className="border border-border" 
                cellValidationStatus={cellValidationStatus}
              />
              
              {/* Show current total */}
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground">Current Total:</div>
                <div className="text-lg font-bold text-primary">
                  {Object.values(cellBlocks).flat().reduce((sum, block) => sum + block, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveTutorial;