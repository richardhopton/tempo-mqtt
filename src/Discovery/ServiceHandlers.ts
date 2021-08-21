import { RemoteService } from 'bonjour';
import { connectToStudio } from '../Studio/connectToStudio';
import { IMQTTConnection } from '../MQTT/IMQTTConnection';
import { StudioSync } from '../Sync/StudioSync';
import { logInfo } from '../logger';
import { knownHosts } from '../Options';
import { Dictionary } from '../Dictionary';

const syncMap: Dictionary<(() => void) | undefined> = {};
export const up = async (mqtt: IMQTTConnection, service: RemoteService): Promise<void> => {
  logInfo('[Studio] Up', service.name);
  if (!knownHosts?.length || knownHosts.includes(service.name)) {
    const userId = service.txt.userid;
    const studio = connectToStudio(service, userId);
    const sync = StudioSync.start(studio, mqtt, userId);
    syncMap[service.name] = sync.stop;
  }
};

export const down = ({ name }: RemoteService): void => {
  logInfo('[Studio] Down', name);
  const stop = syncMap[name];
  if (stop) {
    syncMap[name] = undefined;
    stop();
  }
};
