import { useState, useEffect } from 'react';
import { useExerciseState } from '@/hooks/useExerciseState';
import { useExerciseLogic } from '@/hooks/useExerciseLogic';
import ExerciseProblemCard from './exercise/ExerciseProblemCard';
import ExerciseFeedback from './exercise/ExerciseFeedback';
import VisualProgress from './exercise/VisualProgress';
import MultiplicationHelp from './MultiplicationHelp';

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
    showHelpDialog,
    helpFactors,
    factor1,
    factor2,
    activeCell,
    cellBlocks,
    completedCells,
    setShowHelpDialog,
    setHelpFactors,
    setFactor1,
    setFactor2,
    setStartTime
  } = exerciseState;

  const exerciseLogic = useExerciseLogic(exerciseState);
  const {
    generateRandomizedSequence,
    handleCheckGrid,
    handleCellClick,
    handleAddBlock,
    handleDropBlock,
    handleResetCell,
    handleRemoveBlock,
    handleAutoComplete
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

  const handleShowHelp = (factor1: number, factor2: number, problem: string) => {
    setHelpFactors({factor1, factor2, problem});
    setShowHelpDialog(true);
  };

  const currentProblem = exerciseState.getCurrentProblem();
  if (!currentProblem) return null;

  return (
    <div className="h-screen flex flex-col max-w-7xl mx-auto p-1 lg:p-2 overflow-hidden">
      {/* Visual Progress Indicator - Fixed height */}
      <div className="flex-shrink-0 h-12 lg:h-16">
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
          onDropBlock={handleDropBlock}
          cellBlocks={cellBlocks}
          completedCells={completedCells}
          activeCell={activeCell}
          onAddBlock={handleAddBlock}
          onResetCell={handleResetCell}
          onCheckGrid={handleCheckGrid}
          onAutoComplete={handleAutoComplete}
          onShowHelp={handleShowHelp}
        />
      </div>

      {/* Feedback Section - Fixed height */}
      <div className="flex-shrink-0 h-16 lg:h-20">
        <ExerciseFeedback feedback={feedback} isCorrect={isCorrect} />
      </div>

      {/* Help Dialog */}
      <MultiplicationHelp
        open={showHelpDialog}
        onOpenChange={setShowHelpDialog}
        factor1={helpFactors.factor1}
        factor2={helpFactors.factor2}
        problem={helpFactors.problem}
      />
    </div>
  );
};

export default BoxMethod3DExercise;