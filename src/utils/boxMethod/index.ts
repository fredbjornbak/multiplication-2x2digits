import { BoxMethodProblem3D } from './types';
import { easyProblems } from './easyProblems';
import { mediumProblems } from './mediumProblems';
import { hardProblems } from './hardProblems';
import { testProblems } from './testProblems';

export { type BoxMethodProblem3D } from './types';

export const getBoxMethod3DProblems = (): BoxMethodProblem3D[] => {
  return [
    ...easyProblems,
    ...mediumProblems,
    ...hardProblems,
    ...testProblems  // Include test problems for 3x3 grids
  ];
};