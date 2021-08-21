import ITimings from './ITimings';

export interface ICurrentEvent extends ITimings {
  type: string;
  exerciseName?: string;
  isIntro: boolean;
  isWarmup: boolean;
}
