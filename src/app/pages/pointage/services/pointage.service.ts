import {Injectable} from "@angular/core";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";

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
    // try {
    //   const permissions = await BackgroundRunner.requestPermissions({
    //     apis: ['notifications', 'geolocation'],
    //   });
    // } catch (err) {
    //   console.error(`ERROR: ${err}`);
    // }
  }

  async readLocations() {
    // setInterval(async () => {
    //   const locations = await this.readLocationsFile();
    //   console.log('📍 Locations read every 15s:', JSON.stringify(locations));
    // }, 15000);
  }
  async readLocationsFile() {
    try {
      const file: any = await Filesystem.readFile({
        path: "locations.json",
        directory: Directory.External,
        encoding: Encoding.UTF8 // ✅ THIS disables Base64
      });

      return file;
    } catch (err) {
      console.error("❌ Failed to read locations file", err);
      return [];
    }
  }
}
