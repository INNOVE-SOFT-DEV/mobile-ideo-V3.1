import {Injectable} from "@angular/core";
import {VoiceRecorder, RecordingData, GenericResponse} from "capacitor-voice-recorder";
import {Filesystem, Directory} from "@capacitor/filesystem";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AudioRecorderService {
  private duration = 0;
  private durationDisplaySubject = new BehaviorSubject<string>("");
  public durationDisplay$ = this.durationDisplaySubject.asObservable();
  private timer: any;
  public fileName: string = "";
  public audioBlob: Blob | null = null;
  private hasPermission = false;

  constructor() {
    this.initPermission();
  }

  private async initPermission() {
    try {
      const permission = await VoiceRecorder.requestAudioRecordingPermission();
      this.hasPermission = permission.value;

      if (!this.hasPermission) {
        console.warn("🎙️ Microphone permission was not granted.");
      }
    } catch (err) {
      console.error("Failed to request microphone permission:", err);
      this.hasPermission = false;
    }
  }

  async startRecording(): Promise<GenericResponse> {
    if (!this.hasPermission) {
      throw new Error("Permission to record audio was not granted. Please allow microphone access.");
    }
    this.duration = 0;
    this.updateDurationDisplay();
    this.startTimer();
    return await VoiceRecorder.startRecording();
  }

  async stopRecording(): Promise<Blob> {
    clearInterval(this.timer);
    const result: RecordingData = await VoiceRecorder.stopRecording();
    const recordData = result?.value?.recordDataBase64;
    if (!recordData) {
      throw new Error("Échec de la récupération des données audio.");
    }
    this.fileName = new Date().getTime() + ".wav";
    try {
      await Filesystem.mkdir({
        path: "ideo2",
        directory: Directory.Data,
        recursive: true
      });
    } catch (error) {
      console.error(error);
    }

    await Filesystem.writeFile({
      path: `ideo2/${this.fileName}`,
      directory: Directory.Data,
      data: recordData
    });
    const byteCharacters = atob(recordData);
    const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    this.audioBlob = new Blob([byteArray], {type: "audio/mp3"});
    return this.audioBlob;
  }

  private startTimer() {
    this.timer = setInterval(() => {
      this.duration += 1;
      this.updateDurationDisplay();
      if (this.duration >= 60) {
        this.stopRecording();
        clearInterval(this.timer);
      }
    }, 1000);
  }

  private updateDurationDisplay() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = String(this.duration % 60).padStart(2, "0");
    this.durationDisplaySubject.next(`${minutes}:${seconds}`);
  }

  async getAudioBase64(): Promise<string> {
    const file = await Filesystem.readFile({
      path: `ideo2/${this.fileName}`,
      directory: Directory.Data
    });
    if (typeof file.data === "string") {
      return file.data;
    } else {
      throw new Error("Le fichier lu n'est pas une chaîne de caractères.");
    }
  }
}
