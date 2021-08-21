import Bonjour from 'bonjour';
import { logInfo } from '../logger';
import { IMQTTConnection } from '../MQTT/IMQTTConnection';
import { up, down } from './ServiceHandlers';

export const discoverStudios = (mqtt: IMQTTConnection): void => {
  const bonjour = Bonjour();
  logInfo('[Discovery] Looking for Tempo Studio devices...');
  const browser = bonjour.find({ type: 'tempo-wss' });
  browser.on('up', up.bind(null, mqtt));
  browser.on('down', down);
};
