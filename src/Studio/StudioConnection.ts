import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { IStudioConnection } from './IStudioConnection';
import { IStudioStateUpdateMessage } from './Types/IStudioStateUpdateMessage';
import { logInfo, logError } from '../logger';
export type Data = string | Buffer | ArrayBuffer | Buffer[];

export class StudioConnection extends EventEmitter implements IStudioConnection {
  constructor(private client: WebSocket) {
    super();

    client.on('open', () => {
      logInfo('[Studio] Connected');
    });

    client.on('close', client.removeAllListeners);

    client.on('error', (error) => {
      logError('[Studio] Error:', error);
    });

    client.on('message', (data) => {
      const message: IStudioStateUpdateMessage = JSON.parse(data.toString());
      this.emit(message.params.action, message.params);
    });

    client.on('ping', () => client.pong());
  }

  send(data: any, cb?: (err?: Error) => void): void {
    if (data instanceof Object) {
      data = JSON.stringify(data);
    }
    this.client.send(data, cb);
  }

  close(): void {
    this.client.close();
    this.removeAllListeners();
  }
}
