import {Injectable} from "@angular/core";
import {Capacitor} from "@capacitor/core";
import {Filesystem, Directory, Encoding} from "@capacitor/filesystem";

@Injectable({
  providedIn: "root"
})
export class FileSystemService {
  constructor() {
    this.init();
  }

  async init() {
    await this.ensurePermissions();
    try {
      await Filesystem.mkdir({
        path: "ideo_v3",
        directory: Directory.Data,
        recursive: true
      });
    } catch (error) {}
  }

  async ensurePermissions(): Promise<boolean> {
    const status = await Filesystem.checkPermissions();
    if (status.publicStorage !== "granted") {
      const requestStatus = await Filesystem.requestPermissions();
      return requestStatus.publicStorage === "granted";
    }
    return true;
  }

  async writeSecretFile(fileName: string, base64Data: string) {
    const granted = await this.ensurePermissions();
    if (!granted) {
      console.warn("Permission not granted to write file.");
      return;
    }

    const relativePath = "ideo_v3/" + fileName;

    const savedImageFile = await Filesystem.writeFile({
      path: relativePath,
      data: base64Data,
      directory: Directory.Data
    });

    let displayUri;
    try {
      displayUri = Capacitor.convertFileSrc(savedImageFile.uri);
    } catch (error) {
      displayUri = savedImageFile.uri;
    }

    return {
      path: relativePath,
      displayUri: displayUri,
      uri: savedImageFile.uri
    };
  }

  async readSecretFile(path: string) {
    const granted = await this.ensurePermissions();
    if (!granted) {
      console.warn("Permission not granted to read file.");
      return;
    }

    const contents: any = await Filesystem.readFile({
      path: path,
      directory: Directory.Data
    });
    return contents.data;
  }

  async deleteSecretFile(path: string) {
    const granted = await this.ensurePermissions();
    if (!granted) {
      console.warn("Permission not granted to delete file.");
      return;
    }

    await Filesystem.deleteFile({
      path: path,
      directory: Directory.Data
    });

    return "deleted";
  }
}
