
import BoxMethod3DExercise from '@/components/BoxMethod3DExercise';
import PageLayout from '@/components/PageLayout';

const BoxMethodMultiplication = () => {
  const handleExerciseComplete = () => {
    // Exercise completed - could show options to continue or navigate elsewhere
    console.log('🎉 Exercise completed! All 8 problems solved!');
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
