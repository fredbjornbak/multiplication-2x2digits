
import { UserModel } from '@/store/userStore';

export interface BoxMethodProblem {
  problem: string;
  type: string;
  sustainabilityTheme: string;
  story: string;
  boxMethodExplanation: string;
  visualSuggestion: string;
}

// Function to generate Box Method problems with sustainability themes
export const getBoxMethodProblems = (interests: string[]): BoxMethodProblem[] => {
  // Default Box Method problems
  const defaultProblems: BoxMethodProblem[] = [
    {
      problem: "6 × 7",
      type: "1x1",
      sustainabilityTheme: "Tree Planting",
      story: "We are planting trees in a local park. Each row has 6 trees, and there are 7 rows. How many trees are we planting in total?",
      boxMethodExplanation: "We use the Box Method by placing 6 and 7 in the grid. Multiply and add to find the total trees.",
      visualSuggestion: "Show rows of trees in boxes with a multiplication grid overlay."
    },
    {
      problem: "8 × 14",
      type: "1x2",
      sustainabilityTheme: "Solar Panels",
      story: "Each solar panel array has 14 panels, and we need 8 arrays to power a school. How many solar panels do we need?",
      boxMethodExplanation: "Break 14 into 10 and 4. Multiply 8×10 and 8×4, then add the results using the Box Method.",
      visualSuggestion: "Show solar panels arranged in 10s and 4s with Box Method grid lines."
    },
    {
      problem: "23 × 17",
      type: "2x2",
      sustainabilityTheme: "Water Conservation",
      story: "A smart water system tracks 23 liters used daily in one zone, and there are 17 zones. How much water is used in a day?",
      boxMethodExplanation: "Break the numbers into tens and ones (20+3 and 10+7). Multiply each pair and add them using the Box Method.",
      visualSuggestion: "Visualize water pipes or zones with a 2×2 Box Method grid labeled by place value."
    }
  ];
  
  // Enhanced problem sets by interest
  const problemsByInterest: Record<string, BoxMethodProblem[]> = {
    "forests": [
      {
        problem: "5 × 9",
        type: "1x1",
        sustainabilityTheme: "Forest Restoration",
        story: "We need to plant 5 different types of trees in 9 different areas of a forest. How many total tree plantings will we do?",
        boxMethodExplanation: "Create a box with 5 rows and 9 columns. Count all the cells to find the total plantings.",
        visualSuggestion: "Show a forest grid with different tree types in rows and planting areas in columns."
      },
      {
        problem: "7 × 12",
        type: "1x2",
        sustainabilityTheme: "Habitat Protection",
        story: "Each forest area needs 7 bird nesting boxes. We are protecting 12 areas. How many nesting boxes will we place?",
        boxMethodExplanation: "Break 12 into 10+2. Multiply 7×10=70 and 7×2=14. Then add 70+14=84 using the Box Method.",
        visualSuggestion: "Show a forest with bird nesting boxes arranged in groups of 10 and 2."
      },
      {
        problem: "24 × 16",
        type: "2x2",
        sustainabilityTheme: "Carbon Sequestration",
        story: "Each mature tree absorbs about 24 kg of carbon dioxide each year. If we plant 16 trees, how much carbon dioxide will they absorb yearly?",
        boxMethodExplanation: "Break into 20+4 and 10+6. Multiply 20×10=200, 20×6=120, 4×10=40, and 4×6=24. Add all results: 200+120+40+24=384.",
        visualSuggestion: "Show trees with carbon bubbles in a 2×2 Box Method grid labeled by place value."
      }
    ],
    "renewable energy": [
      {
        problem: "4 × 8",
        type: "1x1",
        sustainabilityTheme: "Wind Energy",
        story: "A small wind farm has 4 rows of wind turbines with 8 turbines in each row. How many wind turbines are there in total?",
        boxMethodExplanation: "Make a box with 4 rows and 8 columns. Count all the cells to find the total number of turbines.",
        visualSuggestion: "Show wind turbines arranged in rows and columns with a grid overlay."
      },
      {
        problem: "9 × 15",
        type: "1x2",
        sustainabilityTheme: "Solar Energy",
        story: "Each house in our eco-village has 15 solar panels. We're building 9 new houses. How many solar panels will we need?",
        boxMethodExplanation: "Break 15 into 10+5. Multiply 9×10=90 and 9×5=45. Add 90+45=135 using the Box Method.",
        visualSuggestion: "Show houses with solar panels grouped in 10s and 5s with a Box Method grid."
      },
      {
        problem: "38 × 12",
        type: "2x2",
        sustainabilityTheme: "Energy Production",
        story: "Each solar panel produces about 38 watts of power. If we install 12 panels, how many watts of power will they generate?",
        boxMethodExplanation: "Break into 30+8 and 10+2. Multiply 30×10=300, 30×2=60, 8×10=80, and 8×2=16. Add all: 300+60+80+16=456.",
        visualSuggestion: "Show solar panels with power output in a 2×2 Box Method grid with place values labeled."
      }
    ],
    "wildlife conservation": [
      {
        problem: "3 × 6",
        type: "1x1",
        sustainabilityTheme: "Wildlife Monitoring",
        story: "Rangers set up 3 wildlife camera traps in each of 6 different habitats. How many camera traps are there in total?",
        boxMethodExplanation: "Create a box with 3 rows and 6 columns. Count all the cells to find the total number of camera traps.",
        visualSuggestion: "Show camera traps in different habitats with a multiplication grid overlay."
      },
      {
        problem: "6 × 13",
        type: "1x2",
        sustainabilityTheme: "Bird Conservation",
        story: "We're creating bird sanctuaries with 13 nest boxes in each. If we build 6 sanctuaries, how many nest boxes will we place?",
        boxMethodExplanation: "Break 13 into 10+3. Multiply 6×10=60 and 6×3=18. Add 60+18=78 using the Box Method.",
        visualSuggestion: "Show bird sanctuaries with nest boxes grouped in 10s and 3s with a Box Method overlay."
      },
      {
        problem: "27 × 14",
        type: "2x2",
        sustainabilityTheme: "Habitat Restoration",
        story: "Each wildlife corridor needs 27 native plants. If we create 14 corridors, how many native plants will we need?",
        boxMethodExplanation: "Break into 20+7 and 10+4. Multiply 20×10=200, 20×4=80, 7×10=70, and 7×4=28. Add all: 200+80+70+28=378.",
        visualSuggestion: "Show wildlife corridors with plants arranged in a 2×2 Box Method grid with place values labeled."
      }
    ]
  };
  
  // Look for user interests that match our problem sets
  for (const interest of interests) {
    if (problemsByInterest[interest]) {
      return problemsByInterest[interest];
    }
  }
  
  // If no matching interests, return default problems
  return defaultProblems;
};
