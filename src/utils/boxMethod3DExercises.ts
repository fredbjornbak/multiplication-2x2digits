export interface BoxMethodProblem3D {
  id: number;
  problem: string;
  context: string;
  difficulty: 'easy' | 'medium' | 'hard';
  placeValueDecomposition: {
    firstNumber: number[];
    secondNumber: number[];
  };
  boxGrid: {
    rowLabel: string;
    columnLabel: string;
    product: number;
  }[];
  sumStep: {
    individualProducts: number[];
    total: number;
  };
  threeJSRepresentation: {
    gridLayout: string;
    interactiveTiles: boolean;
    tileColorCoding: string;
    axisLabels: {
      x: string[];
      y: string[];
    };
    sumDisplay: string;
    animations: string;
    diagonalHighlight: boolean;
  };
}

export const getBoxMethod3DProblems = (): BoxMethodProblem3D[] => {
  return [
    // First exercise: 2 × 10 (very simple)
    {
      id: 1,
      problem: "2 × 10",
      context: "A classroom has 2 rows of desks with 10 students in each row. How many students are in the classroom?",
      difficulty: 'easy',
      placeValueDecomposition: {
        firstNumber: [2],
        secondNumber: [10]
      },
      boxGrid: [
        { rowLabel: "2", columnLabel: "10", product: 20 }
      ],
      sumStep: {
        individualProducts: [20],
        total: 20
      },
      threeJSRepresentation: {
        gridLayout: "1x1",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["10"], y: ["2"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    // Second exercise: 3 × 12 (single digit × teens)
    {
      id: 2,
      problem: "3 × 12",
      context: "A recycling center processes 3 batches of materials, with each batch containing 12 items. How many items are processed in total?",
      difficulty: 'easy',
      placeValueDecomposition: {
        firstNumber: [3],
        secondNumber: [10, 2]
      },
      boxGrid: [
        { rowLabel: "3", columnLabel: "10", product: 30 },
        { rowLabel: "3", columnLabel: "2", product: 6 }
      ],
      sumStep: {
        individualProducts: [30, 6],
        total: 36
      },
      threeJSRepresentation: {
        gridLayout: "1x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["10", "2"], y: ["3"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    // Easy level problems (1-digit × 2-digit)
    {
      id: 3,
      problem: "6 × 24",
      context: "A classroom has 6 rows of desks with 24 students in each row. How many students are in the classroom?",
      difficulty: 'easy',
      placeValueDecomposition: {
        firstNumber: [6],
        secondNumber: [20, 4]
      },
      boxGrid: [
        { rowLabel: "6", columnLabel: "20", product: 120 },
        { rowLabel: "6", columnLabel: "4", product: 24 }
      ],
      sumStep: {
        individualProducts: [120, 24],
        total: 144
      },
      threeJSRepresentation: {
        gridLayout: "1x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["20", "4"], y: ["6"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 4,
      problem: "8 × 15",
      context: "A solar energy project installs 8 solar panels, each generating 15 watts of power. How many watts can they generate in total?",
      difficulty: 'easy',
      placeValueDecomposition: {
        firstNumber: [8],
        secondNumber: [10, 5]
      },
      boxGrid: [
        { rowLabel: "8", columnLabel: "10", product: 80 },
        { rowLabel: "8", columnLabel: "5", product: 40 }
      ],
      sumStep: {
        individualProducts: [80, 40],
        total: 120
      },
      threeJSRepresentation: {
        gridLayout: "1x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["10", "5"], y: ["8"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    // Medium level problems (teens × 2-digit)
    {
      id: 5,
      problem: "12 × 23",
      context: "A wind farm has 12 turbines, each producing 23 kilowatts of clean energy. What is the total energy output?",
      difficulty: 'medium',
      placeValueDecomposition: {
        firstNumber: [10, 2],
        secondNumber: [20, 3]
      },
      boxGrid: [
        { rowLabel: "10", columnLabel: "20", product: 200 },
        { rowLabel: "10", columnLabel: "3", product: 30 },
        { rowLabel: "2", columnLabel: "20", product: 40 },
        { rowLabel: "2", columnLabel: "3", product: 6 }
      ],
      sumStep: {
        individualProducts: [200, 30, 40, 6],
        total: 276
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["20", "3"], y: ["10", "2"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    // Medium level problems (2-digit × 2-digit)
    {
      id: 6,
      problem: "24 × 36",
      context: "We have 24 rows with 36 panels in each row. How many panels are there in total?",
      difficulty: 'medium',
      placeValueDecomposition: {
        firstNumber: [20, 4],
        secondNumber: [30, 6]
      },
      boxGrid: [
        { rowLabel: "20", columnLabel: "30", product: 600 },
        { rowLabel: "20", columnLabel: "6", product: 120 },
        { rowLabel: "4", columnLabel: "30", product: 120 },
        { rowLabel: "4", columnLabel: "6", product: 24 }
      ],
      sumStep: {
        individualProducts: [600, 120, 120, 24],
        total: 864
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["30", "6"], y: ["20", "4"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    // Hard level problems (2-digit × 2-digit with larger numbers)
    {
      id: 7,
      problem: "32 × 45",
      context: "Water conservation: Our town saved 32 liters of water per household across 45 households. How many liters of water did we save in total?",
      difficulty: 'hard',
      placeValueDecomposition: {
        firstNumber: [30, 2],
        secondNumber: [40, 5]
      },
      boxGrid: [
        { rowLabel: "30", columnLabel: "40", product: 1200 },
        { rowLabel: "30", columnLabel: "5", product: 150 },
        { rowLabel: "2", columnLabel: "40", product: 80 },
        { rowLabel: "2", columnLabel: "5", product: 10 }
      ],
      sumStep: {
        individualProducts: [1200, 150, 80, 10],
        total: 1440
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["40", "5"], y: ["30", "2"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    // Advanced level problems (challenging 2-digit × 2-digit)
    {
      id: 8,
      problem: "47 × 58",
      context: "Carbon offset: A forest restoration project plants 47 trees per section across 58 sections. How many trees are planted to offset carbon emissions?",
      difficulty: 'hard',
      placeValueDecomposition: {
        firstNumber: [40, 7],
        secondNumber: [50, 8]
      },
      boxGrid: [
        { rowLabel: "40", columnLabel: "50", product: 2000 },
        { rowLabel: "40", columnLabel: "8", product: 320 },
        { rowLabel: "7", columnLabel: "50", product: 350 },
        { rowLabel: "7", columnLabel: "8", product: 56 }
      ],
      sumStep: {
        individualProducts: [2000, 320, 350, 56],
        total: 2726
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["50", "8"], y: ["40", "7"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    }
  ];
};
