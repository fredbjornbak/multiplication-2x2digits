import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FontToggle from '@/components/FontToggle';
import { usePreferencesStore } from '@/store/preferencesStore';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  showNextButton?: boolean;
  onNextClick?: () => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  showNextButton = false,
  onNextClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences, setFontFamily } = usePreferencesStore();

  const handleBackClick = () => {
    if (location.pathname === '/box') {
      navigate('/');
    } else if (location.pathname === '/') {
      // Already on dashboard, no need to navigate
      return;
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex-none p-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-4xl font-bold text-[#1A1F2C]">{title}</h1>
          <div className="ml-auto">
            <FontToggle 
              fontFamily={preferences.fontFamily} 
              onFontChange={setFontFamily}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          {children}
          
          {showNextButton && onNextClick && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={onNextClick}
                className="px-8 py-2" 
                variant="default"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PageLayout; 