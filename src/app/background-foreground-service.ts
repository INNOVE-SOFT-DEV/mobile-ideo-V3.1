import {PluginListenerHandle} from "@capacitor/core";

export interface BackgroundForegroundServicePlugin {
  start(): Promise<void>;
  stop(): Promise<void>;
}

import {registerPlugin} from "@capacitor/core";

const BackgroundForegroundService = registerPlugin<BackgroundForegroundServicePlugin>("BackgroundForegroundService");

export default BackgroundForegroundService;
