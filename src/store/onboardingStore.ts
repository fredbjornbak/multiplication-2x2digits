
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  completed: boolean;
  userName: string;
  selectedSubject: string;
  selectedTopic: string;
  
  completeOnboarding: (userData: {
    name: string;
    subject: string;
    topic: string;
  }) => void;
  
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      userName: '',
      selectedSubject: '',
      selectedTopic: '',
      
      completeOnboarding: (userData) => set({
        completed: true,
        userName: userData.name,
        selectedSubject: userData.subject,
        selectedTopic: userData.topic
      }),
      
      resetOnboarding: () => set({
        completed: false,
        userName: '',
        selectedSubject: '',
        selectedTopic: ''
      })
    }),
    {
      name: 'gradeaid-onboarding'
    }
  )
);
