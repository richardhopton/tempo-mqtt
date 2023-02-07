import { discoverStudios } from './Discovery/discoverStudios';
import { logError, logWarn } from './logger';
import { connectToMQTT } from './MQTT/connectToMQTT';

const processExit = (exitCode?: number) => {
  if (exitCode && exitCode > 0) {
    logError(`Exit code: ${exitCode}`);
  }
  process.exit();
};

process.on('exit', () => {
  logWarn('Shutting down Tempo-MQTT...');
  processExit(0);
});
process.on('SIGINT', () => processExit(0));
process.on('SIGTERM', () => processExit(0));
process.on('uncaughtException', (err) => {
  logError(err);
  processExit(2);
});

const start = async (): Promise<void> => {
  try {
    const mqtt = await connectToMQTT();
    discoverStudios(mqtt);
  } catch (e) {
    logError(e);
    processExit();
  }
};
void start();
