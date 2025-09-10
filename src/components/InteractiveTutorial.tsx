import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, MousePointer2 } from 'lucide-react';
import MultiplicationGrid from './MultiplicationGrid';
import BlockControls from './BlockControls';
import { Block } from '@/utils/boxMethod/types';
import { playSound } from '@/lib/sounds';

interface InteractiveTutorialProps {
  onComplete: () => void;
}

const InteractiveTutorial = ({ onComplete }: InteractiveTutorialProps) => {
  const [step, setStep] = useState(0);
  const [cursorPosition, setCursorPosition] = useState<{ x: number, y: number } | null>(null);
  const [showCursor, setShowCursor] = useState(false);
  
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
      action: null,
      cursor: null
    },
    {
      action: () => {
        setActiveCell('0-0');
        playSound('click');
      },
      cursor: 'grid-cell'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '0-0': [100]
        }));
        playSound('add');
      },
      cursor: 'block-100'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '0-0': [100, 100]
        }));
        playSound('add');
      },
      cursor: 'block-100'
    },
    {
      action: () => {
        setActiveCell('0-1');
        playSound('click');
      },
      cursor: 'grid-cell'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '0-1': [100]
        }));
        playSound('add');
      },
      cursor: 'block-100'
    },
    {
      action: () => {
        setActiveCell('1-0');
        playSound('click');
      },
      cursor: 'grid-cell'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-0': [10]
        }));
        playSound('add');
      },
      cursor: 'block-10'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-0': [10, 10]
        }));
        playSound('add');
      },
      cursor: 'block-10'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-0': [10, 10, 10]
        }));
        playSound('add');
      },
      cursor: 'block-10'
    },
    {
      action: () => {
        setActiveCell('1-1');
        playSound('click');
      },
      cursor: 'grid-cell'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-1': [10]
        }));
        playSound('add');
      },
      cursor: 'block-10'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-1': [10, 1]
        }));
        playSound('add');
      },
      cursor: 'block-1'
    },
    {
      action: () => {
        setCellBlocks(prev => ({
          ...prev,
          '1-1': [10, 1, 1, 1, 1, 1]
        }));
        playSound('add');
      },
      cursor: 'block-1'
    },
    {
      action: () => {
        setCellValidationStatus({
          '0-0': 'correct',
          '0-1': 'correct',
          '1-0': 'correct',
          '1-1': 'correct'
        });
        setCompletedCells(['0-0', '0-1', '1-0', '1-1']);
        playSound('correct');
      },
      cursor: 'check-button'
    },
    {
      action: null,
      cursor: null
    }
  ];

  const currentStep = tutorialSteps[step];

  // Show cursor indicator for current step
  useEffect(() => {
    const updateCursor = async () => {
      if (currentStep?.cursor) {
        setShowCursor(false);
        // Small delay to allow elements to render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let targetElement: HTMLElement | null = null;
        
        if (currentStep.cursor === 'block-100') {
          targetElement = document.querySelector('[data-testid="math-block-100"]');
        } else if (currentStep.cursor === 'block-10') {
          targetElement = document.querySelector('[data-testid="math-block-10"]');
        } else if (currentStep.cursor === 'block-1') {
          targetElement = document.querySelector('[data-testid="math-block-1"]');
        } else if (currentStep.cursor === 'check-button') {
          targetElement = document.querySelector('[data-testid="check-btn"]');
        } else if (currentStep.cursor === 'grid-cell') {
          if (activeCell) {
            const [row, col] = activeCell.split('-');
            targetElement = document.querySelector(`[data-testid="grid-cell-${row}-${col}"]`);
          }
        }
        
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          setCursorPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          });
          setShowCursor(true);
        }
      } else {
        setShowCursor(false);
      }
    };
    
    updateCursor();
  }, [step, activeCell, currentStep?.cursor]);

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

  // Dummy handlers for the demo (no actual interaction allowed)
  const handleCellClick = () => {};
  const handleAddBlock = () => {};
  const handleResetCell = () => {};
  const handleCheckGrid = () => {};
  const handleRemoveBlock = () => {};

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto overflow-hidden relative">
      {/* Cursor Indicator */}
      {showCursor && cursorPosition && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: cursorPosition.x - 16,
            top: cursorPosition.y - 16,
          }}
        >
          <div className="relative animate-pulse">
            <MousePointer2 className="w-8 h-8 text-black drop-shadow-2xl" fill="white" strokeWidth={2} />
            {/* Outer glow for better visibility */}
            <div className="absolute inset-0 w-8 h-8 bg-white rounded-full opacity-50 blur-sm -z-10"></div>
            {/* Click indicator */}
            <div className="absolute top-0 left-0 w-8 h-8 border-2 border-black rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      )}

      {/* Simple Next Button */}
      <div className="flex-shrink-0 m-4 mb-2 flex justify-center">
        <Button
          onClick={handleNext}
          size="lg"
          className="text-lg px-8"
        >
          {step === tutorialSteps.length - 1 ? 'Start Practice!' : 'Next Step'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

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