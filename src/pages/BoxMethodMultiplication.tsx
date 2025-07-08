
import { useEffect } from 'react';
import BoxMethod3DExercise from '@/components/BoxMethod3DExercise';
import PageLayout from '@/components/PageLayout';
import { useTts } from '@/contexts/TtsContext';

const BoxMethodMultiplication = () => {
  const { speak, stopSpeaking } = useTts();

  // Clean up any ongoing speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleExerciseComplete = () => {
    speak('Great work! You have mastered the box method! Would you like to try another exercise?');
  };

  return (
    <PageLayout
      title="3D Box Method"
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
