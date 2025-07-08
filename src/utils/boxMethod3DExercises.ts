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
    // Additional easy problems for randomization
    {
      id: 9,
      problem: "4 × 13",
      context: "A community garden has 4 sections, each with 13 solar-powered LED lights. How many lights are there in total?",
      difficulty: 'easy',
      placeValueDecomposition: {
        firstNumber: [4],
        secondNumber: [10, 3]
      },
      boxGrid: [
        { rowLabel: "4", columnLabel: "10", product: 40 },
        { rowLabel: "4", columnLabel: "3", product: 12 }
      ],
      sumStep: {
        individualProducts: [40, 12],
        total: 52
      },
      threeJSRepresentation: {
        gridLayout: "1x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["10", "3"], y: ["4"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 10,
      problem: "5 × 16",
      context: "An eco-friendly office building has 5 floors, each with 16 energy-efficient windows. How many windows are there in total?",
      difficulty: 'easy',
      placeValueDecomposition: {
        firstNumber: [5],
        secondNumber: [10, 6]
      },
      boxGrid: [
        { rowLabel: "5", columnLabel: "10", product: 50 },
        { rowLabel: "5", columnLabel: "6", product: 30 }
      ],
      sumStep: {
        individualProducts: [50, 30],
        total: 80
      },
      threeJSRepresentation: {
        gridLayout: "1x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["10", "6"], y: ["5"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 11,
      problem: "7 × 14",
      context: "A sustainable farm plants 7 rows of organic vegetables, with 14 plants in each row. How many plants are there in total?",
      difficulty: 'easy',
      placeValueDecomposition: {
        firstNumber: [7],
        secondNumber: [10, 4]
      },
      boxGrid: [
        { rowLabel: "7", columnLabel: "10", product: 70 },
        { rowLabel: "7", columnLabel: "4", product: 28 }
      ],
      sumStep: {
        individualProducts: [70, 28],
        total: 98
      },
      threeJSRepresentation: {
        gridLayout: "1x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["10", "4"], y: ["7"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 12,
      problem: "9 × 11",
      context: "A green transportation hub has 9 charging stations, each capable of charging 11 electric vehicles. How many vehicles can be charged simultaneously?",
      difficulty: 'easy',
      placeValueDecomposition: {
        firstNumber: [9],
        secondNumber: [10, 1]
      },
      boxGrid: [
        { rowLabel: "9", columnLabel: "10", product: 90 },
        { rowLabel: "9", columnLabel: "1", product: 9 }
      ],
      sumStep: {
        individualProducts: [90, 9],
        total: 99
      },
      threeJSRepresentation: {
        gridLayout: "1x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["10", "1"], y: ["9"] },
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
    // Additional medium problems for randomization
    {
      id: 13,
      problem: "15 × 24",
      context: "Tree planting: A reforestation initiative plants 15 rows of saplings, with 24 trees in each row. How many trees are planted?",
      difficulty: 'medium',
      placeValueDecomposition: {
        firstNumber: [10, 5],
        secondNumber: [20, 4]
      },
      boxGrid: [
        { rowLabel: "10", columnLabel: "20", product: 200 },
        { rowLabel: "10", columnLabel: "4", product: 40 },
        { rowLabel: "5", columnLabel: "20", product: 100 },
        { rowLabel: "5", columnLabel: "4", product: 20 }
      ],
      sumStep: {
        individualProducts: [200, 40, 100, 20],
        total: 360
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["20", "4"], y: ["10", "5"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 14,
      problem: "18 × 25",
      context: "Household energy: An eco-village has 18 homes, each using 25 kilowatt-hours of renewable energy daily. What is the total daily energy consumption?",
      difficulty: 'medium',
      placeValueDecomposition: {
        firstNumber: [10, 8],
        secondNumber: [20, 5]
      },
      boxGrid: [
        { rowLabel: "10", columnLabel: "20", product: 200 },
        { rowLabel: "10", columnLabel: "5", product: 50 },
        { rowLabel: "8", columnLabel: "20", product: 160 },
        { rowLabel: "8", columnLabel: "5", product: 40 }
      ],
      sumStep: {
        individualProducts: [200, 50, 160, 40],
        total: 450
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["20", "5"], y: ["10", "8"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 15,
      problem: "16 × 27",
      context: "Solar installation: A green energy company installs 16 solar panel arrays, each containing 27 photovoltaic cells. How many cells are installed in total?",
      difficulty: 'medium',
      placeValueDecomposition: {
        firstNumber: [10, 6],
        secondNumber: [20, 7]
      },
      boxGrid: [
        { rowLabel: "10", columnLabel: "20", product: 200 },
        { rowLabel: "10", columnLabel: "7", product: 70 },
        { rowLabel: "6", columnLabel: "20", product: 120 },
        { rowLabel: "6", columnLabel: "7", product: 42 }
      ],
      sumStep: {
        individualProducts: [200, 70, 120, 42],
        total: 432
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["20", "7"], y: ["10", "6"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 16,
      problem: "14 × 32",
      context: "Water recycling: A treatment facility processes 14 batches of wastewater, with each batch containing 32 gallons. How many gallons are processed?",
      difficulty: 'medium',
      placeValueDecomposition: {
        firstNumber: [10, 4],
        secondNumber: [30, 2]
      },
      boxGrid: [
        { rowLabel: "10", columnLabel: "30", product: 300 },
        { rowLabel: "10", columnLabel: "2", product: 20 },
        { rowLabel: "4", columnLabel: "30", product: 120 },
        { rowLabel: "4", columnLabel: "2", product: 8 }
      ],
      sumStep: {
        individualProducts: [300, 20, 120, 8],
        total: 448
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["30", "2"], y: ["10", "4"] },
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
    },
    // Additional hard problems for randomization
    {
      id: 17,
      problem: "38 × 46",
      context: "Renewable grid: A smart grid network connects 38 renewable energy sources, each providing 46 megawatts of power. What is the total grid capacity?",
      difficulty: 'hard',
      placeValueDecomposition: {
        firstNumber: [30, 8],
        secondNumber: [40, 6]
      },
      boxGrid: [
        { rowLabel: "30", columnLabel: "40", product: 1200 },
        { rowLabel: "30", columnLabel: "6", product: 180 },
        { rowLabel: "8", columnLabel: "40", product: 320 },
        { rowLabel: "8", columnLabel: "6", product: 48 }
      ],
      sumStep: {
        individualProducts: [1200, 180, 320, 48],
        total: 1748
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["40", "6"], y: ["30", "8"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 18,
      problem: "43 × 57",
      context: "Forest conservation: A wildlife preserve protects 43 acres, with each acre housing 57 endangered species. How many species are protected in total?",
      difficulty: 'hard',
      placeValueDecomposition: {
        firstNumber: [40, 3],
        secondNumber: [50, 7]
      },
      boxGrid: [
        { rowLabel: "40", columnLabel: "50", product: 2000 },
        { rowLabel: "40", columnLabel: "7", product: 280 },
        { rowLabel: "3", columnLabel: "50", product: 150 },
        { rowLabel: "3", columnLabel: "7", product: 21 }
      ],
      sumStep: {
        individualProducts: [2000, 280, 150, 21],
        total: 2451
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["50", "7"], y: ["40", "3"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 19,
      problem: "35 × 49",
      context: "Ocean cleanup: A marine conservation project deploys 35 cleanup vessels, each collecting 49 tons of plastic waste. How many tons are collected?",
      difficulty: 'hard',
      placeValueDecomposition: {
        firstNumber: [30, 5],
        secondNumber: [40, 9]
      },
      boxGrid: [
        { rowLabel: "30", columnLabel: "40", product: 1200 },
        { rowLabel: "30", columnLabel: "9", product: 270 },
        { rowLabel: "5", columnLabel: "40", product: 200 },
        { rowLabel: "5", columnLabel: "9", product: 45 }
      ],
      sumStep: {
        individualProducts: [1200, 270, 200, 45],
        total: 1715
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["40", "9"], y: ["30", "5"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    },
    {
      id: 20,
      problem: "41 × 63",
      context: "Green transportation: A city installs 41 electric vehicle charging stations, each serving 63 vehicles per day. How many vehicle charges occur daily?",
      difficulty: 'hard',
      placeValueDecomposition: {
        firstNumber: [40, 1],
        secondNumber: [60, 3]
      },
      boxGrid: [
        { rowLabel: "40", columnLabel: "60", product: 2400 },
        { rowLabel: "40", columnLabel: "3", product: 120 },
        { rowLabel: "1", columnLabel: "60", product: 60 },
        { rowLabel: "1", columnLabel: "3", product: 3 }
      ],
      sumStep: {
        individualProducts: [2400, 120, 60, 3],
        total: 2583
      },
      threeJSRepresentation: {
        gridLayout: "2x2",
        interactiveTiles: true,
        tileColorCoding: "based on value magnitude",
        axisLabels: { x: ["60", "3"], y: ["40", "1"] },
        sumDisplay: "floating number above the grid",
        animations: "tiles appear with multiplication animation",
        diagonalHighlight: true
      }
    }
  ];
};
