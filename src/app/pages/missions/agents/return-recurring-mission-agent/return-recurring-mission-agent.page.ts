import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import WaveSurfer from "wavesurfer.js";
import {Subscription} from "rxjs";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import {ReturnRecurringMissionAgentModalPage} from "src/app/widgets/modals/missions/agents/return-recurring-mission-agent-modal/return-recurring-mission-agent-modal.page";
import {ModalController} from "@ionic/angular";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {v4 as uuidv4} from "uuid";

@Component({
  selector: "app-return-recurring-mission-agent",
  templateUrl: "./return-recurring-mission-agent.page.html",
  styleUrls: ["./return-recurring-mission-agent.page.scss"],
  standalone: false
})
export class ReturnRecurringMissionAgentPage implements OnInit {
  planning: any;
  note: string = "";
  isRecording: boolean = false;
  recording: boolean = false;
  waveSurfer?: WaveSurfer;
  private durationSub?: Subscription;
  durationDisplay: string = "";
  blobUrl?: string;
  audioRecording?: File;
  noteCache: string = "";
  returnTime: any;
  loadingMessage: string | undefined;
  audioBase64: string = "";
  uuid: string = "";
  user_v3 = JSON.parse(localStorage.getItem("user-v3") || "{}");
  internal: any;
  isnewRecording: boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private audioRecorderService: AudioRecorderService,
    private modalController: ModalController,
    private missionService: MissionService,
    private loadingService: LoadingControllerService
  ) {}

  ngOnInit() {
    const data = JSON.parse(this.route.snapshot.paramMap.get("data")!) || {};

    this.planning = data;
    this.getReturns();
    this.internal = this.planning.team.find((u: any) => u.id === this.user_v3.id).pointing_internal[0];
  }

  async getReturns() {
    await this.loadingService.present(this.loadingMessage);
    this.missionService.getMissionReturnAudio(this.internal.id).subscribe({
      next: async value => {
        this.note = value?.audio_report.note || "";
        this.noteCache = this.note;
        if (value?.audio_report.audio_url) {
          this.blobUrl = value?.audio_report.audio_url;
          this.isRecording = true;
          this.createWaves();
          this.waveSurfer?.load(value?.audio_report.audio_url.url);
        }
        await this.loadingService.dimiss();
      },
      error: async err => {
        await this.loadingService.dimiss();
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.durationSub?.unsubscribe();
    this.waveSurfer?.destroy();
  }

  async startRecording() {
    this.recording = true;
    this.isRecording = true;
    this.durationDisplay = "";
    this.waveSurfer?.destroy();
    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple"
    });
    await this.audioRecorderService.startRecording();
    this.durationSub = this.audioRecorderService.durationDisplay$.subscribe(value => {
      this.durationDisplay = value;
    });
  }

  async stopRecording() {
    this.recording = false;
    const audioBlob = await this.audioRecorderService.stopRecording();
    this.audioBase64 = await this.audioRecorderService.blobToBase64(audioBlob);
    this.uuid = uuidv4();
    this.isnewRecording = true;

    this.audioRecording = new File([audioBlob], this.audioRecorderService.fileName, {type: "audio/mp3"});
    this.blobUrl = URL.createObjectURL(audioBlob);
    this.waveSurfer?.load(this.blobUrl);
  }

  playRecordingAgain() {
    if (this.waveSurfer && this.blobUrl) {
      this.waveSurfer.playPause();
    }
  }

  async makeDeclaration() {
    let body: any = {
      internal_id: this.internal.id,
      audio_report: {
        client_uuid: this.uuid,
        recorded_at: Date.now(),
        note: this.note
      }
    };

    if (this.audioRecording) {
      body.audio_report["audio_base64"] = this.audioBase64;
    }

    await this.loadingService.present(this.loadingMessage);
    return new Promise((resolve, reject) => {
      this.missionService.createMissionReturn(body).subscribe({
        next: async data => {
          await this.loadingService.dimiss();
          resolve(data);
        },
        error: async error => {
          await this.loadingService.dimiss();
          console.error(error);
          reject(error);
        }
      });
    });
  }

  createWaves() {
    this.waveSurfer?.destroy();
    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
      normalize: true
    });
  }

  async goToReturnRecurringMissionAgentModal() {
    if (this.isnewRecording) {
      await this.makeDeclaration();
    }

    const modal = await this.modalController.create({
      component: ReturnRecurringMissionAgentModalPage,
      cssClass: "materials-modal",
      componentProps: {data: this.planning, internal_id: this.internal.id}
    });

    modal.onDidDismiss().then(result => {
      this.isnewRecording = false;
    });
    return await modal.present();
  }

  goBack() {
    this.location.back();
  }
}
