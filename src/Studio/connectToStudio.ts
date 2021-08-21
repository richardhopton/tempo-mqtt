import WebSocket from 'ws';
import { logInfo } from '../logger';
import { StudioConnection } from './StudioConnection';
import { IStudioConnection } from './IStudioConnection';

interface IService {
  addresses: string[];
  host: string;
  port: number;
}
const headers = { 'Tempo-Companion-Version': '1' };

const buildUrl = ({ addresses: [host], port }: IService, userId: string) => {
  return `ws://${host}:${port}?id=ha001&name=HomeAssistant&type=smartAssistant&platform=Tempo-MQTT&hrm=0&userId=${userId}`;
};

export const connectToStudio = (service: IService, userId: string): IStudioConnection => {
  const url = buildUrl(service, userId);
  logInfo(`[Studio] Connecting... ${service.host}`);
  const webSocket = new WebSocket(url, { headers });
  return new StudioConnection(webSocket);
};
