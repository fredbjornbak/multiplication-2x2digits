import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { BoxMethodProblem3D, getBoxMethod3DProblems } from '@/utils/boxMethod';
import { Block } from '@/utils/boxMethod/types';
import { playSound } from '@/lib/sounds';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface UseExerciseLogicProps {
  getCurrentProblem: () => BoxMethodProblem3D | null;
  cellBlocks: Record<string, Block[]>;
  completedCells: string[];
  attempts: number;
  startTime: number;
  isAudioEnabled: boolean;
  showHint: boolean;
  currentProblemIndex: number;
  problems: BoxMethodProblem3D[];
  activeCell: string | null;
  cellValidationStatus: Record<string, 'correct' | 'incorrect' | null>;
  onComplete?: () => void;
  
  setIsCorrect: (correct: boolean | null) => void;
  setFeedback: (feedback: string) => void;
  setAttempts: (attempts: number | ((prev: number) => number)) => void;
  setCompletedCells: (cells: string[]) => void;
  setProgressAmount: (amount: number) => void;
  setShowHint: (show: boolean) => void;
  setCellBlocks: (blocks: Record<string, Block[]> | ((prev: Record<string, Block[]>) => Record<string, Block[]>)) => void;
  setActiveCell: (cell: string | null) => void;
  resetProblem: () => void;
  setProblems: (problems: BoxMethodProblem3D[]) => void;
  setCurrentProblemIndex: (index: number) => void;
  setFactor1: (factor: number) => void;
  setFactor2: (factor: number) => void;
  setCellValidationStatus: (status: Record<string, 'correct' | 'incorrect' | null> | ((prev: Record<string, 'correct' | 'incorrect' | null>) => Record<string, 'correct' | 'incorrect' | null>)) => void;
}

export const useExerciseLogic = ({
  getCurrentProblem,
  cellBlocks,
  completedCells,
  attempts,
  startTime,
  isAudioEnabled,
  showHint,
  currentProblemIndex,
  problems,
  activeCell,
  cellValidationStatus,
  onComplete,
  setIsCorrect,
  setFeedback,
  setAttempts,
  setCompletedCells,
  setProgressAmount,
  setShowHint,
  setCellBlocks,
  setActiveCell,
  resetProblem,
  setProblems,
  setCurrentProblemIndex,
  setFactor1,
  setFactor2,
  setCellValidationStatus
}: UseExerciseLogicProps) => {
  const { addExercise } = useUserStore();

  // Generate a randomized sequence of 8 problems with difficulty progression
  const generateRandomizedSequence = useCallback(() => {
    const allProblems = getBoxMethod3DProblems();
    const easyProblems = allProblems.filter(p => p.difficulty === 'easy');
    const mediumProblems = allProblems.filter(p => p.difficulty === 'medium');
    const hardProblems = allProblems.filter(p => p.difficulty === 'hard');

    const sequence = [
      ...easyProblems.sort(() => Math.random() - 0.5).slice(0, 4),
      ...mediumProblems.sort(() => Math.random() - 0.5).slice(0, 2),
      ...hardProblems.sort(() => Math.random() - 0.5).slice(0, 2)
    ];

    return sequence;
  }, []);

  // Called when the entire exercise is completed
  const handleProblemComplete = useCallback((success: boolean) => {
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

      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        if (currentProblemIndex < problems.length - 1) {
          setCurrentProblemIndex(currentProblemIndex + 1);
          resetProblem();
        } else {
          // All problems completed - show final congratulations
          setFeedback('🎉 Congratulations! You completed all problems!');
          confetti({
            particleCount: 300,
            spread: 180,
            origin: { y: 0.4 }
          });
          setTimeout(() => {
            onComplete?.();
          }, 1000);
        }
      }, 2000);
    }
  }, [getCurrentProblem, startTime, attempts, addExercise, currentProblemIndex, problems, onComplete, setCurrentProblemIndex, resetProblem, setIsCorrect, setFeedback]);

  // Handle checking the entire grid
  const handleCheckGrid = useCallback(() => {
    const currentProblem = getCurrentProblem();
    if (!currentProblem) return;

    let allCellsCorrect = true;
    let totalGridSum = 0;
    let correctCellsCount = 0;
    const newValidationStatus: Record<string, 'correct' | 'incorrect' | null> = {};

    // Check each cell in the grid and set validation status
    for (let row = 0; row < currentProblem.placeValueDecomposition.firstNumber.length; row++) {
      for (let col = 0; col < currentProblem.placeValueDecomposition.secondNumber.length; col++) {
        const cellId = `${row}-${col}`;
        const blocksInCell = (cellBlocks[cellId] || []);
        const blocksSum = blocksInCell.reduce((sum, block) => sum + block, 0);
        
        const cellIndex = row * currentProblem.placeValueDecomposition.secondNumber.length + col;
        const expectedProduct = currentProblem.boxGrid[cellIndex]?.product || 0;
        
        if (blocksSum === expectedProduct) {
          newValidationStatus[cellId] = 'correct';
          totalGridSum += blocksSum;
          correctCellsCount++;
        } else {
          newValidationStatus[cellId] = 'incorrect';
          allCellsCorrect = false;
        }
      }
    }

    // Set validation status for all cells
    setCellValidationStatus(newValidationStatus);

    const correctAnswer = currentProblem.sumStep.total;
    const isCompletelyCorrect = allCellsCorrect && totalGridSum === correctAnswer;
    const totalCells = currentProblem.placeValueDecomposition.firstNumber.length * currentProblem.placeValueDecomposition.secondNumber.length;

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

      handleProblemComplete(true);
    } else {
      if (isAudioEnabled) playSound('error');
      if (!allCellsCorrect) {
        setFeedback(`${correctCellsCount} out of ${totalCells} cells are correct. Check the incorrect cells!`);
      } else {
        setFeedback('The total doesn\'t match. Check all cells!');
      }
      setIsCorrect(false);
      setAttempts(prev => prev + 1);

      if (attempts > 1 && !showHint) {
        setShowHint(true);
      }
    }

    setTimeout(() => {
      setFeedback('');
      setIsCorrect(null);
    }, 3000);
  }, [getCurrentProblem, cellBlocks, isAudioEnabled, attempts, showHint, setFeedback, setIsCorrect, setCompletedCells, setProgressAmount, setAttempts, setShowHint, handleProblemComplete, setCellValidationStatus]);

  // Handle cell clicks
  const handleCellClick = useCallback((row: number, col: number) => {
    const cellId = `${row}-${col}`;

    if (completedCells.includes(cellId)) {
      if (isAudioEnabled) playSound('error');
      toast.error('This cell is already completed!');
      return;
    }
    if (isAudioEnabled) playSound('click');
    setActiveCell(cellId);

    if (!cellBlocks[cellId]) {
      setCellBlocks(prev => ({
        ...prev,
        [cellId]: []
      }));
    }
  }, [completedCells, isAudioEnabled, cellBlocks, setActiveCell, setCellBlocks]);

  // Handle adding blocks to the active cell
  const handleAddBlock = useCallback((value: Block) => {
    if (!activeCell) return;
    if (isAudioEnabled) playSound('add');
    setCellBlocks(prev => ({
      ...prev,
      [activeCell]: [...(prev[activeCell] || []), value]
    }));
    setAttempts(prev => prev + 1);
    // Clear validation status when cell is modified
    setCellValidationStatus(prev => ({
      ...prev,
      [activeCell]: null
    }));
  }, [activeCell, isAudioEnabled, setCellBlocks, setAttempts, setCellValidationStatus]);

  // Handle dropping blocks onto any cell
  const handleDropBlock = useCallback((cellId: string, value: Block) => {
    if (completedCells.includes(cellId)) return;
    if (isAudioEnabled) playSound('add');
    setCellBlocks(prev => ({
      ...prev,
      [cellId]: [...(prev[cellId] || []), value]
    }));
    setAttempts(prev => prev + 1);
    setActiveCell(cellId);
    // Clear validation status when cell is modified
    setCellValidationStatus(prev => ({
      ...prev,
      [cellId]: null
    }));
  }, [completedCells, isAudioEnabled, setCellBlocks, setAttempts, setActiveCell, setCellValidationStatus]);

  // Reset blocks in the active cell
  const handleResetCell = useCallback(() => {
    if (!activeCell) return;
    if (isAudioEnabled) playSound('reset');
    setCellBlocks(prev => ({
      ...prev,
      [activeCell]: []
    }));
    toast.info('Blocks reset');
  }, [activeCell, isAudioEnabled, setCellBlocks]);

  const handleNavigation = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
      resetProblem();
    } else if (direction === 'next' && currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      resetProblem();
    }
  }, [currentProblemIndex, problems.length, setCurrentProblemIndex, resetProblem]);

  // Handle removing a block from a cell
  const handleRemoveBlock = useCallback((cellId: string, blockIndex: number) => {
    if (!cellId || completedCells.includes(cellId)) return;
    if (isAudioEnabled) playSound('reset');
    setCellBlocks(prev => {
      const updatedBlocks = { ...prev };
      const cellBlocksCopy = [...(updatedBlocks[cellId] || [])];
      cellBlocksCopy.splice(blockIndex, 1);
      updatedBlocks[cellId] = cellBlocksCopy;
      return updatedBlocks;
    });
    setAttempts(prev => prev + 1);
    // Clear validation status when cell is modified
    setCellValidationStatus(prev => ({
      ...prev,
      [cellId]: null
    }));
  }, [completedCells, isAudioEnabled, setCellBlocks, setAttempts, setCellValidationStatus]);

  const handleNewExercise = useCallback(() => {
    const newRandomizedProblems = generateRandomizedSequence();
    setProblems(newRandomizedProblems);
    setCurrentProblemIndex(0);
    resetProblem();

    if (newRandomizedProblems.length > 0) {
      const factors = newRandomizedProblems[0].problem.split('×').map(n => parseInt(n.trim()));
      setFactor1(factors[0]);
      setFactor2(factors[1]);
    }

    setFeedback('');
    setAttempts(0);
    setIsCorrect(null);
    setShowHint(false);
    setCellBlocks({});
    setCompletedCells([]);
    setActiveCell(null);
    setCellValidationStatus({});
  }, [generateRandomizedSequence, setProblems, setCurrentProblemIndex, resetProblem, setFactor1, setFactor2, setFeedback, setAttempts, setIsCorrect, setShowHint, setCellBlocks, setCompletedCells, setActiveCell]);

  // Auto complete function for testing
  const handleAutoComplete = useCallback(() => {
    const currentProblem = getCurrentProblem();
    if (!currentProblem) return;

    const newCellBlocks: Record<string, Block[]> = {};
    
    // Function to convert number to blocks (100s, 10s, 1s)
    const numberToBlocks = (num: number): Block[] => {
      const blocks: Block[] = [];
      let remaining = num;
      
      // Add 100s
      while (remaining >= 100) {
        blocks.push(100);
        remaining -= 100;
      }
      
      // Add 10s
      while (remaining >= 10) {
        blocks.push(10);
        remaining -= 10;
      }
      
      // Add 1s
      while (remaining >= 1) {
        blocks.push(1);
        remaining -= 1;
      }
      
      return blocks;
    };

    // Fill each cell with correct blocks
    for (let row = 0; row < currentProblem.placeValueDecomposition.firstNumber.length; row++) {
      for (let col = 0; col < currentProblem.placeValueDecomposition.secondNumber.length; col++) {
        const cellId = `${row}-${col}`;
        const cellIndex = row * currentProblem.placeValueDecomposition.secondNumber.length + col;
        const expectedProduct = currentProblem.boxGrid[cellIndex]?.product || 0;
        
        newCellBlocks[cellId] = numberToBlocks(expectedProduct);
      }
    }

    setCellBlocks(newCellBlocks);
    if (isAudioEnabled) playSound('correct');
    toast.success('Auto completed for testing!');
  }, [getCurrentProblem, setCellBlocks, isAudioEnabled]);

  return {
    generateRandomizedSequence,
    handleProblemComplete,
    handleCheckGrid,
    handleCellClick,
    handleAddBlock,
    handleDropBlock,
    handleResetCell,
    handleNavigation,
    handleRemoveBlock,
    handleNewExercise,
    handleAutoComplete
  };
};