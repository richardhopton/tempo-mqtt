import { logInfo } from '../logger';
import { IMQTTConnection } from '../MQTT/IMQTTConnection';
import { userMap } from '../Options';
import { IStudioConnection } from '../Studio/IStudioConnection';
import { IClassFinishMessage } from '../Studio/Types/IClassFinishMessage';
import { IClassMessage } from '../Studio/Types/IClassMessage';
import { IClassState } from '../Studio/Types/IClassState';
import { ICompanionConnectMessage } from '../Studio/Types/ICompanionConnectMessage';
import { IHeartRateMessage } from '../Studio/Types/IHeartRateMessage';
import { CurrentEventDetails } from './Entities/CurrentEventDetails';
import { HeartRate } from './Entities/HeartRate';
import { LastCompletedWorkout } from './Entities/LastCompletedWorkout';
import { LoggedIn } from './Entities/LoggedIn';
import { TakingClass } from './Entities/TakingClass';
import { WorkoutDetails } from './Entities/WorkoutDetails';
import { WorkoutPlaying } from './Entities/WorkoutPlaying';

export interface IDeviceData {
  deviceTopic: string;
  device: IDevice;
}

interface IDevice {
  ids: string[];
  name: string;
  mf: string;
  mdl: string;
}

export class StudioSync {
  private deviceData: IDeviceData;

  private loggedIn: LoggedIn;
  private takingClass: TakingClass;
  private workoutPlaying: WorkoutPlaying;
  private workoutDetails: WorkoutDetails;
  private currentEventDetails: CurrentEventDetails;
  private heartRate: HeartRate;
  private lastClassMetrics: LastCompletedWorkout;

  private stopActions: (() => void)[] = [];
  static start(studio: IStudioConnection, mqtt: IMQTTConnection, userId: string): StudioSync {
    return new StudioSync(studio, mqtt, userId);
  }

  private constructor(studio: IStudioConnection, mqtt: IMQTTConnection, userId: string) {
    const deviceTopic = `tempo/${userId}`;
    const device = { ids: [userId], name: `${userMap[userId] || userId} Tempo`, mf: 'Tempo', mdl: 'Studio' };

    this.deviceData = { deviceTopic, device };

    this.loggedIn = new LoggedIn(this.deviceData, mqtt);
    this.takingClass = new TakingClass(this.deviceData, mqtt);
    this.workoutPlaying = new WorkoutPlaying(this.deviceData, mqtt);
    this.workoutDetails = new WorkoutDetails(this.deviceData, mqtt);
    this.currentEventDetails = new CurrentEventDetails(this.deviceData, mqtt);
    this.heartRate = new HeartRate(this.deviceData, mqtt);
    this.lastClassMetrics = new LastCompletedWorkout(this.deviceData, mqtt);

    studio.on('companion-connect', this.handleCompanionConnect);
    studio.on('class-start', this.handleClassMessage);
    studio.on('class-play', this.handleClassMessage);
    studio.on('class-pause', this.handleClassMessage);
    studio.on('class-time-update', this.handleClassMessage);
    studio.on('class-left', this.clearClassState);
    studio.on('class-finish', this.handleClassFinished);
    studio.on('heartrate-update', this.handleHeartRateUpdate);

    studio.on('studio-shutdown', this.stop);

    mqtt.subscribe('tempo/commands');
    mqtt.on('tempo/commands', (command) => studio.send(command));
    mqtt.on('connect', this.resendState);

    this.stopActions.push(this.clearClassState);
    this.stopActions.push(() => this.loggedIn.setState(false));
    this.stopActions.push(() => mqtt.unsubscribe('tempo/commands'));
    this.stopActions.push(() => mqtt.off('tempo/commands', studio.send));
    this.stopActions.push(() => studio.close());
  }

  private resendState = () => {
    this.loggedIn.sendState();
    this.takingClass.sendState();
    this.workoutPlaying.sendState();
    this.workoutDetails.sendState();
    this.currentEventDetails.sendState();
    this.heartRate.sendState();
  };

  private handleHeartRateUpdate = (message: IHeartRateMessage) => {
    this.heartRate.setState(message.payload.heartRate);
  };

  private handleClassFinished = (message: IClassFinishMessage) => {
    const workoutState = this.workoutDetails.getState();
    if (workoutState) {
      const { elapsed, remaining, ...state } = workoutState;
      this.lastClassMetrics.setState({ ...state, ...message.payload.metrics });
    }
    this.clearClassState();
  };

  private handleClassMessage = (message: IClassMessage) => {
    this.setClassState(message.state);
  };

  private handleCompanionConnect = async (message: ICompanionConnectMessage) => {
    logInfo('[Sync] Companion Connect', message);
    this.loggedIn.setState(true);
    if (message.state?.currentClass) {
      this.setClassState(message.state);
    } else {
      this.clearClassState();
    }
  };

  private clearClassState = () => {
    this.takingClass.setState(false);
    this.workoutDetails.setState();
    this.currentEventDetails.setState();
    this.workoutPlaying.setState('idle');
    this.heartRate.setState();
  };

  private setClassState = (state: IClassState) => {
    this.takingClass.setState(true);
    const currentClass = state.currentClass;
    const {
      classSession: { id: classId, ...classSession },
      workout: { id: workoutId, canSkipWarmup, canSkipCooldown, ...workout },
    } = state.currentClass;

    this.workoutPlaying.setState(currentClass.state === 'buffering' ? 'paused' : currentClass.state);
    this.workoutDetails.setState({
      classId,
      workoutId,
      ...workout,
      ...classSession,
    });
    this.currentEventDetails.setState(state.currentClass.currentEvent);
  };

  public stop = (): void => {
    logInfo('[Sync] Stop');
    this.stopActions.forEach((action) => action());
  };
}
