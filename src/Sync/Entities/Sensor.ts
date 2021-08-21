import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import { IDeviceData } from '../StudioSync';
import { Entity } from './Entity';

export abstract class Sensor<T> extends Entity<T> {
  constructor(deviceData: IDeviceData, mqtt: IMQTTConnection, entityDesc: string, sendDiscovery = true) {
    super(deviceData, mqtt, entityDesc, 'sensor', sendDiscovery);
  }

  mapState(state?: T): any {
    return state === undefined ? {} : state;
  }
}
