import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import { IHeartRate } from '../../Studio/Types/IHeartRate';
import { IDeviceData } from '../StudioSync';
import { Dictionary } from '../../Dictionary';
import { Sensor } from './Sensor';

export class HeartRate extends Sensor<IHeartRate> {
  constructor(deviceData: IDeviceData, mqtt: IMQTTConnection) {
    super(deviceData, mqtt, 'Heart Rate');
  }

  additionalDiscoveryOptions(): Dictionary<any> {
    return {
      value_template: "{{ value_json.bpm | default('') }}",
      json_attributes_topic: this.stateTopic,
      force_update: true,
      icon: 'hass:pulse',
    };
  }
}
