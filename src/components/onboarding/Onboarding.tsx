
import { useState } from "react";
import Welcome from "./Welcome";
import NameInput from "./NameInput";
import SubjectSelection from "./SubjectSelection";
import TopicSelection from "./TopicSelection";

interface OnboardingProps {
  onComplete: (userData: {
    name: string;
    subject: string;
    topic: string;
  }) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    subject: "",
    topic: "",
  });

  const handleNameSubmit = (name: string) => {
    setUserData({ ...userData, name });
    setStep(2);
  };

  const handleSubjectSelect = (subject: string) => {
    setUserData({ ...userData, subject });
    setStep(3);
  };

  const handleTopicSelect = (topic: string) => {
    const updatedUserData = { ...userData, topic };
    setUserData(updatedUserData);
    onComplete(updatedUserData);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Welcome onNext={() => setStep(1)} />;
      case 1:
        return <NameInput onNext={handleNameSubmit} onBack={() => setStep(0)} />;
      case 2:
        return (
          <SubjectSelection 
            userName={userData.name} 
            onSelect={handleSubjectSelect} 
            onBack={() => setStep(1)} 
          />
        );
      case 3:
        return (
          <TopicSelection 
            subject={userData.subject} 
            onSelect={handleTopicSelect} 
            onBack={() => setStep(2)} 
          />
        );
      default:
        return <Welcome onNext={() => setStep(1)} />;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full">{renderStep()}</div>
    </div>
  );
};

export default Onboarding;
