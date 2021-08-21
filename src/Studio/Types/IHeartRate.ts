import { HeartRateZone } from './HeartRateZone';

export interface IHeartRate {
  bpm: number;
  zone: HeartRateZone;
  deviceId: string;
}
