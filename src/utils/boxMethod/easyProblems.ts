import { BoxMethodProblem3D } from './types';

export const easyProblems: BoxMethodProblem3D[] = [
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
  }
];