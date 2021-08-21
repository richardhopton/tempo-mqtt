import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import { IDeviceData } from '../StudioSync';
import { BinarySensor } from './BinarySensor';

export class LoggedIn extends BinarySensor {
  constructor(deviceData: IDeviceData, mqtt: IMQTTConnection) {
    super(deviceData, mqtt, 'Logged In');
  }
}
