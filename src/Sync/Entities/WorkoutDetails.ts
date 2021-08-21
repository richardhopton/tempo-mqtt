import { Dictionary } from '../../Dictionary';
import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import { IClassSession } from '../../Studio/Types/IClassSession';
import ITimings from '../../Studio/Types/ITimings';
import { IDeviceData } from '../StudioSync';
import { Sensor } from './Sensor';

interface IWorkoutDetails extends ITimings, IClassSession {
  classId: string;
  workoutId: string;
}

export class WorkoutDetails extends Sensor<IWorkoutDetails> {
  constructor(deviceData: IDeviceData, mqtt: IMQTTConnection) {
    super(deviceData, mqtt, 'Workout Details');
  }

  additionalDiscoveryOptions(): Dictionary<any> {
    return {
      value_template: "{{ value_json.title | default('') }}",
      json_attributes_topic: this.stateTopic,
      icon: 'mdi:information-outline',
    };
  }
}
