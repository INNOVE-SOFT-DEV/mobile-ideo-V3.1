import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ideogroupev3.app",
  appName: "groupeideo",
  webDir: "www",
    plugins: {
      BackgroundRunner: {
      label: "com.ideogroupev3.app.task",
      src: "runners/runner.js",
      event: "pointingTask",
      repeat: true,
      interval: 15,
      autoStart: true
    },

    LocalNotifications: {

      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",

    },}
};

export default config;
