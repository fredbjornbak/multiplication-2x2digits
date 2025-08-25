import { BoxMethodProblem3D } from './types';

// Test problems for 4x4 grid testing (3-digit × 3-digit)
export const testProblems: BoxMethodProblem3D[] = [
  {
    id: 1000,
    problem: "123 × 456",
    context: "Calculate the area of a rectangular garden that is 123 meters by 456 meters.",
    difficulty: 'hard',
    placeValueDecomposition: {
      firstNumber: [100, 20, 3],
      secondNumber: [400, 50, 6]
    },
    boxGrid: [
      { rowLabel: "100", columnLabel: "400", product: 40000 },
      { rowLabel: "100", columnLabel: "50", product: 5000 },
      { rowLabel: "100", columnLabel: "6", product: 600 },
      { rowLabel: "20", columnLabel: "400", product: 8000 },
      { rowLabel: "20", columnLabel: "50", product: 1000 },
      { rowLabel: "20", columnLabel: "6", product: 120 },
      { rowLabel: "3", columnLabel: "400", product: 1200 },
      { rowLabel: "3", columnLabel: "50", product: 150 },
      { rowLabel: "3", columnLabel: "6", product: 18 }
    ],
    sumStep: {
      individualProducts: [40000, 5000, 600, 8000, 1000, 120, 1200, 150, 18],
      total: 56088
    },
    threeJSRepresentation: {
      gridLayout: "3x3",
      interactiveTiles: true,
      tileColorCoding: "place-value",
      axisLabels: {
        x: ["400", "50", "6"],
        y: ["100", "20", "3"]
      },
      sumDisplay: "56088",
      animations: "expand-on-hover",
      diagonalHighlight: false
    }
  },
  {
    id: 1001,
    problem: "234 × 567",
    context: "A factory produces 234 items per day for 567 days. How many items total?",
    difficulty: 'hard',
    placeValueDecomposition: {
      firstNumber: [200, 30, 4],
      secondNumber: [500, 60, 7]
    },
    boxGrid: [
      { rowLabel: "200", columnLabel: "500", product: 100000 },
      { rowLabel: "200", columnLabel: "60", product: 12000 },
      { rowLabel: "200", columnLabel: "7", product: 1400 },
      { rowLabel: "30", columnLabel: "500", product: 15000 },
      { rowLabel: "30", columnLabel: "60", product: 1800 },
      { rowLabel: "30", columnLabel: "7", product: 210 },
      { rowLabel: "4", columnLabel: "500", product: 2000 },
      { rowLabel: "4", columnLabel: "60", product: 240 },
      { rowLabel: "4", columnLabel: "7", product: 28 }
    ],
    sumStep: {
      individualProducts: [100000, 12000, 1400, 15000, 1800, 210, 2000, 240, 28],
      total: 132678
    },
    threeJSRepresentation: {
      gridLayout: "3x3",
      interactiveTiles: true,
      tileColorCoding: "place-value",
      axisLabels: {
        x: ["500", "60", "7"],
        y: ["200", "30", "4"]
      },
      sumDisplay: "132678",
      animations: "expand-on-hover",
      diagonalHighlight: false
    }
  }
];