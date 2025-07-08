import { Exercise, UserModel } from '@/store/userStore';

export const calculateDifficulty = (userModel: UserModel, conceptType: string): number => {
  let baseDifficulty = 0;
  
  switch (conceptType) {
    case 'singleDigit':
      baseDifficulty = userModel.multiplicationFluency.singleDigit * 10;
      break;
    case 'doubleDigitSingle':
      baseDifficulty = userModel.multiplicationFluency.doubleDigitSingle * 10;
      break;
    case 'doubleDigitDouble':
      baseDifficulty = userModel.multiplicationFluency.doubleDigitDouble * 10;
      break;
    default:
      baseDifficulty = 5;
  }
  
  // Adjust difficulty based on cognitive parameters
  const cognitiveModifier = (userModel.workingMemory / 10) * 2;
  
  return Math.min(10, Math.max(1, baseDifficulty + cognitiveModifier));
};

export const calculateTimeFactor = (timeSpent: number): number => {
  // Faster responses (within reasonable limits) get a higher bonus
  if (timeSpent < 10) {
    return 0.05;
  } else if (timeSpent < 20) {
    return 0.03;
  } else if (timeSpent < 30) {
    return 0.01;
  } else {
    return 0;
  }
};

export const adjustDifficulty = (
  userModel: UserModel,
  exerciseResult: Exercise
): { updatedModel: UserModel; nextConcept: string } => {
  // Make a deep copy of the user model to avoid direct state mutation
  const updatedModel = JSON.parse(JSON.stringify(userModel)) as UserModel;
  
  // Base factors
  const successFactor = exerciseResult.success ? 0.1 : -0.05;
  const attemptFactor = Math.max(0, (3 - exerciseResult.attempts) * 0.03);
  const timeFactor = calculateTimeFactor(exerciseResult.timeSpent);
  
  let nextConcept = exerciseResult.problemType;
  
  // Concept-specific adjustment
  switch (exerciseResult.problemType) {
    case 'singleDigit':
      updatedModel.multiplicationFluency.singleDigit += successFactor + attemptFactor + timeFactor;
      // Once mastery reaches threshold, introduce next concept with new sustainability theme
      if (updatedModel.multiplicationFluency.singleDigit > 0.8) {
        // Progress from small garden plots to larger solar farm calculations
        nextConcept = 'doubleDigitSingle';
      }
      break;
    case 'doubleDigitSingle':
      updatedModel.multiplicationFluency.doubleDigitSingle += successFactor + attemptFactor + timeFactor;
      if (updatedModel.multiplicationFluency.doubleDigitSingle > 0.7) {
        // Progress from simple solar arrays to complete renewable energy systems
        nextConcept = 'doubleDigitDouble';
      }
      break;
    case 'doubleDigitDouble':
      updatedModel.multiplicationFluency.doubleDigitDouble += successFactor + attemptFactor + timeFactor;
      break;
    // Additional cases could be added here
  }
  
  // Cap values between 0-1
  updatedModel.multiplicationFluency.singleDigit = Math.min(
    1,
    Math.max(0, updatedModel.multiplicationFluency.singleDigit)
  );
  updatedModel.multiplicationFluency.doubleDigitSingle = Math.min(
    1,
    Math.max(0, updatedModel.multiplicationFluency.doubleDigitSingle)
  );
  updatedModel.multiplicationFluency.doubleDigitDouble = Math.min(
    1,
    Math.max(0, updatedModel.multiplicationFluency.doubleDigitDouble)
  );
  
  return { updatedModel, nextConcept };
};

export const generateProblem = (difficulty: number, conceptType: string): { 
  problem: string;
  firstFactor: number;
  secondFactor: number;
} => {
  let firstFactor: number;
  let secondFactor: number;
  
  switch (conceptType) {
    case 'singleDigit':
      // Generate single-digit multiplication problems (1-9 × 1-9)
      firstFactor = Math.floor(Math.random() * 9) + 1;
      secondFactor = Math.floor(Math.random() * 9) + 1;
      break;
    
    case 'doubleDigitSingle':
      // Generate double-digit × single-digit problems (10-99 × 1-9)
      firstFactor = Math.floor(Math.random() * 90) + 10;
      secondFactor = Math.floor(Math.random() * 9) + 1;
      break;
    
    case 'doubleDigitDouble':
      // Generate double-digit × double-digit problems (10-99 × 10-99)
      // Adjust the range based on difficulty
      const max = Math.min(99, Math.max(10, Math.floor(10 + (difficulty * 8))));
      firstFactor = Math.floor(Math.random() * (max - 10 + 1)) + 10;
      secondFactor = Math.floor(Math.random() * (max - 10 + 1)) + 10;
      break;
    
    default:
      firstFactor = Math.floor(Math.random() * 9) + 1;
      secondFactor = Math.floor(Math.random() * 9) + 1;
  }
  
  return {
    problem: `${firstFactor} × ${secondFactor}`,
    firstFactor,
    secondFactor
  };
};

export const getSustainabilityContext = (
  problemType: string,
  interests: string[] = []
): { theme: string; story: string } => {
  // Default theme map for all problem types
  const defaultThemeMap = {
    forests: {
      theme: 'Forest Conservation',
      story: 'Let\'s help protect our forests by calculating the total area of different forest sections.'
    }
  };

  // Get a random interest or default to 'forests'
  const randomInterest = interests.length > 0 
    ? interests[Math.floor(Math.random() * interests.length)]
    : 'forests';

  // Try to get the theme map for the problem type, fallback to default
  const themeMap = {
    singleDigit: {
      forests: {
        theme: 'Tree Planting',
        story: 'We\'re planting trees in a grid pattern. Each row has the same number of trees. How many trees total?'
      },
      'wildlife conservation': {
        theme: 'Animal Habitats',
        story: 'We\'re creating habitats for animals. Each habitat needs multiple zones. How many zones total?'
      }
    },
    doubleDigitSingle: {
      forests: {
        theme: 'Forest Sections',
        story: 'We\'re dividing the forest into sections. Each section has multiple areas. Total areas?'
      },
      'wildlife conservation': {
        theme: 'Conservation Zones',
        story: 'We\'re setting up conservation zones. Each zone has multiple protected areas. Total areas?'
      }
    },
    doubleDigitDouble: {
      forests: {
        theme: 'Large Forest Project',
        story: 'We\'re planning a large forest restoration project. Multiple sections, each with multiple areas. Total areas?'
      },
      'wildlife conservation': {
        theme: 'Conservation Network',
        story: 'We\'re connecting wildlife habitats into a conservation network. We need multiple sanctuaries, each with multiple zones. Total areas?'
      }
    }
  };

  // Get the theme map for the current problem type or use default
  const currentThemeMap = themeMap[problemType as keyof typeof themeMap] || defaultThemeMap;
  
  // Get the theme for the interest or default to forests
  const interestThemes = currentThemeMap[randomInterest as keyof typeof currentThemeMap] || currentThemeMap.forests;
  
  return interestThemes;
};
