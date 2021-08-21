import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import { IDeviceData } from '../StudioSync';
import { Entity } from './Entity';

export abstract class BinarySensor extends Entity<boolean> {
  constructor(deviceData: IDeviceData, mqtt: IMQTTConnection, entityDesc: string, sendDiscovery = true) {
    super(deviceData, mqtt, entityDesc, 'binary_sensor', sendDiscovery);
  }

  mapState(state?: boolean): string {
    return state ? 'ON' : 'OFF';
  }
}
