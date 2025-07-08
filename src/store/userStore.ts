
import { create } from 'zustand';

export interface Exercise {
  problemType: string;
  sustainabilityTheme: string;
  attempts: number;
  timeSpent: number;
  success: boolean;
  date: string;
}

export interface UserModel {
  // Core learning parameters
  multiplicationFluency: {
    singleDigit: number; // 0-1 proficiency score
    doubleDigitSingle: number;
    doubleDigitDouble: number;
  };
  
  // Cognitive parameters
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
  attentionSpan: number; // 1-10 scale
  workingMemory: number; // 1-10 scale
  
  // Engagement parameters
  sustainabilityInterests: string[];
  frustrationThreshold: number; // 1-10 scale
  preferredEcoCharacters: string[];
  
  // Historical data
  previousExercises: Exercise[];
}

interface UserStore {
  userModel: UserModel;
  updateFluency: (category: keyof UserModel['multiplicationFluency'], value: number) => void;
  updateLearningStyle: (style: "visual" | "auditory" | "kinesthetic" | "mixed") => void;
  updateCognitiveParam: (param: 'attentionSpan' | 'workingMemory', value: number) => void;
  addSustainabilityInterest: (interest: string) => void;
  removeSustainabilityInterest: (interest: string) => void;
  updateFrustrationThreshold: (value: number) => void;
  addEcoCharacter: (character: string) => void;
  removeEcoCharacter: (character: string) => void;
  addExercise: (exercise: Exercise) => void;
  resetUserModel: () => void;
}

// Initial user model with default values
const initialUserModel: UserModel = {
  multiplicationFluency: {
    singleDigit: 0.3,
    doubleDigitSingle: 0.1,
    doubleDigitDouble: 0,
  },
  learningStyle: "visual",
  attentionSpan: 5,
  workingMemory: 5,
  sustainabilityInterests: ["forests", "renewable energy", "wildlife conservation"],
  frustrationThreshold: 5,
  preferredEcoCharacters: ["tree", "solar panel", "water droplet"],
  previousExercises: [],
};

export const useUserStore = create<UserStore>((set) => ({
  userModel: initialUserModel,
  
  updateFluency: (category, value) => set((state) => ({
    userModel: {
      ...state.userModel,
      multiplicationFluency: {
        ...state.userModel.multiplicationFluency,
        [category]: value,
      },
    },
  })),
  
  updateLearningStyle: (style) => set((state) => ({
    userModel: {
      ...state.userModel,
      learningStyle: style,
    },
  })),
  
  updateCognitiveParam: (param, value) => set((state) => ({
    userModel: {
      ...state.userModel,
      [param]: value,
    },
  })),
  
  addSustainabilityInterest: (interest) => set((state) => ({
    userModel: {
      ...state.userModel,
      sustainabilityInterests: [...state.userModel.sustainabilityInterests, interest],
    },
  })),
  
  removeSustainabilityInterest: (interest) => set((state) => ({
    userModel: {
      ...state.userModel,
      sustainabilityInterests: state.userModel.sustainabilityInterests.filter((i) => i !== interest),
    },
  })),
  
  updateFrustrationThreshold: (value) => set((state) => ({
    userModel: {
      ...state.userModel,
      frustrationThreshold: value,
    },
  })),
  
  addEcoCharacter: (character) => set((state) => ({
    userModel: {
      ...state.userModel,
      preferredEcoCharacters: [...state.userModel.preferredEcoCharacters, character],
    },
  })),
  
  removeEcoCharacter: (character) => set((state) => ({
    userModel: {
      ...state.userModel,
      preferredEcoCharacters: state.userModel.preferredEcoCharacters.filter((c) => c !== character),
    },
  })),
  
  addExercise: (exercise) => set((state) => ({
    userModel: {
      ...state.userModel,
      previousExercises: [...state.userModel.previousExercises, exercise],
    },
  })),
  
  resetUserModel: () => set({ userModel: initialUserModel }),
}));
