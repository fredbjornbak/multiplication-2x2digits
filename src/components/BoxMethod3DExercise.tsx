import { useState, useEffect } from 'react';
import { useExerciseState } from '@/hooks/useExerciseState';
import { useExerciseLogic } from '@/hooks/useExerciseLogic';
import ExerciseProblemCard from './exercise/ExerciseProblemCard';
import ExerciseFeedback from './exercise/ExerciseFeedback';
import VisualProgress from './exercise/VisualProgress';

interface BoxMethod3DExerciseProps {
  onComplete: () => void;
}

const BoxMethod3DExercise = ({ onComplete }: BoxMethod3DExerciseProps) => {
  const exerciseState = useExerciseState();
  const {
    problems,
    currentProblemIndex,
    feedback,
    isCorrect,
    factor1,
    factor2,
    activeCell,
    cellBlocks,
    completedCells,
    cellValidationStatus,
    setFactor1,
    setFactor2,
    setStartTime
  } = exerciseState;

  const exerciseLogic = useExerciseLogic({ ...exerciseState, onComplete });
  const {
    generateRandomizedSequence,
    handleCheckGrid,
    handleCellClick,
    handleAddBlock,
    handleResetCell,
    handleRemoveBlock,
    autoSelectFirstCell
  } = exerciseLogic;

  // Initialize with randomized sequence
  useEffect(() => {
    const randomizedProblems = generateRandomizedSequence();
    exerciseState.setProblems(randomizedProblems);
    if (randomizedProblems.length > 0) {
      const factors = randomizedProblems[0].problem.split('×').map(n => parseInt(n.trim()));
      setFactor1(factors[0]);
      setFactor2(factors[1]);
    }
    exerciseState.resetProblem();
  }, []);

  useEffect(() => {
    if (problems.length > 0 && currentProblemIndex < problems.length) {
      const problem = problems[currentProblemIndex];
      const factors = problem.problem.split('×').map(n => parseInt(n.trim()));
      setFactor1(factors[0]);
      setFactor2(factors[1]);
      // Auto-select first cell when problem changes
      autoSelectFirstCell();
    }
  }, [problems, currentProblemIndex]);

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
  }, [handleCheckGrid]);

  const currentProblem = exerciseState.getCurrentProblem();
  if (!currentProblem) return null;

  return (
    <div className="h-screen flex flex-col max-w-7xl mx-auto overflow-hidden">
      {/* Visual Progress Indicator - Compact */}
      <div className="flex-shrink-0 h-8">
        <VisualProgress 
          currentIndex={currentProblemIndex} 
          totalQuestions={problems.length || 8} 
          className="h-full"
        />
      </div>

      {/* Main Problem Card - Takes remaining space */}
      <div className="flex-1 min-h-0">
          <ExerciseProblemCard
            problem={currentProblem.problem}
            factor1={factor1}
            factor2={factor2}
            onCellClick={handleCellClick}
            onRemoveBlock={handleRemoveBlock}
            
            cellBlocks={cellBlocks}
            completedCells={completedCells}
            activeCell={activeCell}
            onAddBlock={handleAddBlock}
            onResetCell={handleResetCell}
            onCheckGrid={handleCheckGrid}
            cellValidationStatus={cellValidationStatus}
          />
      </div>

      {/* Feedback Section - Compact */}
      <div className="flex-shrink-0 h-10">
        <ExerciseFeedback feedback={feedback} isCorrect={isCorrect} />
      </div>
    </div>
  );
};

export default BoxMethod3DExercise;