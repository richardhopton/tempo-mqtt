import { IClassState } from './IClassState';
import { IStudioMessage } from './IStudioMessage';

export interface ICompanionConnectMessage extends IStudioMessage {
  action: 'companion-connect';
  state?: IClassState;
}
