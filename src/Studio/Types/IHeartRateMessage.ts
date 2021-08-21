import { IClassState } from './IClassState';
import { IHeartRatePayload } from './IHeartRatePayload';
import { IStudioMessage } from './IStudioMessage';

export interface IHeartRateMessage extends IStudioMessage {
  action: 'heartrate-update';
  payload: IHeartRatePayload;
  state: IClassState;
}
