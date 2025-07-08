import { useNavigate } from 'react-router-dom';
import BoxMethodIntro from '@/components/BoxMethodIntro';
import PageLayout from '@/components/PageLayout';

const BoxMethodIntroPage = () => {
  const navigate = useNavigate();

  const handleIntroComplete = () => {
    navigate('/box');
  };

  return (
    <PageLayout title="📊">
      <BoxMethodIntro onComplete={handleIntroComplete} />
    </PageLayout>
  );
};

export default BoxMethodIntroPage;