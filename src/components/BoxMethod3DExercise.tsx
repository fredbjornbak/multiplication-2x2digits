import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, HelpCircle, ChevronRight, ChevronLeft, InfoIcon } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { BoxMethodProblem3D, getBoxMethod3DProblems } from '@/utils/boxMethod3DExercises';
import confetti from 'canvas-confetti';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Canvas } from '@react-three/fiber';
import { SolarPanelReward, TreePlantingReward, HouseholdReward } from './RewardVisuals';
import MultiplicationGrid from './MultiplicationGrid';
import BlockControls from './BlockControls';
import AudioToggle from './AudioToggle';
import { playSound } from '@/lib/sounds';
import { useTts } from '@/contexts/TtsContext';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BoxMethod3DExerciseProps {
  onComplete: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type Block = 1 | 10 | 100;

type TutorialStep = {
  message: string;
  action?: () => void;
  delay?: number;
};

const BoxMethod3DExercise = ({ onComplete }: BoxMethod3DExerciseProps) => {
  const { userModel, addExercise } = useUserStore();
  const { speak, stopSpeaking } = useTts();
  const { t } = useTranslation();
  const [problems, setProblems] = useState<BoxMethodProblem3D[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  // Tutorial state
  const [isTutorialMode, setIsTutorialMode] = useState(true);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const tutorialTimeoutRef = useRef<NodeJS.Timeout>();
  const [isTutorialActionInProgress, setIsTutorialActionInProgress] = useState(false);
  const hasStartedTutorial = useRef(false);
  const speechTimeoutRef = useRef<NodeJS.Timeout>();
  const isSpeakingRef = useRef(false);
  const hasSpokenWelcome = useRef(false);
  
  // Box Method Math Blocks state
  const [factor1, setFactor1] = useState(0);
  const [factor2, setFactor2] = useState(0);
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [cellBlocks, setCellBlocks] = useState<Record<string, Block[]>>({});
  const [completedCells, setCompletedCells] = useState<string[]>([]);
  
  // Sound effects state
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  // Theme-specific state
  const [progressAmount, setProgressAmount] = useState(0);
  
  // Difficulty selection
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

  // Handle audio toggle
  const handleAudioToggle = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  // Initialize with first problem (6 × 24)
  useEffect(() => {
    const firstProblem = getBoxMethod3DProblems().find(p => p.problem === "6 × 24");
    if (firstProblem) {
      setProblems([firstProblem]);
      const factors = firstProblem.problem.split('×').map(n => parseInt(n.trim()));
      setFactor1(factors[0]);
      setFactor2(factors[1]);
    }
  }, []);

  // Tutorial steps with sequential actions
  const tutorialSteps: TutorialStep[] = [
    {
      message: t('boxMethod3D.tutorial.welcome'),
      delay: 2000
    },
    {
      message: t('boxMethod3D.tutorial.selectCell'),
      action: async () => {
        setIsTutorialActionInProgress(true);
        handleCellClick(0, 0);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTutorialActionInProgress(false);
      },
      delay: 2000
    },
    {
      message: t('boxMethod3D.tutorial.addHundredBlock'),
      action: async () => {
        setIsTutorialActionInProgress(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        handleAddBlock(100);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTutorialActionInProgress(false);
      },
      delay: 2000
    },
    {
      message: t('boxMethod3D.tutorial.addTenBlocks'),
      action: async () => {
        setIsTutorialActionInProgress(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        handleAddBlock(10);
        await new Promise(resolve => setTimeout(resolve, 800));
        handleAddBlock(10);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTutorialActionInProgress(false);
      },
      delay: 2000
    },
    {
      message: t('boxMethod3D.tutorial.checkFirstCell'),
      action: async () => {
        setIsTutorialActionInProgress(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        handleCheckCell();
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTutorialActionInProgress(false);
      },
      delay: 2000
    },
    {
      message: t('boxMethod3D.tutorial.selectSecondCell'),
      action: async () => {
        setIsTutorialActionInProgress(true);
        handleCellClick(0, 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTutorialActionInProgress(false);
      },
      delay: 2000
    },
    {
      message: t('boxMethod3D.tutorial.addSecondCellBlocks'),
      action: async () => {
        setIsTutorialActionInProgress(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        handleAddBlock(10);
        await new Promise(resolve => setTimeout(resolve, 800));
        handleAddBlock(10);
        await new Promise(resolve => setTimeout(resolve, 800));
        handleAddBlock(1);
        await new Promise(resolve => setTimeout(resolve, 800));
        handleAddBlock(1);
        await new Promise(resolve => setTimeout(resolve, 800));
        handleAddBlock(1);
        await new Promise(resolve => setTimeout(resolve, 800));
        handleAddBlock(1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTutorialActionInProgress(false);
      },
      delay: 2000
    },
    {
      message: t('boxMethod3D.tutorial.checkSecondCell'),
      action: async () => {
        setIsTutorialActionInProgress(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        handleCheckCell();
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTutorialActionInProgress(false);
      },
      delay: 2000
    },
    {
      message: t('boxMethod3D.tutorial.explainSum'),
      delay: 3000
    },
    {
      message: t('boxMethod3D.tutorial.complete'),
      action: async () => {
        setIsTutorialActionInProgress(true);
        // Set the first problem to 2 × 10 before the final message
        const firstProblem = getBoxMethod3DProblems().find(p => p.problem === "2 × 10");
        if (firstProblem) {
          setProblems([firstProblem]);
          const factors = firstProblem.problem.split('×').map(n => parseInt(n.trim()));
          setFactor1(factors[0]);
          setFactor2(factors[1]);
        }
        resetProblem();
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsTutorialMode(false);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTutorialActionInProgress(false);
      },
      delay: 2000
    }
  ];

  const startTutorial = async () => {
    if (currentTutorialStep < tutorialSteps.length) {
      const step = tutorialSteps[currentTutorialStep];
      
      // Clear any existing timeouts
      if (tutorialTimeoutRef.current) {
        clearTimeout(tutorialTimeoutRef.current);
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }

      // Stop any existing speech
      stopSpeaking();

      // Calculate speech duration (approximately 0.4 seconds per word for Danish)
      const speechDuration = step.message.split(' ').length * 0.4 * 1000;
      
      // Speak the message
      isSpeakingRef.current = true;
      speak(step.message);
      
      // Wait for speech to complete with a longer buffer
      await new Promise<void>((resolve) => {
        speechTimeoutRef.current = setTimeout(() => {
          isSpeakingRef.current = false;
          resolve();
        }, speechDuration + 1000); // Add 1 second buffer for Danish
      });
      
      // Add a pause after speech
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Execute the action if present
      if (step.action) {
        await step.action();
      }

      // Add a pause after action
      await new Promise(resolve => setTimeout(resolve, 500));

      // Move to next step
      setCurrentTutorialStep(prev => prev + 1);
    }
  };

  // Start tutorial only once when component mounts
  useEffect(() => {
    if (isTutorialMode && !hasStartedTutorial.current) {
      hasStartedTutorial.current = true;
      // Reset all state before starting tutorial
      setCurrentTutorialStep(0);
      setIsTutorialActionInProgress(false);
      setActiveCell(null);
      setCellBlocks({});
      setCompletedCells([]);
      // Stop any existing speech
      stopSpeaking();
      // Add a small delay before starting tutorial
      setTimeout(() => {
        startTutorial();
      }, 500);
    }
    return () => {
      if (tutorialTimeoutRef.current) {
        clearTimeout(tutorialTimeoutRef.current);
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      stopSpeaking();
    };
  }, []);

  // Handle tutorial step progression
  useEffect(() => {
    if (isTutorialMode && hasStartedTutorial.current && !isTutorialActionInProgress && !isSpeakingRef.current) {
      startTutorial();
    }
  }, [currentTutorialStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tutorialTimeoutRef.current) {
        clearTimeout(tutorialTimeoutRef.current);
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      stopSpeaking();
    };
  }, []);

  // Disable user interactions during tutorial
  const handleUserInteraction = (e: React.MouseEvent) => {
    if (isTutorialMode && !isTutorialActionInProgress) {
      e.preventDefault();
      toast.info(t('boxMethod3D.followTutorial'));
    }
  };

  useEffect(() => {
    if (problems.length > 0 && currentProblemIndex < problems.length) {
      const problem = problems[currentProblemIndex];
      
      // Extract factors from the problem
      const factors = problem.problem.split('×').map(n => parseInt(n.trim()));
      setFactor1(factors[0]);
      setFactor2(factors[1]);
    }
  }, [problems, currentProblemIndex]);
  
  const resetProblem = () => {
    setFeedback('');
    setAttempts(0);
    setStartTime(Date.now());
    setIsCorrect(null);
    setShowHint(false);
    
    // Reset Box Method Math Blocks state
    setActiveCell(null);
    setCellBlocks({});
    setCompletedCells([]);
    setProgressAmount(0);
  };
  
  const getCurrentProblem = () => {
    return problems[currentProblemIndex] || null;
  };
  
  // Handle difficulty selection
  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentProblemIndex(0);
    resetProblem();
  };
  
  // Get the theme of the current problem
  const getCurrentTheme = () => {
    const currentProblem = getCurrentProblem();
    if (!currentProblem) return 'Solar';
    
    const context = currentProblem.context.toLowerCase();
    if (context.includes('tree') || context.includes('forest')) return 'Tree';
    if (context.includes('house') || context.includes('home') || context.includes('household')) return 'Household';
    return 'Solar'; // Default
  };
  
  // Get theme-specific progress label
  const getProgressLabel = () => {
    const theme = getCurrentTheme();
    switch (theme) {
      case 'Tree': return t('boxMethod3D.progressLabel.tree');
      case 'Household': return t('boxMethod3D.progressLabel.household');
      default: return t('boxMethod3D.progressLabel.solar');
    }
  };
  
  // Get theme-specific goal label
  const getGoalLabel = () => {
    const theme = getCurrentTheme();
    switch (theme) {
      case 'Tree': return t('boxMethod3D.goalLabel.tree');
      case 'Household': return t('boxMethod3D.goalLabel.household');
      default: return t('boxMethod3D.goalLabel.solar');
    }
  };
  
  // Get theme-specific completion message
  const getCompletionMessage = () => {
    const theme = getCurrentTheme();
    switch (theme) {
      case 'Tree': return t('boxMethod3D.completion.tree');
      case 'Household': return t('boxMethod3D.completion.household');
      default: return t('boxMethod3D.completion.solar');
    }
  };
  
  // Get theme-specific details message
  const getDetailsMessage = () => {
    const theme = getCurrentTheme();
    switch (theme) {
      case 'Tree': return t('boxMethod3D.details.tree');
      case 'Household': return t('boxMethod3D.details.household');
      default: return t('boxMethod3D.details.solar');
    }
  };
  
  // Calculate the total number of cells in the grid
  const getTotalCells = () => {
    // Split numbers into digits
    const getDigits = (num: number) => {
      if (num < 10) return [num];
      return [Math.floor(num / 10) * 10, num % 10].filter(d => d > 0);
    };
    
    const factor1Digits = getDigits(factor1);
    const factor2Digits = getDigits(factor2);
    
    return factor1Digits.length * factor2Digits.length;
  };
  
  // Get active cell product
  const getActiveCellProduct = () => {
    if (!activeCell) return 0;
    
    const [row, col] = activeCell.split('-').map(Number);
    
    const currentProblem = getCurrentProblem();
    if (!currentProblem) return 0;
    
    // Get the boxGrid product directly
    const cellIndex = row * (currentProblem.placeValueDecomposition.secondNumber.length) + col;
    return currentProblem.boxGrid[cellIndex]?.product || 0;
  };
  
  // Calculate the current sum of all completed cells
  const getCurrentTotal = () => {
    if (!getCurrentProblem()) return 0;
    
    return completedCells.reduce((sum, cellId) => {
      const [row, col] = cellId.split('-').map(Number);
      const cellIndex = row * (getCurrentProblem()?.placeValueDecomposition.secondNumber.length || 0) + col;
      const cellProduct = getCurrentProblem()?.boxGrid[cellIndex]?.product || 0;
      return sum + cellProduct;
    }, 0);
  };
  
  // Handle checking cell values
  const handleCheckCell = () => {
    if (!activeCell) return;
    
    // Get total value of blocks in active cell
    const blocksSum = (cellBlocks[activeCell] || []).reduce((sum, block) => sum + block, 0);
    const expectedProduct = getActiveCellProduct();
    
    const isAnswerCorrect = blocksSum === expectedProduct;
    
    if (isAnswerCorrect) {
      if (isAudioEnabled) playSound('correct');
      
      setFeedback(t('boxMethod3D.correct'));
      setIsCorrect(true);
      
      // Add cell to completed cells
      setCompletedCells(prev => [...prev, activeCell]);
      
      // Clear active cell
      setActiveCell(null);
      
      // Update progress for visual feedback
      const totalCells = getTotalCells();
      const completedCount = completedCells.length + 1;
      const newProgress = (completedCount / totalCells) * 100;
      setProgressAmount(newProgress);
      
      // Check if all cells are completed
      if (completedCells.length + 1 === getTotalCells()) {
        const finalAnswer = getCurrentTotal() + expectedProduct;
        const correctAnswer = getCurrentProblem()?.sumStep.total || 0;
        
        // Handle problem completion
        handleProblemComplete(finalAnswer === correctAnswer);
      }
    } else {
      if (isAudioEnabled) playSound('error');
      
      setFeedback(t('boxMethod3D.incorrect'));
      setIsCorrect(false);
      setAttempts(prev => prev + 1);
      
      // Show hint after multiple failed attempts
      if (attempts > 1 && !showHint) {
        setShowHint(true);
      }
    }
    
    // Clear feedback after a delay
    setTimeout(() => {
      setFeedback('');
      setIsCorrect(null);
    }, 2000);
  };
  
  // Handle cell clicks
  const handleCellClick = (row: number, col: number) => {
    const cellId = `${row}-${col}`;
    
    // If cell is already completed, don't allow further interaction
    if (completedCells.includes(cellId)) {
      if (isAudioEnabled) playSound('error');
      toast.error(t('boxMethod3D.cellCompleted'));
      return;
    }
    
    if (isAudioEnabled) playSound('click');
    setActiveCell(cellId);
    
    // Initialize cell blocks if not already present
    if (!cellBlocks[cellId]) {
      setCellBlocks(prev => ({ ...prev, [cellId]: [] }));
    }
  };
  
  // Handle adding blocks to the active cell
  const handleAddBlock = (value: Block) => {
    if (!activeCell) return;
    
    if (isAudioEnabled) playSound('add');
    
    setCellBlocks(prev => ({
      ...prev,
      [activeCell]: [...(prev[activeCell] || []), value]
    }));
    
    setAttempts(prev => prev + 1);
  };
  
  // Reset blocks in the active cell
  const handleResetCell = () => {
    if (!activeCell) return;
    
    if (isAudioEnabled) playSound('reset');
    
    setCellBlocks(prev => ({
      ...prev,
      [activeCell]: []
    }));
    
    toast.info(t('boxMethod3D.blocksReset'));
  };
  
  // Called when the entire exercise is completed
  const handleProblemComplete = (success: boolean) => {
    const currentProblem = getCurrentProblem();
    if (!currentProblem) return;
    
    setIsCorrect(success);
    
    if (success) {
      setFeedback(t('boxMethod3D.problemComplete'));
      
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      const exerciseResult = {
        problemType: '3D-Box-Method',
        sustainabilityTheme: currentProblem.context.split(':')[0],
        attempts,
        timeSpent,
        success: true,
        date: new Date().toISOString(),
      };
      
      addExercise(exerciseResult);
      
      // Major confetti celebration for completing the problem
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 }
      });
      
      // Automatically move to next problem after a short delay
      setTimeout(() => {
        if (currentProblemIndex < problems.length - 1) {
          handleNavigation('next');
        } else {
          // Get the next problem in the progression
          const allProblems = getBoxMethod3DProblems();
          const currentProblemIndex = allProblems.findIndex(p => p.problem === currentProblem.problem);
          
          if (currentProblemIndex < allProblems.length - 1) {
            // Move to the next problem in the sequence
            const nextProblem = allProblems[currentProblemIndex + 1];
            setProblems([nextProblem]);
            setCurrentProblemIndex(0);
            const factors = nextProblem.problem.split('×').map(n => parseInt(n.trim()));
            setFactor1(factors[0]);
            setFactor2(factors[1]);
            resetProblem();
          } else {
            // If we've completed all problems, get random problems from easy to medium
          const randomProblems = getBoxMethod3DProblems()
              .filter(p => p.difficulty === 'easy' || p.difficulty === 'medium')
            .sort(() => Math.random() - 0.5)
              .slice(0, 3);
          setProblems(randomProblems);
          setCurrentProblemIndex(0);
          resetProblem();
          }
        }
      }, 2000);
    }
  };
  
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
      resetProblem();
    } else if (direction === 'next' && currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      resetProblem();
    } else if (direction === 'next' && currentProblemIndex === problems.length - 1) {
      // This is the last problem
      onComplete();
    }
  };
  
  const handleContinue = () => {
    if (currentProblemIndex < problems.length - 1) {
      handleNavigation('next');
    } else {
      onComplete();
    }
  };
  
  const handleHint = () => {
    setShowHint(!showHint);
  };
  
  // Handle removing a block from a cell
  const handleRemoveBlock = (cellId: string, blockIndex: number) => {
    if (!cellId || completedCells.includes(cellId)) return;
    
    if (isAudioEnabled) playSound('reset');
    
    setCellBlocks(prev => {
      const updatedBlocks = { ...prev };
      const cellBlocks = [...(updatedBlocks[cellId] || [])];
      
      // Remove the block at the specified index
      cellBlocks.splice(blockIndex, 1);
      updatedBlocks[cellId] = cellBlocks;
      
      return updatedBlocks;
    });
    
    // Consider this an attempt as well
    setAttempts(prev => prev + 1);
  };
  
  const handleNewExercise = () => {
    // Get new problems based on selected difficulty
    let newProblems;
    if (isTutorialMode) {
      // After tutorial, start with 2 × 10
      newProblems = getBoxMethod3DProblems()
        .filter(p => p.problem === "2 × 10")
        .slice(0, 1);
    } else {
      // Use selected difficulty for regular exercises
      newProblems = getBoxMethod3DProblems()
        .filter(p => p.difficulty === selectedDifficulty)
        .sort(() => Math.random() - 0.5)
        .slice(0, 1);
    }

    if (newProblems.length > 0) {
      const newProblem = newProblems[0];
      
      // Update the problems array with the new problem
      setProblems([newProblem]);
      setCurrentProblemIndex(0);
      
      // Reset the exercise state
      resetProblem();
      
      // Extract and set the factors
      const factors = newProblem.problem.split('×').map(n => parseInt(n.trim()));
      setFactor1(factors[0]);
      setFactor2(factors[1]);
      
      // Reset other states
      setFeedback('');
      setAttempts(0);
      setStartTime(Date.now());
      setIsCorrect(null);
      setShowHint(false);
      setCellBlocks({});
      setCompletedCells([]);
      setActiveCell(null);
    }
  };
  
  const currentProblem = getCurrentProblem();
  if (!currentProblem) return null;
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Select
              value={selectedDifficulty}
              onValueChange={(value: Difficulty) => handleDifficultySelect(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('boxMethod3D.selectDifficulty')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">{t('boxMethod3D.difficulty.easy')}</SelectItem>
                <SelectItem value="medium">{t('boxMethod3D.difficulty.medium')}</SelectItem>
                <SelectItem value="hard">{t('boxMethod3D.difficulty.hard')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <AudioToggle 
              isAudioEnabled={isAudioEnabled} 
              onToggle={handleAudioToggle} 
            />
          </div>
        </div>

        <BlockControls
          onAddBlock={handleAddBlock}
          onResetCell={handleResetCell}
          onCheckCell={handleCheckCell}
          isDisabled={!activeCell}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between relative">
            <div className="absolute right-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewExercise}
              >
                {t('boxMethod3D.newExercise')}
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-center w-full">
              {getCurrentProblem()?.problem}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <MultiplicationGrid
              factor1={factor1}
              factor2={factor2}
              onCellClick={handleCellClick}
              onRemoveBlock={handleRemoveBlock}
              cellBlocks={cellBlocks}
              completedCells={completedCells}
              activeCell={activeCell}
            />
          </div>
        </CardContent>
      </Card>

      {feedback && (
        <div className={cn(
          "p-4 rounded-lg text-center",
          isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default BoxMethod3DExercise;
