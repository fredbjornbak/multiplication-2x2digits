
import { useEffect } from 'react';
import BoxMethod3DExercise from '@/components/BoxMethod3DExercise';
import PageLayout from '@/components/PageLayout';
import { useTts } from '@/contexts/TtsContext';
import { useTranslation } from 'react-i18next';

const BoxMethodMultiplication = () => {
  const { speak, stopSpeaking } = useTts();
  const { t } = useTranslation();

  // Clean up any ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleExerciseComplete = () => {
    speak(t('boxMethodMultiplication.exerciseComplete'));
  };

  return (
    <PageLayout
      title={t('onboarding.boxMethod.title')}
    >
      <div className="flex flex-col">
        <div className="flex-1">
          <BoxMethod3DExercise
            onComplete={handleExerciseComplete}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default BoxMethodMultiplication;
