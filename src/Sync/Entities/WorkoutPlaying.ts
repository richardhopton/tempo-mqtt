import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import { IDeviceData } from '../StudioSync';
import { Sensor } from './Sensor';

type PlayingState = 'idle' | 'playing' | 'paused';

export class WorkoutPlaying extends Sensor<PlayingState> {
  constructor(deviceData: IDeviceData, mqtt: IMQTTConnection) {
    super(deviceData, mqtt, 'Workout Playing', false);
  }

  mapState(state?: PlayingState): PlayingState {
    return state === undefined ? 'idle' : state;
  }
}
