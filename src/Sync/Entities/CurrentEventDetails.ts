import { Dictionary } from '../../Dictionary';
import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import { ICurrentEvent } from '../../Studio/Types/ICurrentEvent';
import { IDeviceData } from '../StudioSync';
import { Sensor } from './Sensor';

export class CurrentEventDetails extends Sensor<ICurrentEvent> {
  constructor(deviceData: IDeviceData, mqtt: IMQTTConnection) {
    super(deviceData, mqtt, 'Current Event');
  }

  additionalDiscoveryOptions(): Dictionary<any> {
    return {
      value_template: '{{ value_json.exerciseName | default(value_json.type) }}',
      json_attributes_topic: this.stateTopic,
      icon: 'mdi:information-outline',
    };
  }
}
