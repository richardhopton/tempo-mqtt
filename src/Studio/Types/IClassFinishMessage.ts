import { IClassFinishPayload } from './IClassFinishPayload';
import { IStudioMessage } from './IStudioMessage';

export interface IClassFinishMessage extends IStudioMessage {
  action: 'class-finish';
  payload: IClassFinishPayload;
}
