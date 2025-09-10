import { useNavigate } from 'react-router-dom';
import InteractiveTutorial from '@/components/InteractiveTutorial';
import PageLayout from '@/components/PageLayout';

const InteractiveTutorialPage = () => {
  const navigate = useNavigate();

  const handleTutorialComplete = () => {
    navigate('/box');
  };

  return (
    <PageLayout title="📚">
      <InteractiveTutorial onComplete={handleTutorialComplete} />
    </PageLayout>
  );
};

export default InteractiveTutorialPage;