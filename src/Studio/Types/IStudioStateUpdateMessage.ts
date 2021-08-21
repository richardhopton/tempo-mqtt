import { IClassFinishMessage } from './IClassFinishMessage';
import { IClassLeftMessage } from './IClassLeftMessage';
import { IClassMessage } from './IClassMessage';
import { ICompanionConnectMessage } from './ICompanionConnectMessage';
import { IHeartRateMessage } from './IHeartRateMessage';
import { IStudioShutdownMessage } from './IStudioShutdownMessage';

export interface IStudioStateUpdateMessage {
  method: string;
  params:
    | ICompanionConnectMessage
    | IClassMessage
    | IClassFinishMessage
    | IClassLeftMessage
    | IHeartRateMessage
    | IStudioShutdownMessage;
}
