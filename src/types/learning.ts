export interface LearningFlow {
  id: string;
  title: string;
  description: string;
  ageGroup: '5-7' | '8-10' | '10-13';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  prerequisites: string[];
  learningObjectives: string[];
  visualTools: string[];
  assessmentType: 'interactive' | 'visual-matching' | 'problem-solving';
}

export interface LearningStep {
  id: string;
  type: 'learn' | 'practice' | 'assess';
  title: string;
  instruction: string;
  visualComponent: string;
  interactionType: 'drag-drop' | 'click' | 'input' | 'slider' | 'tap';
  feedback: {
    correct: string;
    incorrect: string;
    hint: string;
  };
}

export interface VisualTool {
  id: string;
  name: string;
  description: string;
  component: string;
  supportedOperations: string[];
  ageGroups: ('5-7' | '8-10' | '10-13')[];
}

// Age 5-7 Learning Flows
export const ageGroup5to7Flows: LearningFlow[] = [
  {
    id: 'addition-1-10',
    title: 'Addition 1-10',
    description: 'Learn basic addition using visual counting and grouping',
    ageGroup: '5-7',
    difficulty: 'easy',
    estimatedTime: 15,
    prerequisites: [],
    learningObjectives: [
      'Count objects up to 10',
      'Combine groups to find totals',
      'Recognize addition symbols',
      'Solve simple addition problems'
    ],
    visualTools: ['counting-bears', 'number-line', 'dot-patterns'],
    assessmentType: 'visual-matching'
  },
  {
    id: 'shapes-measurement-1',
    title: 'Shapes and Measurement 1',
    description: 'Identify and sort basic shapes by properties',
    ageGroup: '5-7',
    difficulty: 'easy',
    estimatedTime: 20,
    prerequisites: [],
    learningObjectives: [
      'Identify circles, squares, triangles',
      'Count sides and corners',
      'Sort shapes by properties',
      'Find shapes in real world'
    ],
    visualTools: ['shape-sorter', 'property-explorer', 'real-world-finder'],
    assessmentType: 'interactive'
  }
];

// Age 8-10 Learning Flows
export const ageGroup8to10Flows: LearningFlow[] = [
  {
    id: 'multiplication-1',
    title: 'Multiplication 1x1 digit',
    description: 'Learn single-digit multiplication using visual arrays and groups',
    ageGroup: '8-10',
    difficulty: 'medium',
    estimatedTime: 25,
    prerequisites: ['addition-1-10'],
    learningObjectives: [
      'Understand multiplication as repeated addition',
      'Create and read arrays',
      'Use the box method for visualization',
      'Solve 1x1 digit problems'
    ],
    visualTools: ['box-method', 'array-builder', 'group-counter'],
    assessmentType: 'problem-solving'
  },
  {
    id: 'fractions-1',
    title: 'Fractions 1 - Basic Introduction',
    description: 'Understand fractions using pie charts and visual models',
    ageGroup: '8-10',
    difficulty: 'medium',
    estimatedTime: 30,
    prerequisites: ['shapes-measurement-1'],
    learningObjectives: [
      'Identify parts of a whole',
      'Read fraction notation',
      'Compare simple fractions',
      'Use fractions in real contexts'
    ],
    visualTools: ['pie-chart-builder', 'fraction-bars', 'real-world-fractions'],
    assessmentType: 'visual-matching'
  }
];

// Visual Tools Registry
export const visualTools: VisualTool[] = [
  {
    id: 'box-method',
    name: 'Box Method Multiplication',
    description: '3D visual blocks for understanding multiplication through area models',
    component: 'BoxMethod3D',
    supportedOperations: ['multiplication', 'area-models', 'place-value'],
    ageGroups: ['8-10', '10-13']
  },
  {
    id: 'counting-bears',
    name: 'Counting Bears',
    description: 'Colorful bear counters for basic addition and subtraction',
    component: 'CountingBears',
    supportedOperations: ['addition', 'subtraction', 'counting'],
    ageGroups: ['5-7']
  },
  {
    id: 'shape-sorter',
    name: 'Interactive Shape Sorter',
    description: 'Drag and drop shapes to learn properties and classification',
    component: 'ShapeSorter',
    supportedOperations: ['classification', 'properties', 'sorting'],
    ageGroups: ['5-7', '8-10']
  },
  {
    id: 'pie-chart-builder',
    name: 'Fraction Pie Builder',
    description: 'Interactive pie charts for understanding fractions visually',
    component: 'PieChartBuilder',
    supportedOperations: ['fractions', 'parts-whole', 'comparison'],
    ageGroups: ['8-10', '10-13']
  }
];