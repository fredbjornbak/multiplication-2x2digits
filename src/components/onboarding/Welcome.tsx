import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Leaf, BookOpen, Brain } from "lucide-react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useTranslation } from 'react-i18next';

interface WelcomeProps {
  onNext: () => void;
}

const Welcome = ({ onNext }: WelcomeProps) => {
  const { completeOnboarding } = useOnboardingStore();
  const { t } = useTranslation();
  
  const handleStart = () => {
    // Complete onboarding with default values
    completeOnboarding({
      name: "Learner",
      subject: "Mathematics",
      topic: "Multiplication"
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-eco-forest animate-fade-in">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-eco-forest/10 flex items-center justify-center">
            <Leaf className="h-14 w-14 text-eco-forest" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-eco-forest">{t('onboarding.welcome.title')}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <CardDescription className="text-lg">
          {t('onboarding.welcome.description')}
        </CardDescription>
        <div className="flex items-center justify-center gap-2 mb-4 text-eco-forest">
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Learn at your own pace</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-4 text-eco-forest">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
            <path d="M9.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"></path>
            <path d="M14.5 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"></path>
            <path d="M3 7v9a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6V7"></path>
            <path d="M13 7h2s1-6 6-6-6 6-5 8 4 2 4 6v11"></path>
            <path d="M11 7H9s-1-6-6-6 6 6 5 8-4 2-4 6v11"></path>
          </svg>
          <span className="font-medium">Adaptive learning technology</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-eco-forest">
          <Leaf className="h-5 w-5" />
          <span className="font-medium">Fun themes to keep you engaged</span>
        </div>
        <Button 
          size="lg" 
          className="w-full"
          onClick={() => {
            handleStart();
            onNext();
          }}
        >
          {t('onboarding.welcome.startButton')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Welcome;
