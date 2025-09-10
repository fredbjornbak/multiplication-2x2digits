import { useNavigate } from 'react-router-dom';
import BoxMethodIntro2 from '@/components/BoxMethodIntro2';
import PageLayout from '@/components/PageLayout';

const BoxMethodIntro2Page = () => {
  const navigate = useNavigate();

  const handleIntroComplete = () => {
    navigate('/tutorial');
  };

  return (
    <PageLayout title="📊">
      <BoxMethodIntro2 onComplete={handleIntroComplete} />
    </PageLayout>
  );
};

export default BoxMethodIntro2Page;