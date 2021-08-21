import { ClassMessageActions } from './ClassMessageActions';
import { IClassState } from './IClassState';
import { IStudioMessage } from './IStudioMessage';

export interface IClassMessage extends IStudioMessage {
  action: ClassMessageActions;
  state: IClassState;
}
