import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from 'react-i18next';
import { useTts } from '@/contexts/TtsContext';

const MainScreen = () => {
  const navigate = useNavigate();
  const { speak, stopSpeaking } = useTts();
  const { t } = useTranslation();
  const hasSpokenWelcome = useRef(false);

  useEffect(() => {
    // Only show welcome message once per component mount
    if (!hasSpokenWelcome.current) {
      // Set the flag immediately to prevent double activation
      hasSpokenWelcome.current = true;
      
      // Small delay to prevent race conditions with other components
      const timer = setTimeout(() => {
        speak(t('aiTutor.speech.welcome'));
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    }
    
    // Clean up any ongoing speech when component unmounts
    return () => {
      stopSpeaking();
    };
  }, [t]); // Removed 'speak' from dependencies to prevent re-renders

  return (
    <PageLayout
      title={t('mainPage.welcomeTitle')}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              {t('mainPage.exercises.multiplication.title')}
            </CardTitle>
            <CardDescription>
              {t('mainPage.exercises.multiplication.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/basic')}
            >
              {t('mainPage.exercises.multiplication.startButton')}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-6 w-6" />
              {t('mainPage.exercises.boxMethod.title')}
            </CardTitle>
            <CardDescription>
              {t('mainPage.exercises.boxMethod.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/box')}
            >
              {t('mainPage.exercises.boxMethod.startButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MainScreen; 