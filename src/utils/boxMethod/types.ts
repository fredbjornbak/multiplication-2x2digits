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