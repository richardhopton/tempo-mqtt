import { readFileSync } from 'fs';
import { Dictionary } from './Dictionary';

interface OptionsJson {
  user_map: [{ id: string; name: string }];
  known_hosts: string[];
}
const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const userMap = options.user_map.reduce((acc, val) => {
  acc[val.id] = val.name;
  return acc;
}, {} as Dictionary<string>);

export const knownHosts = options.known_hosts;
