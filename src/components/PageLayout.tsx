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
  const {
    preferences,
    setFontFamily
  } = usePreferencesStore();
  const handleBackClick = () => {
    if (location.pathname === '/') {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };
  return <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex-none p-1 lg:p-2 border-b-2 border-border bg-background">
        <div className="max-w-7xl mx-auto flex items-center gap-2 lg:gap-4">
          {location.pathname !== '/' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackClick}
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4" />
              Back to Tutorial
            </Button>
          )}
          
          <h1 className="text-lg lg:text-2xl font-heading font-bold text-foreground">{title}</h1>
          
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-1 lg:p-2 bg-background">
        <div className="max-w-4xl mx-auto h-full">
          {children}
          
          {showNextButton && onNextClick && <div className="mt-8 flex justify-center">
              <Button onClick={onNextClick} size="lg" variant="default">
                Next
              </Button>
            </div>}
        </div>
      </main>
    </div>;
};
export default PageLayout;