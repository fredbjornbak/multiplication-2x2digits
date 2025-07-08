import { useState, useCallback } from 'react';
import { BoxMethodProblem3D } from '@/utils/boxMethod';
import { Block } from '@/utils/boxMethod/types';

export const useExerciseState = () => {
  const [problems, setProblems] = useState<BoxMethodProblem3D[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [helpFactors, setHelpFactors] = useState<{factor1: number, factor2: number, problem: string}>({factor1: 0, factor2: 0, problem: ''});

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

  const getCurrentProblem = useCallback(() => {
    return problems[currentProblemIndex] || null;
  }, [problems, currentProblemIndex]);

  const resetProblem = useCallback(() => {
    setFeedback('');
    setAttempts(0);
    setStartTime(Date.now());
    setIsCorrect(null);
    setShowHint(false);
    setActiveCell(null);
    setCellBlocks({});
    setCompletedCells([]);
    setProgressAmount(0);
  }, []);

  return {
    // State
    problems,
    currentProblemIndex,
    feedback,
    attempts,
    startTime,
    isCorrect,
    showHint,
    showHelpDialog,
    helpFactors,
    factor1,
    factor2,
    activeCell,
    cellBlocks,
    completedCells,
    isAudioEnabled,
    progressAmount,
    
    // Setters
    setProblems,
    setCurrentProblemIndex,
    setFeedback,
    setAttempts,
    setStartTime,
    setIsCorrect,
    setShowHint,
    setShowHelpDialog,
    setHelpFactors,
    setFactor1,
    setFactor2,
    setActiveCell,
    setCellBlocks,
    setCompletedCells,
    setIsAudioEnabled,
    setProgressAmount,
    
    // Helper functions
    getCurrentProblem,
    resetProblem
  };
};