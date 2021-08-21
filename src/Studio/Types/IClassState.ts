import { IClassSession } from './IClassSession';
import { ICurrentEvent } from './ICurrentEvent';
import ITimings from './ITimings';

export interface IClassState {
  currentClass: {
    state: 'playing' | 'paused' | 'buffering';
    classSession: { id: string } & IClassSession;
    workout: { id: string; canSkipWarmup: boolean; canSkipCooldown: boolean } & ITimings;
    currentEvent?: ICurrentEvent;
  };
  isLive: boolean;
}
