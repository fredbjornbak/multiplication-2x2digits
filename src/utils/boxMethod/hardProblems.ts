import { BoxMethodProblem3D } from './types';

export const hardProblems: BoxMethodProblem3D[] = [
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