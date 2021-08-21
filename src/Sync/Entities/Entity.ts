import { IMQTTConnection } from '../../MQTT/IMQTTConnection';
import slugify from 'slugify';
import { IDeviceData } from '../StudioSync';
import { Dictionary } from '../../Dictionary';

const safeId = (value: string) => {
  return slugify(value.toLowerCase()).replace('-', '_');
};

type ComponentType = 'binary_sensor' | 'sensor';

export interface Entity<T> {
  additionalDiscoveryOptions?(): Dictionary<any>;
  mapState(state?: T): any;
}

export abstract class Entity<T> {
  entityTag: string;
  stateTopic: string;
  uniqueId: string;

  private state?: T;

  constructor(
    protected deviceData: IDeviceData,
    protected mqtt: IMQTTConnection,
    private entityDesc: string,
    private componentType: ComponentType,
    sendDiscovery = true
  ) {
    this.entityTag = safeId(this.entityDesc);
    this.uniqueId = `${safeId(deviceData.device.name)}_${this.entityTag}`;
    this.stateTopic = `${deviceData.deviceTopic}/${this.entityTag}/state`;

    if (sendDiscovery) this.publishDiscovery();
  }

  publishDiscovery = (): void => {
    const discoveryTopic = `homeassistant/${this.componentType}/${this.deviceData.deviceTopic}_${this.entityTag}/config`;
    const discoveryMessage = {
      name: `${this.deviceData.device.name} ${this.entityDesc}`,
      unique_id: this.uniqueId,
      state_topic: this.stateTopic,
      device: this.deviceData.device,
      ...(this.additionalDiscoveryOptions ? this.additionalDiscoveryOptions() : {}),
    };

    this.mqtt.publish(discoveryTopic, discoveryMessage);
  };

  setState = (state?: T): void => {
    this.state = state;
    this.sendState();
  };

  getState = () => {
    return this.state;
  };

  sendState = (): void => {
    this.mqtt.publish(this.stateTopic, this.mapState ? this.mapState(this.state) : this.state);
  };
}
