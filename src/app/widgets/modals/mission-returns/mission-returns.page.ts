import {Component, OnInit, OnDestroy, Input} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import WaveSurfer from "wavesurfer.js";
import {Subscription} from "rxjs";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import {ToastControllerService} from "../../toast-controller/toast-controller.service";
import {v4 as uuidv4} from "uuid";
import {Preferences} from "@capacitor/preferences";

@Component({
  selector: "app-mission-returns",
  templateUrl: "./mission-returns.page.html",
  styleUrls: ["./mission-returns.page.scss"],
  standalone: false
})
export class MissionReturnsPage implements OnInit, OnDestroy {
  @Input() planning: any;
  recording: boolean = false;
  isRecording: boolean = false;
  durationDisplay: string = "";
  waveSurfer?: WaveSurfer;
  audioRecording?: Blob;
  blobUrl?: string;
  replanification: boolean = false;
  truckToEmpty: boolean = false;
  agentAbsence: boolean = false;
  accident: boolean = false;
  important: boolean = false;
  returnTypes: string[] = [];
  isSubmitted: boolean = false;
  returnTime: string = "";
  base64Audio: string = "";
  uuid: string = "";
  user_v3 = JSON.parse(localStorage.getItem("user-v3") || "{}");
  internal: any;

  private durationSub?: Subscription;
  loadingMessage: string = "";

  constructor(
    private modalController: ModalController,
    private audioRecorderService: AudioRecorderService,
    private missionService: MissionService,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private toastCtrl: ToastControllerService
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    // this.user_v3 = JSON.parse(localStorage.getItem("user-v3") || "{}");
    this.internal = this.planning.team.find((u: any) => u.id === this.user_v3.id).pointing_internal[0];
    this.getReturns();
  }

  ngOnDestroy(): void {
    this.durationSub?.unsubscribe();
    this.waveSurfer?.destroy();
  }

  dismiss() {
    this.modalController.dismiss();
  }
  selectReason(reason: string) {
    switch (reason) {
      case "rescheduling":
        this.replanification = !this.replanification;
        this.updateReturnTypes(reason, this.replanification);
        break;
      case "empty_truck":
        this.truckToEmpty = !this.truckToEmpty;
        this.updateReturnTypes(reason, this.truckToEmpty);
        break;
      case "agent_absence":
        this.agentAbsence = !this.agentAbsence;
        this.updateReturnTypes(reason, this.agentAbsence);
        break;
      case "accident":
        this.accident = !this.accident;
        this.updateReturnTypes(reason, this.accident);
        break;
    }
  }

  updateReturnTypes(reason: string, isSelected: boolean) {
    const index = this.returnTypes.indexOf(reason);
    if (isSelected && index === -1) {
      this.returnTypes.push(reason);
    } else if (!isSelected && index !== -1) {
      this.returnTypes.splice(index, 1);
    }
  }

  selectImportance(value: boolean) {
    this.important = value;
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

  async createMissionReturn() {
    if (this.returnTypes.length == 0 && !this.audioRecording) {
      await this.toastCtrl.presentToast("Veuillez choisir le type de retour ou bien d'enregistrer un message audio", "danger");
    }
    if ((this.returnTypes.length > 0 || this.audioRecording) && this.isSubmitted == false) {
      let body: any = {
        internal_id: this.internal.id,
        audio_report: {
          return_types: this.returnTypes,
          client_uuid: this.uuid,
          important: this.important,
          recorded_at: Date.now()
        }
      };
      if (this.audioRecording) {
        body["audio_report"]["audio_base64"] = this.base64Audio;
      }

      // uploadData.append("return_type", this.returnTypes.join(","));

      // uploadData.append("return_type", this.returnTypes.join(","));

      // this.isSubmitted = true;
      // await this.loadingService.present(this.loadingMessage);
      this.missionService.createMissionReturn(body).subscribe({
        next: async data => {
          //   console.log(data);
          //   await Preferences.set({
          //   key: "forfaitaires_agent",
          //   value: JSON.stringify(data)
          // });
          // return data;

          await this.toastCtrl.presentToast("Votre demande a été envoyé avec succés", "success");
          await this.loadingService.dimiss();
          this.dismiss();
        },
        error: async error => {
          await this.loadingService.dimiss();
          console.error(error);
        }
      });
    }
  }

  createWaves() {
    this.waveSurfer?.destroy();
    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple"
    });
  }

  setReturnTypes(object: any) {
    if (object.return_types?.length > 0) {
      object.return_types.includes("empty_truck") ? (this.truckToEmpty = true) : null;
      object.return_types.includes("accident") ? (this.accident = true) : null;
      object.return_types.includes("rescheduling") ? (this.replanification = true) : null;
      object.return_types.includes("agent_absence") ? (this.agentAbsence = true) : null;
    }
  }

  async getReturns() {
    await this.loadingService.present(this.loadingMessage);
    this.missionService.getMissionReturnAudio(this.internal.id).subscribe({
      next: async value => {
        this.setReturnTypes(value);
        this.important = value.important;
        if (value.audio_url) {
          this.blobUrl = value.audio_url;
          this.isRecording = true;
          await this.loadingService.dimiss();
          this.createWaves();
          this.waveSurfer?.load(value.audio_url.url);
        }
        await this.loadingService.dimiss();
      },
      error: async err => {
        await this.loadingService.dimiss();
        console.error(err);
      }
    });
  }

  playRecordingAgain() {
    if (this.waveSurfer && this.blobUrl) {
      this.waveSurfer.playPause();
    }
  }
}
