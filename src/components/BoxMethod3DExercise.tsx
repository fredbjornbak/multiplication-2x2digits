import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, HelpCircle, ChevronRight, ChevronLeft, InfoIcon } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { BoxMethodProblem3D, getBoxMethod3DProblems } from '@/utils/boxMethod';
import confetti from 'canvas-confetti';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Canvas } from '@react-three/fiber';
import { SolarPanelReward, TreePlantingReward, HouseholdReward } from './RewardVisuals';
import MultiplicationGrid from './MultiplicationGrid';
import BlockControls from './BlockControls';
import AudioToggle from './AudioToggle';
import { playSound } from '@/lib/sounds';
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
const BoxMethod3DExercise = ({
  onComplete
}: BoxMethod3DExerciseProps) => {
  const {
    userModel,
    addExercise
  } = useUserStore();
  const [problems, setProblems] = useState<BoxMethodProblem3D[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

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

  // Generate a randomized sequence of 8 problems with difficulty progression
  const generateRandomizedSequence = () => {
    const allProblems = getBoxMethod3DProblems();
    const easyProblems = allProblems.filter(p => p.difficulty === 'easy');
    const mediumProblems = allProblems.filter(p => p.difficulty === 'medium');
    const hardProblems = allProblems.filter(p => p.difficulty === 'hard');

    // Create a progression: 4 easy, 2 medium, 2 hard
    const sequence = [
      ...easyProblems.sort(() => Math.random() - 0.5).slice(0, 4),
      ...mediumProblems.sort(() => Math.random() - 0.5).slice(0, 2),
      ...hardProblems.sort(() => Math.random() - 0.5).slice(0, 2)
    ];

    return sequence;
  };

  // Initialize with randomized sequence
  useEffect(() => {
    const randomizedProblems = generateRandomizedSequence();
    setProblems(randomizedProblems);
    if (randomizedProblems.length > 0) {
      const factors = randomizedProblems[0].problem.split('×').map(n => parseInt(n.trim()));
      setFactor1(factors[0]);
      setFactor2(factors[1]);
    }
    resetProblem();
  }, []);
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
      case 'Tree':
        return 'Trees planted';
      case 'Household':
        return 'Homes with power';
      default:
        return 'Solar panels built';
    }
  };

  // Get theme-specific goal label
  const getGoalLabel = () => {
    const theme = getCurrentTheme();
    switch (theme) {
      case 'Tree':
        return 'Help replant the forest!';
      case 'Household':
        return 'Help power the community!';
      default:
        return 'Help build a solar farm!';
    }
  };

  // Get theme-specific completion message
  const getCompletionMessage = () => {
    const theme = getCurrentTheme();
    switch (theme) {
      case 'Tree':
        return 'You have planted a forest!';
      case 'Household':
        return 'You have powered a community!';
      default:
        return 'You have built a solar farm!';
    }
  };

  // Get theme-specific details message
  const getDetailsMessage = () => {
    const theme = getCurrentTheme();
    switch (theme) {
      case 'Tree':
        return 'Your multiplication skills have helped plant trees and restore natural habitats. Great work!';
      case 'Household':
        return 'Your multiplication skills have helped deliver clean energy to homes in the community. Great work!';
      default:
        return 'Your multiplication skills have helped generate clean energy for the community. Great work!';
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
    const cellIndex = row * currentProblem.placeValueDecomposition.secondNumber.length + col;
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

  // Handle checking the entire grid
  const handleCheckGrid = () => {
    const currentProblem = getCurrentProblem();
    if (!currentProblem) return;

    const totalCells = getTotalCells();
    let allCellsCorrect = true;
    let totalGridSum = 0;

    // Check each cell in the grid
    for (let row = 0; row < currentProblem.placeValueDecomposition.firstNumber.length; row++) {
      for (let col = 0; col < currentProblem.placeValueDecomposition.secondNumber.length; col++) {
        const cellId = `${row}-${col}`;
        const blocksInCell = (cellBlocks[cellId] || []);
        const blocksSum = blocksInCell.reduce((sum, block) => sum + block, 0);
        
        const cellIndex = row * currentProblem.placeValueDecomposition.secondNumber.length + col;
        const expectedProduct = currentProblem.boxGrid[cellIndex]?.product || 0;
        
        if (blocksSum !== expectedProduct) {
          allCellsCorrect = false;
        } else {
          totalGridSum += blocksSum;
        }
      }
    }

    // Check if the total matches the expected answer
    const correctAnswer = currentProblem.sumStep.total;
    const isCompletelyCorrect = allCellsCorrect && totalGridSum === correctAnswer;

    if (isCompletelyCorrect) {
      if (isAudioEnabled) playSound('correct');
      setFeedback('Perfect! All cells are correct!');
      setIsCorrect(true);

      // Mark all cells as completed
      const allCellIds = [];
      for (let row = 0; row < currentProblem.placeValueDecomposition.firstNumber.length; row++) {
        for (let col = 0; col < currentProblem.placeValueDecomposition.secondNumber.length; col++) {
          allCellIds.push(`${row}-${col}`);
        }
      }
      setCompletedCells(allCellIds);
      setProgressAmount(100);

      // Handle problem completion
      handleProblemComplete(true);
    } else {
      if (isAudioEnabled) playSound('error');
      if (!allCellsCorrect) {
        setFeedback('Some cells are incorrect. Check your block placements!');
      } else {
        setFeedback('The total doesn\'t match. Check all cells!');
      }
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
    }, 3000);
  };

  // Handle cell clicks
  const handleCellClick = (row: number, col: number) => {
    const cellId = `${row}-${col}`;

    // If cell is already completed, don't allow further interaction
    if (completedCells.includes(cellId)) {
      if (isAudioEnabled) playSound('error');
      toast.error('This cell is already completed!');
      return;
    }
    if (isAudioEnabled) playSound('click');
    setActiveCell(cellId);

    // Initialize cell blocks if not already present
    if (!cellBlocks[cellId]) {
      setCellBlocks(prev => ({
        ...prev,
        [cellId]: []
      }));
    }
  };

  // Handle adding blocks to the active cell (keep for backward compatibility)
  const handleAddBlock = (value: Block) => {
    if (!activeCell) return;
    if (isAudioEnabled) playSound('add');
    setCellBlocks(prev => ({
      ...prev,
      [activeCell]: [...(prev[activeCell] || []), value]
    }));
    setAttempts(prev => prev + 1);
  };

  // Handle dropping blocks onto any cell
  const handleDropBlock = (cellId: string, value: Block) => {
    if (completedCells.includes(cellId)) return;
    if (isAudioEnabled) playSound('add');
    setCellBlocks(prev => ({
      ...prev,
      [cellId]: [...(prev[cellId] || []), value]
    }));
    setAttempts(prev => prev + 1);

    // Auto-select the cell that was dropped on
    setActiveCell(cellId);
  };

  // Reset blocks in the active cell
  const handleResetCell = () => {
    if (!activeCell) return;
    if (isAudioEnabled) playSound('reset');
    setCellBlocks(prev => ({
      ...prev,
      [activeCell]: []
    }));
    toast.info('Blocks reset');
  };

  // Called when the entire exercise is completed
  const handleProblemComplete = (success: boolean) => {
    const currentProblem = getCurrentProblem();
    if (!currentProblem) return;
    setIsCorrect(success);
    if (success) {
      setFeedback('Awesome! You have completed all parts of the problem!');
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const exerciseResult = {
        problemType: '3D-Box-Method',
        sustainabilityTheme: currentProblem.context.split(':')[0],
        attempts,
        timeSpent,
        success: true,
        date: new Date().toISOString()
      };
      addExercise(exerciseResult);

      // Major confetti celebration for completing the problem
      confetti({
        particleCount: 200,
        spread: 160,
        origin: {
          y: 0.6
        }
      });

      // Automatically move to next problem after a short delay
      setTimeout(() => {
        if (currentProblemIndex < problems.length - 1) {
          handleNavigation('next');
        } else {
          // We've completed all 8 problems, generate a new randomized sequence
          const newRandomizedProblems = generateRandomizedSequence();
          setProblems(newRandomizedProblems);
          setCurrentProblemIndex(0);
          resetProblem();
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
      const updatedBlocks = {
        ...prev
      };
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
    // Generate a new randomized sequence of 8 problems
    const newRandomizedProblems = generateRandomizedSequence();
    setProblems(newRandomizedProblems);
    setCurrentProblemIndex(0);

    // Reset the exercise state
    resetProblem();

    // Extract and set the factors from the first problem
    if (newRandomizedProblems.length > 0) {
      const factors = newRandomizedProblems[0].problem.split('×').map(n => parseInt(n.trim()));
      setFactor1(factors[0]);
      setFactor2(factors[1]);
    }

    // Reset other states
    setFeedback('');
    setAttempts(0);
    setStartTime(Date.now());
    setIsCorrect(null);
    setShowHint(false);
    setCellBlocks({});
    setCompletedCells([]);
    setActiveCell(null);
  };
  const currentProblem = getCurrentProblem();
  if (!currentProblem) return null;
  // Handle Enter key globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCheckGrid();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [cellBlocks, getCurrentProblem]);

  return <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      

      {/* Main Problem Card */}
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-muted/30 py-6">
          <CardTitle className="text-3xl font-bold text-foreground">
            {getCurrentProblem()?.problem}
          </CardTitle>
        </CardHeader>
        
        {/* Control Panel */}
        <div className="bg-muted/20 border-b p-6">
          <BlockControls onAddBlock={handleAddBlock} onResetCell={handleResetCell} onCheckGrid={handleCheckGrid} isDisabled={false} className="max-w-2xl mx-auto" />
        </div>

        <CardContent className="p-8">
          <div className="flex justify-center">
            <MultiplicationGrid factor1={factor1} factor2={factor2} onCellClick={handleCellClick} onRemoveBlock={handleRemoveBlock} onDropBlock={handleDropBlock} cellBlocks={cellBlocks} completedCells={completedCells} activeCell={activeCell} className="shadow-xl" />
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      {feedback && <div className={cn("p-4 rounded-xl text-center font-medium border-2 transition-all", isCorrect ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200")}>
          {feedback}
        </div>}
    </div>;
};
export default BoxMethod3DExercise;