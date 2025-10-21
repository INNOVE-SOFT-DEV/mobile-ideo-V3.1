import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {ModalController, ActionSheetController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {PhotosService} from "src/app/widgets/photos/photos.service";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {VehicleConfirmationPage} from "../vehicle-confirmation/vehicle-confirmation.page";
import WaveSurfer from "wavesurfer.js";

@Component({
  selector: "app-get-vehicule",
  templateUrl: "./get-vehicule.page.html",
  styleUrls: ["./get-vehicule.page.scss"],
  standalone: false
})
export class GetVehiculePage implements OnInit {
  images: any[] = [];
  @ViewChild("fileInput") fileInputRef!: ElementRef<HTMLInputElement>;
  @Input() data: any;
  recording: boolean = false;
  isRecording: boolean = false;
  durationDisplay: string = "";
  waveSurfer?: WaveSurfer;
  audioRecording?: File;
  blobUrl?: string;
  confimState: Boolean | null = null;
  freeVehicules: any[] = [];
  pickedVehicule: any = null;
  currentVehicule: any;
  planningType: string = "";
  voice: any;
  isCloseButtonDisabled: boolean = false;
  private durationSub?: Subscription;
  loadingMessage: any;
  photoTodelete: any;
  initialIndexPhoto: number = 0;
  public alertButtons = [
    {
      text: "Annuler",
      role: "cancel",
      handler: () => {}
    },
    {
      text: "Supprimer",
      role: "confirm",
      handler: async () => {
        this.deletePhoto(this.photoTodelete.image.return_id, this.photoTodelete.image.url.split("/")[this.photoTodelete.image.url.split("/").length - 1]);
      }
    }
  ];
  isAlertOpen: boolean = false;
  isSliderOpen: boolean = false;

  constructor(
    private modalController: ModalController,
    private audioRecorderService: AudioRecorderService,
    private missionService: MissionService,
    private actionSheetCtrl: ActionSheetController,
    private photosService: PhotosService,
    private toastCtrl: ToastControllerService,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService
  ) {}
  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.planningType = this.data.teamMember?.planning_punctual_agent_id != null ? "punctual" : "forfaitaire";
    this.missionService.getFreeVehicules(this.data.planning.id, this.planningType, this.data.teamMember.id).subscribe({
      next: async value => {
        this.freeVehicules = value;
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
  dismiss(type: string) {
    if (this.isSliderOpen) {
      this.isSliderOpen = false;
    } else {
      this.modalController.dismiss(type);
    }
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: VehicleConfirmationPage,
      cssClass: "custom-centered-modal",
      backdropDismiss: true,
      componentProps: {data: {planning: this.data.planning, teamMember: this.data.teamMember}}
    });
    modal.onDidDismiss().then(async result => {
      result.data == "Yes" ? (this.confimState = true) : (this.confimState = false);
    });
    await modal.present();
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
    this.audioRecording = new File([audioBlob], this.audioRecorderService.fileName, {type: "audio/mp3"});
    this.blobUrl = URL.createObjectURL(audioBlob);
    this.waveSurfer?.load(this.blobUrl);
  }

  playRecordingAgain() {
    if (this.waveSurfer && this.blobUrl) {
      this.waveSurfer.playPause();
    }
  }
  async triggerFileInput() {
    await this.takePicture();
  }

  verifyForm() {
    const verified = {hasImages: false, pickedVehicule: false, hasVoice: false};
    if (this.images.length > 0) verified.hasImages = true;
    if (this.pickedVehicule != null) verified.pickedVehicule = true;
    if (this.audioRecording) verified.hasVoice = true;
    return verified;
  }

  async takePicture() {
    const verified: any = this.verifyForm();
    if (!verified?.pickedVehicule) {
      await this.toastCtrl.presentToast("Sélecionner une vehicule", "danger");
    } else {
      const actionSheet = await this.actionSheetCtrl.create({
        header: "Choisir option :",
        cssClass: "header_actionSheet",
        buttons: [
          {
            text: "Camera",
            cssClass: "btn_actionSheet",
            handler: async () => {
              await this.photosService.takePictureOption("Camera", 40);
              await this.sendImageToApi();
            }
          },
          {
            text: "Galerie",
            cssClass: "btn_actionSheet",
            handler: async () => {
              await this.photosService.takePictureOption("Galerie", 40);
              await this.sendImageToApi();
            }
          },
          {
            text: "Annuler",
            cssClass: "btn_actionSheet",
            handler: () => {}
          }
        ]
      });
      await actionSheet.present();
    }
  }

  async sendImageToApi() {
    const fileName = new Date().getTime() + ".jpeg";
    const base64Data = this.photosService.lastImage.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    const uploadData = this.createFormData();
    uploadData.append("photo", blob, fileName);
    uploadData.append("photo_type", "return_vehicule");
    await this.loadingService.present(this.loadingMessage);
    this.missionService.agentGetVehicule(uploadData).subscribe({
      next: async value => {
        this.images = value?.mobile_photos;
        this.isCloseButtonDisabled = true;
        await this.loadingService.dimiss();
        localStorage.setItem(`images_${this.planningType}_${this.data.planning.id}_agent_get_vehicule`, JSON.stringify(value?.mobile_photos));
        localStorage.setItem(`last_return_id`, JSON.stringify(value?.mobile_photos[0]?.return_id));
        const cachedPlanning: any = await JSON.parse(localStorage.getItem("currentPlanning")!);
        cachedPlanning.planning.team.find((u: any) => u.id === this.data.teamMember.id).vehicule = value.vehicule;
        localStorage.setItem("currentPlanning", JSON.stringify(cachedPlanning));
      },
      error: async err => {
        await this.loadingService.dimiss();
        console.error(err);
      }
    });
  }

  createFormData() {
    const uploadData = new FormData();
    uploadData.append("user_id", this.data.teamMember.id);
    uploadData.append("material_id", this.pickedVehicule[0]);
    uploadData.append("initial_material_id", this.pickedVehicule[0]);
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "true");
    uploadData.append("return_type", "get_vehicule");
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1] + ""
    );
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);

    if (this.planningType == "forfaitaire") {
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("f_agent_id", this.data.teamMember.forfaitaire_agent_id);
    }
    return uploadData;
  }

  async saveVoiceToApi() {
    const verified: any = this.verifyForm();
    if (!verified.pickedVehicule) {
      await this.toastCtrl.presentToast("Sélecionner une vehicule", "danger");
    }
    {
      const uploadData = this.createFormData();
      if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
      await this.loadingService.present(this.loadingMessage);
      this.missionService.agentGetVehicule(uploadData).subscribe({
        next: async value => {
          await this.loadingService.dimiss();
          localStorage.setItem(`last_return_id`, JSON.stringify(value.id));
          localStorage.setItem(`voice_${this.planningType}_${this.data.planning.id}_agent_get_vehicule`, JSON.stringify(value));
          const cachedPlanning: any = await JSON.parse(localStorage.getItem("currentPlanning")!);
          cachedPlanning.planning.team.find((u: any) => u.id === this.data.teamMember.id).vehicule = value.vehicule;
          localStorage.setItem("currentPlanning", JSON.stringify(cachedPlanning));
          this.dismiss("fetch");
        },
        error: async err => {
          await this.loadingService.dimiss();
          console.error(err);
        }
      });
    }
  }
  async deletePhoto(returnId: number, fileName: string) {
    this.missionService.deleteVehiculeReturnPhoto(returnId, fileName).subscribe({
      next: async value => {
        this.images.splice(this.photoTodelete.index, 1);
        localStorage.setItem(`images_${this.planningType}_${this.data.planning.id}_agent_get_vehicule`, JSON.stringify(this.images));
      },
      error: err => {
        console.error(err);
      }
    });
  }

  setTodelete(i: number, image: any) {
    this.photoTodelete = {index: i, image};
    this.isAlertOpen = true;
  }

  openSlides(i: number) {
    this.initialIndexPhoto = i;
    this.isSliderOpen = true;
  }
}
