import { IStudioMessage } from './IStudioMessage';

export interface IClassLeftMessage extends IStudioMessage {
  action: 'class-left';
}
