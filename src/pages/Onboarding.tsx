
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Box, Calculator, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ApiKeyInput from '@/components/ApiKeyInput';
import { useTts } from '@/contexts/TtsContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [soundStarted, setSoundStarted] = useState(false);
  const { t, i18n } = useTranslation();
  const { speak, isSpeaking } = useTts();
  const [apiKeyConfigured] = useLocalStorage<string>('openai-api-key', '');

  const steps = [
    {
      title: t('onboarding.welcome.title'),
      description: t('onboarding.welcome.description'),
      icon: Sparkles
    },
    {
      title: t('onboarding.apiSetup.title', 'Configure OpenAI API'),
      description: t('onboarding.apiSetup.description', 'Set up your API key to enable speech and AI features'),
      icon: Box
    },
    {
      title: t('onboarding.soundCheck.title', 'Sound Check'),
      description: t('onboarding.soundCheck.description', 'Test your audio to ensure you can hear the AI tutor'),
      icon: Box
    }
  ];

  const handleNext = () => {
    if (apiKeyConfigured) {
      setCurrentStep(2); // Skip API step if key is configured
    } else {
      setCurrentStep(1); // Go to API step if key is not configured
    }
  };

  const handleApiContinue = () => {
    setCurrentStep(2);
  };

  const handleSoundCheck = async () => {
    setSoundStarted(true);
    const welcomeMessage = i18n.language === 'da' 
      ? "Hej, jeg er Aidly, din altid tilgængelige tutor. Jeg vil guide dig gennem din læringsrejse, så du altid har en følgesvend med dig, når du har brug for det. Lad os lære sammen!"
      : "Hi, I am Aidly, your always available tutor. I will guide you throughout your learning journey, so you can always have a companion with you when needed. Let's learn together!";
    try {
      await speak(welcomeMessage);
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ApiKeyInput compact />
        <LanguageSwitcher />
      </div>
      <div className="p-8 w-full max-w-2xl">
        <Card className="w-full">
          {currentStep === 0 && (
            <>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-center text-3xl">
                  {t('onboarding.welcome.title')}
                </CardTitle>
                <CardDescription className="text-center text-lg">
                  {t('onboarding.welcome.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button 
                  size="lg"
                  onClick={handleNext}
                >
                  {t('onboarding.welcome.startButton')}
                </Button>
              </CardContent>
            </>
          )}

          {currentStep === 1 && (
            <>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Box className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-center text-3xl">
                  {t('onboarding.apiSetup.title', 'Configure OpenAI API')}
                </CardTitle>
                <CardDescription className="text-center text-lg">
                  {t('onboarding.apiSetup.description', 'Set up your API key to enable speech and AI features')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="w-full max-w-md">
                  <ApiKeyInput onSave={handleApiContinue} />
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleApiContinue}
                >
                  {t('common.skip', 'Skip for now')}
                </Button>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className={`sound-wave ${soundStarted ? '' : 'opacity-30'}`}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                </div>
                <CardTitle className="text-center text-3xl">
                  {t('soundCheck.title')}
                </CardTitle>
                <CardDescription className="text-center text-lg">
                  {t('soundCheck.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                {!soundStarted ? (
                  <Button size="lg" onClick={handleSoundCheck}>
                    {t('soundCheck.title')}
                  </Button>
                ) : (
                  <Button size="lg" onClick={handleContinue} disabled={isSpeaking}>
                    {t('onboarding.welcome.startButton')}
                  </Button>
                )}
              </CardContent>
              <CardFooter className="justify-center">
                {!apiKeyConfigured && (
                  <div className="text-center text-sm text-amber-600">
                    <p>No API key configured. Sound may not work.</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setCurrentStep(1)}
                    >
                      Add API key
                    </Button>
                  </div>
                )}
              </CardFooter>
            </>
          )}
        </Card>
      </div>
      <style>{`
        .sound-wave {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 40px;
        }
        .bar {
          width: 4px;
          height: 100%;
          background-color: #16a34a;
          border-radius: 4px;
          animation: sound 0.5s ease-in-out infinite;
        }
        .bar:nth-child(1) { animation-delay: 0.0s; }
        .bar:nth-child(2) { animation-delay: 0.1s; }
        .bar:nth-child(3) { animation-delay: 0.2s; }
        .bar:nth-child(4) { animation-delay: 0.3s; }
        .bar:nth-child(5) { animation-delay: 0.4s; }
        @keyframes sound {
          0% { height: 5px; }
          50% { height: 40px; }
          100% { height: 5px; }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
