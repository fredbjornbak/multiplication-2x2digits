import { useEffect, useState, useRef } from 'react';
import MultiplicationExercise from '@/components/MultiplicationExercise';
import PageLayout from '@/components/PageLayout';
import { useNavigate } from 'react-router-dom';
import { useTts } from '@/contexts/TtsContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const BasicMultiplication = () => {
  const navigate = useNavigate();
  const { speak, stopSpeaking } = useTts();
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isExampleMode, setIsExampleMode] = useState(true);
  const [exampleRow, setExampleRow] = useState(0);
  const [exampleColumn, setExampleColumn] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<'welcome' | 'row' | 'column' | 'calculate' | 'complete'>('welcome');
  
  // Refs to track tutorial progress and prevent duplicates
  const welcomeShown = useRef(false);
  const tutorialStepHandled = useRef<{[key: string]: boolean}>({
    welcome: false,
    row: false,
    column: false,
    calculate: false,
    complete: false
  });
  const autoProgressTimeout = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (autoProgressTimeout.current) {
        clearTimeout(autoProgressTimeout.current);
      }
    };
  }, []);

  const speakWithDelay = async (message: string, delay: number = 1000) => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      await speak(message);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.error('Error during speech with delay:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleAutoProgress = async () => {
    // Clear any existing timeout
    if (autoProgressTimeout.current) {
      clearTimeout(autoProgressTimeout.current);
    }

    // Set new timeout for auto-progression with longer delay
    autoProgressTimeout.current = setTimeout(() => {
      navigate('/box');
    }, 4000);
  };

  useEffect(() => {
    const startExampleSequence = async () => {
      // Only show welcome message once
      if (!welcomeShown.current) {
        welcomeShown.current = true;
        
        try {
          await speakWithDelay(t('basicMultiplication.welcome'), 1500);
          setTutorialStep('row');
        } catch (error) {
          console.error('Error in welcome message:', error);
        }
      }
    };

    startExampleSequence();
  }, [t]); // Added t dependency

  // Handle row tutorial
  useEffect(() => {
    if (tutorialStep === 'row' && !tutorialStepHandled.current.row) {
      tutorialStepHandled.current.row = true;
      
      const animateRow = async () => {
        try {
          // Ensure previous speech is stopped
          stopSpeaking();
          
          // Add a small delay before speaking
          setTimeout(async () => {
            await speakWithDelay(t('basicMultiplication.addRows'), 500);
            
            // Animate row slider to 4
            let currentRow = 0;
            const interval = setInterval(() => {
              if (currentRow < 4) {
                currentRow++;
                setExampleRow(currentRow);
              } else {
                clearInterval(interval);
                setTutorialStep('column');
              }
            }, 300);
          }, 300);
        } catch (error) {
          console.error('Error in row tutorial:', error);
        }
      };

      animateRow();
    }
  }, [tutorialStep, t]); // Added t dependency

  // Handle column tutorial
  useEffect(() => {
    if (tutorialStep === 'column' && !tutorialStepHandled.current.column) {
      tutorialStepHandled.current.column = true;
      
      const animateColumn = async () => {
        try {
          // Ensure previous speech is stopped
          stopSpeaking();
          
          // Add a small delay before speaking
          setTimeout(async () => {
            await speakWithDelay(t('basicMultiplication.addColumns'), 500);
            
            // Animate column slider to 6
            let currentColumn = 0;
            const interval = setInterval(() => {
              if (currentColumn < 6) {
                currentColumn++;
                setExampleColumn(currentColumn);
              } else {
                clearInterval(interval);
                setTutorialStep('calculate');
              }
            }, 300);
          }, 300);
        } catch (error) {
          console.error('Error in column tutorial:', error);
        }
      };

      animateColumn();
    }
  }, [tutorialStep, t]); // Added t dependency

  // Handle calculation tutorial
  useEffect(() => {
    if (tutorialStep === 'calculate' && !tutorialStepHandled.current.calculate) {
      tutorialStepHandled.current.calculate = true;
      
      const showCalculation = async () => {
        try {
          // Ensure previous speech is stopped
          stopSpeaking();
          
          // Add a small delay before speaking
          setTimeout(async () => {
            await speakWithDelay(t('basicMultiplication.countBoxes'), 2000);
            // Don't automatically move to complete step
            // Let the user submit their answer first
          }, 300);
        } catch (error) {
          console.error('Error in calculation tutorial:', error);
        }
      };

      showCalculation();
    }
  }, [tutorialStep, t]); // Added t dependency

  // Handle completion
  useEffect(() => {
    if (tutorialStep === 'complete' && !tutorialStepHandled.current.complete) {
      tutorialStepHandled.current.complete = true;
      
      const completeTutorial = async () => {
        try {
          // Ensure previous speech is stopped
          stopSpeaking();
          
          // Add a small delay before speaking
          setTimeout(async () => {
            await speakWithDelay(t('basicMultiplication.createYourOwn'), 2000);
            setTimeout(() => {
              setIsExampleMode(false);
              setExampleRow(0);
              setExampleColumn(0);
            }, 2000);
          }, 300);
        } catch (error) {
          console.error('Error in completion tutorial:', error);
        }
      };

      completeTutorial();
    }
  }, [tutorialStep, t]); // Added t dependency

  const handleExerciseComplete = async (correct: boolean) => {
    if (isExampleMode) {
      // For the tutorial example
      if (correct) {
        await speakWithDelay(t('basicMultiplication.correctAnswer'), 1500);
        setTutorialStep('complete');
      } else {
        await speakWithDelay(t('basicMultiplication.tryAgain'), 1500);
        setIsSubmitted(false);
        setIsCorrect(null);
      }
      return;
    }

    // For regular exercises
    setIsSubmitted(true);
    setIsCorrect(correct);
    
    // Update exercise count and correct count
    setExerciseCount(prev => prev + 1);
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }

    // Provide feedback based on exercise count and success rate
    if (exerciseCount + 1 === 3) {
      if (correctCount + (correct ? 1 : 0) === 3) {
        // All 3 exercises were correct
        await speakWithDelay(t('basicMultiplication.masterFeedback'), 2000);
        handleAutoProgress();
      } else {
        // Not all exercises were correct
        await speakWithDelay(t('basicMultiplication.practiceFeedback'), 2000);
        // Reset counters for the next set of 3 exercises
        setExerciseCount(0);
        setCorrectCount(0);
      }
    } else {
      // Regular feedback for individual exercises
      if (correct) {
        await speakWithDelay(t('basicMultiplication.correctFeedback'), 1500);
      } else {
        await speakWithDelay(t('basicMultiplication.incorrectFeedback'), 1500);
      }
    }
    
    // Reset submission state after a delay
    setTimeout(() => {
      setIsSubmitted(false);
      setIsCorrect(false);
    }, 1500);
  };

  return (
    <PageLayout
      title={t('onboarding.basicMultiplication.title')}
    >
      <div className="flex flex-col space-y-4">
        <MultiplicationExercise
          conceptType="singleDigit"
          onComplete={handleExerciseComplete}
          tutorialStep={tutorialStep}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          exampleRow={exampleRow}
          exampleColumn={exampleColumn}
        />
      </div>
    </PageLayout>
  );
};

export default BasicMultiplication; 