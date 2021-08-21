import mqtt from 'mqtt';
import { MQTTConnection } from './MQTTConnection';
import { IMQTTConnection } from './IMQTTConnection';
import { logInfo, logError } from '../logger';
import MQTTConfig from './MQTTConfig';

export const connectToMQTT = (): Promise<IMQTTConnection> => {
  logInfo('[MQTT] Connecting...');
  const client = mqtt.connect(MQTTConfig);

  return new Promise((resolve, reject) => {
    client.once('connect', () => {
      logInfo('[MQTT] Connected');
      resolve(new MQTTConnection(client));
    });
    client.once('error', (error) => {
      logError('[MQTT] Connect Error', error);
      reject(error);
    });
  });
};
