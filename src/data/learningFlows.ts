import { LearningFlow, LearningStep } from '@/types/learning';

// Complete learning flow definitions following the design guide

export const kindergartenFlows: LearningFlow[] = [
  {
    id: 'counting-cardinality',
    title: 'Counting & Cardinality',
    description: 'Count objects and match numbers visually',
    ageGroup: '5-7',
    difficulty: 'easy',
    estimatedTime: 15,
    prerequisites: [],
    learningObjectives: [
      'Count objects up to 20',
      'Match numbers to quantities',
      'Complete number sequences',
      'Compare groups using more/less'
    ],
    visualTools: ['interactive-counter', 'number-line-visual', 'object-matcher'],
    assessmentType: 'interactive'
  },
  {
    id: 'basic-shapes',
    title: 'Basic Shapes',
    description: 'Identify and sort 2D shapes by properties',
    ageGroup: '5-7',
    difficulty: 'easy',
    estimatedTime: 20,
    prerequisites: [],
    learningObjectives: [
      'Identify circles, squares, triangles',
      'Count sides and corners',
      'Sort shapes by properties',
      'Find shapes in real scenes'
    ],
    visualTools: ['shape-matcher', 'property-counter', 'scene-explorer'],
    assessmentType: 'visual-matching'
  }
];

export const grade1Flows: LearningFlow[] = [
  {
    id: 'addition-subtraction-20',
    title: 'Addition & Subtraction within 20',
    description: 'Visual addition and subtraction using objects and number lines',
    ageGroup: '5-7',
    difficulty: 'easy',
    estimatedTime: 25,
    prerequisites: ['counting-cardinality'],
    learningObjectives: [
      'Add and subtract within 20',
      'Use number bonds',
      'Navigate number lines',
      'Solve story problems visually'
    ],
    visualTools: ['number-line-hopper', 'ten-frame', 'object-grouper'],
    assessmentType: 'problem-solving'
  },
  {
    id: 'place-value-tens-ones',
    title: 'Place Value (Tens & Ones)',
    description: 'Build numbers using base-ten blocks',
    ageGroup: '5-7',
    difficulty: 'easy',
    estimatedTime: 20,
    prerequisites: ['counting-cardinality'],
    learningObjectives: [
      'Understand tens and ones',
      'Build numbers with blocks',
      'Compare two-digit numbers',
      'Identify digit values'
    ],
    visualTools: ['base-ten-blocks', 'number-builder', 'place-value-chart'],
    assessmentType: 'interactive'
  }
];

export const grade2Flows: LearningFlow[] = [
  {
    id: 'addition-subtraction-100',
    title: 'Addition & Subtraction within 100',
    description: 'Two-digit operations with regrouping using visual models',
    ageGroup: '5-7',
    difficulty: 'medium',
    estimatedTime: 30,
    prerequisites: ['place-value-tens-ones', 'addition-subtraction-20'],
    learningObjectives: [
      'Add and subtract 2-digit numbers',
      'Understand regrouping',
      'Use column methods',
      'Solve multi-step problems'
    ],
    visualTools: ['regrouping-blocks', 'column-builder', 'story-solver'],
    assessmentType: 'problem-solving'
  }
];

export const grade3Flows: LearningFlow[] = [
  {
    id: 'multiplication-division-basic',
    title: 'Multiplication & Division',
    description: 'Build arrays and equal groups for multiplication concepts',
    ageGroup: '8-10',
    difficulty: 'medium',
    estimatedTime: 35,
    prerequisites: ['addition-subtraction-100'],
    learningObjectives: [
      'Build multiplication arrays',
      'Understand equal groups',
      'Connect to repeated addition',
      'Solve division by grouping'
    ],
    visualTools: ['array-builder', 'group-divider', 'fact-family-wheel'],
    assessmentType: 'interactive'
  },
  {
    id: 'fractions-simple',
    title: 'Simple Fractions',
    description: 'Shade parts of shapes and place fractions on number lines',
    ageGroup: '8-10',
    difficulty: 'medium',
    estimatedTime: 25,
    prerequisites: ['basic-shapes'],
    learningObjectives: [
      'Identify fraction parts',
      'Shade fraction models',
      'Place fractions on lines',
      'Compare fractions visually'
    ],
    visualTools: ['fraction-shader', 'number-line-fractions', 'pie-comparator'],
    assessmentType: 'visual-matching'
  }
];

// Learning steps for specific flows
export const boxMethodSteps: LearningStep[] = [
  {
    id: 'intro-box-concept',
    type: 'learn',
    title: 'Meet the Box Method',
    instruction: 'Watch how we can break numbers into parts using boxes',
    visualComponent: 'IntroAnimation',
    interactionType: 'click',
    feedback: {
      correct: 'Great! You understand how boxes help us multiply',
      incorrect: 'Try watching the animation again',
      hint: 'Think of boxes as containers for number parts'
    }
  },
  {
    id: 'build-first-box',
    type: 'practice',
    title: 'Build Your First Box',
    instruction: 'Drag blocks to fill the box for 6 × 20',
    visualComponent: 'BoxBuilder',
    interactionType: 'drag-drop',
    feedback: {
      correct: 'Perfect! 6 × 20 = 120 using 1 hundred block and 2 ten blocks',
      incorrect: 'Count the blocks again. How many tens make 120?',
      hint: 'Think: 6 × 20 = 6 × 2 tens = 12 tens = 120'
    }
  },
  {
    id: 'complete-multiplication',
    type: 'assess',
    title: 'Complete the Problem',
    instruction: 'Fill all boxes to solve 6 × 24',
    visualComponent: 'FullBoxMethod',
    interactionType: 'drag-drop',
    feedback: {
      correct: 'Excellent! You solved 6 × 24 = 144 using the box method',
      incorrect: 'Check each box carefully. Add up all your products',
      hint: 'Remember: 6 × (20 + 4) = (6 × 20) + (6 × 4)'
    }
  }
];

export const allLearningFlows = [
  ...kindergartenFlows,
  ...grade1Flows,
  ...grade2Flows,
  ...grade3Flows
];