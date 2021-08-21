import { Dictionary } from '../../Dictionary';
import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import { IClassFinishMetrics } from '../../Studio/Types/IClassFinishMetrics';
import { IClassSession } from '../../Studio/Types/IClassSession';
import { IDeviceData } from '../StudioSync';
import { Sensor } from './Sensor';

interface ICompletedWorkout extends IClassSession, IClassFinishMetrics {
  classId: string;
  workoutId: string;
  duration: number;
}

export class LastCompletedWorkout extends Sensor<ICompletedWorkout> {
  constructor(deviceData: IDeviceData, mqtt: IMQTTConnection) {
    super(deviceData, mqtt, 'Last Completed Workout');
  }

  additionalDiscoveryOptions(): Dictionary<any> {
    return {
      value_template: "{{ value_json.title | default('') }}",
      json_attributes_topic: this.stateTopic,
      icon: 'mdi:information-outline',
    };
  }
}
