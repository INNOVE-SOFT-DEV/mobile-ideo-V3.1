import {Injectable} from "@angular/core";
import { BackgroundRunner } from '@capacitor/background-runner';

@Injectable({
  providedIn: "root"
})
export class PointageService {
  private pointage: boolean = false;
  constructor() {
    this.init();
  }

  togglePointage(): boolean {
    this.pointage = !this.pointage;
    return this.pointage;
  }

  isPointed(): boolean {
    return this.pointage;
  }

  getConfirmationText(): string {
    return this.pointage ? "Confirmer le pointage (fin de mission)" : "Confirmer le pointage (début de mission)";
  }

    async init() {
    try {
      const permissions = await BackgroundRunner.requestPermissions({
        apis: ['notifications', 'geolocation'],
      });
      console.log('permissions', permissions);
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }

  async testSave() {
    const result = await BackgroundRunner.dispatchEvent({
      label: 'com.ideogroupev3.app.task',
      event: 'pointingTask',
      details: {
        testData: 'This is a test data for pointage task'
      },
    });
    console.log('save result', result);
  }

}
