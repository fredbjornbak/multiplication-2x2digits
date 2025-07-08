import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import BoxMethodVisual from './BoxMethodVisual';
import { useUserStore } from '@/store/userStore';
import { 
  generateProblem, 
  calculateDifficulty, 
  adjustDifficulty,
  getSustainabilityContext
} from '@/utils/adaptiveSystem';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Define the concept types
type ConceptType = 'singleDigit' | 'doubleDigitSingle' | 'doubleDigitDouble';

type TutorialStep = 'welcome' | 'row' | 'column' | 'calculate' | 'complete';

interface MultiplicationExerciseProps {
  conceptType: ConceptType;
  onComplete: (correct: boolean) => void;
  tutorialStep?: TutorialStep;
  onTutorialData?: (data: { rowValue: number; columnValue: number; userAnswer: string; isSubmitted?: boolean }) => void;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  exampleRow?: number;
  exampleColumn?: number;
  exampleAnswer?: string;
}

const MultiplicationExercise: React.FC<MultiplicationExerciseProps> = ({
  conceptType,
  onComplete,
  isSubmitted,
  setIsSubmitted,
  exampleRow,
  exampleColumn,
  exampleAnswer,
  tutorialStep
}) => {
  const { userModel, addExercise, updateFluency } = useUserStore();
  const [rowValue, setRowValue] = useState(1);
  const [columnValue, setColumnValue] = useState(1);
  const [answerInput, setAnswerInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userModifiedFactors, setUserModifiedFactors] = useState(false);
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [highlightSelector, setHighlightSelector] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Add tutorial overlay refs
  const rowSliderRef = useRef<HTMLDivElement>(null);
  const columnSliderRef = useRef<HTMLDivElement>(null);

  // Add tutorial overlay styles
  const tutorialOverlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
    pointerEvents: 'none' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const tutorialContentStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    textAlign: 'center' as const,
    maxWidth: '80%',
  };

  // Reset answer input when factors change
  useEffect(() => {
    if (userModifiedFactors) {
      setAnswerInput('');
      setIsCorrect(null);
      setIsSubmitted(false);
    }
  }, [rowValue, columnValue, userModifiedFactors]);

  // Update row and column values when example values change
  useEffect(() => {
    if (exampleRow !== undefined) {
      setRowValue(exampleRow);
    }
  }, [exampleRow]);

  useEffect(() => {
    if (exampleColumn !== undefined) {
      setColumnValue(exampleColumn);
    }
  }, [exampleColumn]);

  useEffect(() => {
    if (exampleAnswer !== undefined) {
      setAnswerInput(exampleAnswer);
    }
  }, [exampleAnswer]);

  const handleSubmit = () => {
    if (isGuidedMode) {
      return;
    }

    const userAnswer = parseInt(answerInput);
    const isCorrect = userAnswer === rowValue * columnValue;

    setIsSubmitted(true);
    setIsCorrect(isCorrect);

    if (isCorrect) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  const getHelpMessage = () => {
    if (showHint) {
      return (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">{t('multiplicationExercise.help.title')}</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>{t('multiplicationExercise.help.steps.step1')}</li>
            <li>{t('multiplicationExercise.help.steps.step2')}</li>
            <li>{t('multiplicationExercise.help.steps.step3')}</li>
            <li>{t('multiplicationExercise.help.steps.step4')}</li>
          </ol>
        </div>
      );
    }
    return null;
  };

  const getFeedbackMessage = () => {
    if (showFeedback) {
      return (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">{t('multiplicationExercise.feedback.title')}</h3>
          <ul className="list-disc list-inside space-y-2 text-green-700">
            <li>{t('multiplicationExercise.feedback.tips.tip1')}</li>
            <li>{t('multiplicationExercise.feedback.tips.tip2')}</li>
            <li>{t('multiplicationExercise.feedback.tips.tip3')}</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[800px]">
      <div className="text-2xl font-bold mb-4">
        {t('multiplicationExercise.problem', { row: rowValue, column: columnValue })}
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-4">
        <div 
          ref={rowSliderRef}
          className={cn(
            "flex flex-col space-y-2 w-full md:w-1/2 relative",
            tutorialStep === 'row' && "highlight-animation"
          )}
        >
          {tutorialStep === 'row' && (
            <div style={tutorialOverlayStyle}>
              <div style={tutorialContentStyle}>
                <div className="text-2xl font-bold mb-2 text-white">{t('multiplicationExercise.tutorial.moveSlider', { value: 4 })}</div>
                <div className="animate-bounce text-white text-2xl">↓</div>
              </div>
            </div>
          )}
          <label className="text-sm font-medium flex justify-between">
            <span>{t('multiplicationExercise.rows', { value: rowValue })}</span>
          </label>
          <Slider
            className="row-slider"
            value={[rowValue]}
            min={1}
            max={9}
            step={1}
            onValueChange={(value) => {
              if (!isGuidedMode) {
                setRowValue(value[0]);
                setUserModifiedFactors(true);
              }
            }}
            disabled={isGuidedMode}
          />
        </div>
        
        <div 
          ref={columnSliderRef}
          className={cn(
            "flex flex-col space-y-2 w-full md:w-1/2 relative",
            tutorialStep === 'column' && "highlight-animation"
          )}
        >
          {tutorialStep === 'column' && (
            <div style={tutorialOverlayStyle}>
              <div style={tutorialContentStyle}>
                <div className="text-2xl font-bold mb-2 text-white">{t('multiplicationExercise.tutorial.moveSlider', { value: 6 })}</div>
                <div className="animate-bounce text-white text-2xl">↓</div>
              </div>
            </div>
          )}
          <label className="text-sm font-medium flex justify-between">
            <span>{t('multiplicationExercise.columns', { value: columnValue })}</span>
          </label>
          <Slider
            className="column-slider"
            value={[columnValue]}
            min={1}
            max={9}
            step={1}
            onValueChange={(value) => {
              if (!isGuidedMode) {
                setColumnValue(value[0]);
                setUserModifiedFactors(true);
              }
            }}
            disabled={isGuidedMode}
          />
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center min-h-0">
        <BoxMethodVisual 
          rows={rowValue} 
          columns={columnValue} 
          className="w-full max-w-2xl"
        />
      </div>

      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex items-center space-x-4">
          <Input
            ref={inputRef}
            type="number"
            placeholder={t('multiplicationExercise.placeholder')}
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            className="flex-1"
            disabled={isGuidedMode}
          />
          <Button 
            onClick={handleSubmit}
            disabled={isGuidedMode || !answerInput}
            className="flex items-center gap-2"
          >
            {isCorrect === null ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                {t('multiplicationExercise.submit')}
              </>
            ) : isCorrect ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                {t('multiplicationExercise.correct')}
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                {t('multiplicationExercise.tryAgain')}
              </>
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2"
        >
          <HelpCircle className="h-5 w-5" />
          {showHint ? t('multiplicationExercise.help.button.hide') : t('multiplicationExercise.help.button.show')}
        </Button>

        {getHelpMessage()}
        {getFeedbackMessage()}
      </div>
    </div>
  );
};

export default MultiplicationExercise;
