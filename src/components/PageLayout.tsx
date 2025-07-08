import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TtsSpeechBubble from '@/components/TtsSpeechBubble';
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
    if (location.pathname === '/') {
      navigate('/onboarding');
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
      <div className="flex-1 flex overflow-hidden">
        {/* Exercise Content */}
        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>

        {/* AI Tutor Sidebar */}
        <aside className="w-80 border-l flex-none">
          <TtsSpeechBubble className="h-full" />
          
          {showNextButton && onNextClick && (
            <div className="p-4 border-t">
              <Button 
                onClick={onNextClick}
                className="w-full" 
                variant="default"
              >
                Next
              </Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PageLayout; 