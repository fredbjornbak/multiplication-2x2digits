import { BoxMethodProblem3D } from './types';
import { easyProblems } from './easyProblems';
import { mediumProblems } from './mediumProblems';
import { hardProblems } from './hardProblems';

export { type BoxMethodProblem3D } from './types';

export const getBoxMethod3DProblems = (): BoxMethodProblem3D[] => {
  return [
    ...easyProblems,
    ...mediumProblems,
    ...hardProblems
  ];
};