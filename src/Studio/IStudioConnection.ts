import { IClassMessage } from './Types/IClassMessage';
import { ClassMessageActions } from './Types/ClassMessageActions';
import { ICompanionConnectMessage } from './Types/ICompanionConnectMessage';
import { IStudioShutdownMessage } from './Types/IStudioShutdownMessage';
import { IClassLeftMessage } from './Types/IClassLeftMessage';
import { IHeartRateMessage } from './Types/IHeartRateMessage';
import { IClassFinishMessage } from './Types/IClassFinishMessage';

export interface IStudioConnection {
  on(event: 'companion-connect', listener: (this: IStudioConnection, message: ICompanionConnectMessage) => void): this;
  on(event: ClassMessageActions, listener: (this: IStudioConnection, message: IClassMessage) => void): this;
  on(event: 'class-left', listener: (this: IStudioConnection, message: IClassLeftMessage) => void): this;
  on(event: 'class-finish', listener: (this: IStudioConnection, message: IClassFinishMessage) => void): this;
  on(event: 'heartrate-update', listener: (this: IStudioConnection, message: IHeartRateMessage) => void): this;
  on(event: 'studio-shutdown', listener: (this: IStudioConnection, message: IStudioShutdownMessage) => void): this;

  send(data: any, cb?: (err?: Error) => void): void;

  close(): void;
}
