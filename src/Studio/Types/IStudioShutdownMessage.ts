import { IStudioMessage } from './IStudioMessage';

export interface IStudioShutdownMessage extends IStudioMessage {
  action: 'studio-shutdown';
}
