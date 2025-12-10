import {Injectable} from "@angular/core";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {Preferences} from "@capacitor/preferences";

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

  async readLocations(): Promise<any[]> {
    try {
      let file;
      try {
        file = await Filesystem.readFile({
          path: "queue.json",
          directory: Directory.Data, // Correspond à getFilesDir() en natif
          encoding: Encoding.UTF8
        });
      } catch (err: any) {
        if (err.code === "OS-PLUG-FILE-0008") {
          // Si le fichier n'existe pas, on le crée vide
          await Filesystem.writeFile({
            path: "queue.json",
            directory: Directory.Data,
            data: "[]",
            encoding: Encoding.UTF8
          });
          file = {data: "[]"};
        } else {
          throw err;
        }
      }

      const dataString = typeof file.data === "string" ? file.data : await file.data.text();
      console.log("📂 Contenu du fichier queue.json :", dataString);

      return JSON.parse(dataString);
    } catch (err) {
      console.error("❌ Failed to read locations file", err);
      return [];
    }
  }

  async readLocationsFile() {
    /* try {
      const file: any = await Filesystem.readFile({
        path: "locations.json",
        directory: Directory.External,
        encoding: Encoding.UTF8 // ✅ THIS disables Base64
      });

      return file;
    } catch (err) {
      console.error("❌ Failed to read locations file", err);
      return [];
    }*/
  }
}
