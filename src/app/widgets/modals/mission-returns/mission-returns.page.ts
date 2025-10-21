import {Component, OnInit, OnDestroy, Input} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import WaveSurfer from "wavesurfer.js";
import {Subscription} from "rxjs";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import {ToastControllerService} from "../../toast-controller/toast-controller.service";

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
    this.blobUrl = URL.createObjectURL(audioBlob);
    this.waveSurfer?.load(this.blobUrl);
  }

  async createMissionReturn() {
    if (this.returnTypes.length == 0 && !this.audioRecording) {
      await this.toastCtrl.presentToast("Veuillez choisir le type de retour ou bien d'enregistrer un message audio", "danger");
    }
    if ((this.returnTypes.length > 0 || this.audioRecording) && this.isSubmitted == false) {
      const uploadData = new FormData();
      if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
      uploadData.append("planning_punctual_id", this.planning.id);
      uploadData.append("important", this.important + "");
      uploadData.append("return_type", this.returnTypes.join(","));
      uploadData.append(
        "return_time",
        new Date()
          .toLocaleString("fr-FR", {
            timeZone: "Europe/Paris"
          })
          .split(" ")[1] + ""
      );
      uploadData.append("date", new Date() + "");
      this.isSubmitted = true;
      await this.loadingService.present(this.loadingMessage);
      this.missionService.createMissionReturn(uploadData).subscribe({
        next: async data => {
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
    object.return_type.includes("empty_truck") ? (this.truckToEmpty = true) : null;
    object.return_type.includes("accident") ? (this.accident = true) : null;
    object.return_type.includes("rescheduling") ? (this.replanification = true) : null;
    object.return_type.includes("agent_absence") ? (this.agentAbsence = true) : null;
  }

  async getReturns() {
    await this.loadingService.present(this.loadingMessage);
    this.missionService.getMissionReturnAudio(this.planning.id, "punctual").subscribe({
      next: async value => {
        if (value.length > 0) {
          this.setReturnTypes(value[0]);
          this.returnTime = value[0].return_time.split(":")[0] + ":" + value[0].return_time.split(":")[1];
          this.important = value[0].important;
          this.blobUrl = value[0].file.url;
          this.isRecording = true;
          await this.loadingService.dimiss();
          this.createWaves();
          this.waveSurfer?.load(value[0].file.url);
        } else {
          this.missionService.getMissionReturn(this.planning.id, "punctual").subscribe({
            next: async value => {
              if (value.length > 0) {
                this.returnTime = value[0].return_time.split(":")[0] + ":" + value[0].return_time.split(":")[1];
                this.important = value[0].important;
                this.setReturnTypes(value[0]);
              }

              await this.loadingService.dimiss();
            },
            error: async err => {
              await this.loadingService.dimiss();
              console.error(err);
            }
          });
        }
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
