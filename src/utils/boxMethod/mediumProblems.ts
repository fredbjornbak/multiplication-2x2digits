import { BoxMethodProblem3D } from './types';

export const mediumProblems: BoxMethodProblem3D[] = [
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
  }
];