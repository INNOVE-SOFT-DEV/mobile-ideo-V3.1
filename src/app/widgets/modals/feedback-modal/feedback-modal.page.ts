import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import WaveSurfer from "wavesurfer.js";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import {v4 as uuidv4} from "uuid";
import {Subscription} from "rxjs";
import {ToastControllerService} from "../../toast-controller/toast-controller.service";

@Component({
  selector: "app-feedback-modal",
  templateUrl: "./feedback-modal.page.html",
  styleUrls: ["./feedback-modal.page.scss"],
  standalone: false
})
export class FeedbackModalPage implements OnInit {
  @Input() planning: any;
  @Input() agent: any;
  @Input() schedule: any;
  @Input() parent_id: any;
  @Input() reply: any;
  recording: boolean = false;
  isRecording: boolean = false;
  durationDisplay: string = "";
  waveSurfer?: WaveSurfer;
  audioRecording?: Blob;
  blobUrl?: string;
  selectedOption: number | null = null;
  base64Audio: string = "";
  uuid: string = "";
  audioUrl: any = "";
  private durationSub?: Subscription;
  isPlaying = false;
  returnTime: string = "";

  constructor(
    private modalController: ModalController,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private audioRecorderService: AudioRecorderService,
    private toastCtrl: ToastControllerService
  ) {}

  ngOnInit() {
    if (this.reply?.audio_url) {
      this.returnTime = this.reply.recorded_at.split("T")[1].split(".")[0].split(":").slice(0, 2).join(":") || "";
      this.audioUrl = this.reply.audio_url;
      this.blobUrl = this.reply.audio_url.url;
      this.createWaves();
      this.waveSurfer?.load(this.reply.audio_url.url);
    }
  }

  selectOption(value: number) {
    this.selectedOption = value;
  }

  async startRecording() {
    this.recording = true;
    this.isRecording = true;
    this.durationDisplay = "";
    this.createWaves();
    await this.audioRecorderService.startRecording();
    this.durationSub = this.audioRecorderService.durationDisplay$.subscribe(value => {
      this.durationDisplay = value;
    });
  }

  async stopRecording() {
    this.recording = false;
    const audioBlob = await this.audioRecorderService.stopRecording();
    this.audioRecording = audioBlob;
    this.base64Audio = await this.audioRecorderService.blobToBase64(audioBlob);
    this.uuid = uuidv4();
    this.blobUrl = URL.createObjectURL(audioBlob);
    this.waveSurfer?.load(this.blobUrl);
  }

  createWaves() {
    this.waveSurfer?.destroy();
    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "white",
      progressColor: "gray",
      normalize: true,
      height: 52,
      barWidth: 3,
      barRadius: 3
    });
    this.waveSurfer.on("audioprocess", () => {
      if (this.waveSurfer) {
        const currentTime = this.waveSurfer.getCurrentTime();
        this.durationDisplay = this.formatDuration(currentTime);
      }
    });

    this.waveSurfer.on("finish", () => {
      this.isPlaying = false;
      this.getAudioDurationWithFetch();
    });
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  }

  getAudioDurationWithFetch() {
    if (!this.audioUrl) return;

    fetch(this.audioUrl.url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        return audioContext.decodeAudioData(arrayBuffer);
      })
      .then(decodedData => {
        const duration = decodedData.duration;
        this.durationDisplay = this.formatDuration(duration);
      })
      .catch(err => {
        console.error("Error decoding audio:", err);
        this.durationDisplay = "Unknown";
      });
  }

  dismiss(data: any) {
    this.modalController.dismiss(data);
  }

  playRecordingAgain() {
    if (this.waveSurfer && this.blobUrl) {
      this.isPlaying = true;
      this.waveSurfer.playPause();
    }
  }

  submitFeedback() {
    // Implement submission logic here
    const feedbackData: any = {
      internal_id: this.agent.pointing_internal[0]?.id,
      audio_report: {
        client_uuid: this.uuid,
        reaction_type: this.selectedOption,
        recorded_at: new Date().toISOString(),
        parent_id: this.parent_id
      }
    };
    if (this.audioRecording) {
      feedbackData.audio_report.audio_base64 = this.base64Audio;
    }
    this.missionService.createMissionReturn(feedbackData).subscribe({
      next: async data => {
        await this.loadingService.dimiss();
        this.toastCtrl.presentToast("Reponse envoyée avec succès", "success");
        this.dismiss(data);
      },
      error: async error => {
        await this.loadingService.dimiss();
        console.error(error);
      }
    });

    // this.dismiss();
  }
}
