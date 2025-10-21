import {Component, OnInit, ViewChild, ElementRef, Input} from "@angular/core";
import {ActionSheetController, ModalController} from "@ionic/angular";
import {VehicleConfirmationPage} from "src/app/widgets/modals/missions/agents/vehicle-confirmation/vehicle-confirmation.page";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import WaveSurfer from "wavesurfer.js";
import {Subscription} from "rxjs";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {PhotosService} from "src/app/widgets/photos/photos.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-vehicle-allocation",
  templateUrl: "./vehicle-allocation.page.html",
  styleUrls: ["./vehicle-allocation.page.scss"],
  standalone: false
})
export class VehicleAllocationPage implements OnInit {
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
    this.openModal();
    this.currentVehicule = [this.data.teamMember.vehicule.id, this.data.teamMember.vehicule.name, this.data.teamMember.vehicule.driver_id];
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
      this.planningType = this.data.teamMember.planning_punctual_agent_id != null ? "punctual" : "forfaitaire";
      this.images = (await JSON.parse(localStorage.getItem(`images_${this.planningType}_${this.data.planning.id}_first`)!)) || [];
      this.voice = (await JSON.parse(localStorage.getItem(`voice_${this.planningType}_${this.data.planning.id}_first`)!)) || {};
      if (this.confimState == false) {
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
      } else {
        await this.loadingService.dimiss();
      }
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
    if (!verified?.pickedVehicule && !this.confimState) {
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
    this.missionService.createFirstVehiculeReturn(uploadData).subscribe({
      next: async value => {
        this.images = value;
        this.isCloseButtonDisabled = true;
        await this.loadingService.dimiss();
        localStorage.setItem(`images_${this.planningType}_${this.data.planning.id}_first`, JSON.stringify(value));
        localStorage.setItem(`last_return_id`, JSON.stringify(value[0]?.return_id));
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
    uploadData.append("initial_material_id", this.currentVehicule[0]);
    uploadData.append("is_changed", this.confimState == true ? "false" : "true");
    uploadData.append("date", new Date() + "");
    if (this.confimState == true) uploadData.append("material_id", this.currentVehicule[0]);
    else uploadData.append("material_id", this.pickedVehicule[0]);

    if (this.planningType == "forfaitaire") {
      uploadData.append("agent_material_id", this.data.teamMember.agent_material_id);
      uploadData.append("forfaitaire_item_id", this.data.planning.forfaitaire_item_id);
    }
    if (this.planningType == "punctual") uploadData.append("planning_punctual_id", this.data.planning.id);
    if (!this.data.teamMember.vehicule_returns) uploadData.append("return_type", "first");
    return uploadData;
  }

  async saveVoiceToApi() {
    const verified: any = this.verifyForm();
    if (!verified.pickedVehicule && !this.confimState) {
      await this.toastCtrl.presentToast("Sélecionner une vehicule", "danger");
    } else if (!verified.hasVoice && !verified.hasImages && !this.confimState) {
      await this.toastCtrl.presentToast("Veuillez ajouter au moins une photo ou un message vocal.", "danger");
    } else {
      const uploadData = this.createFormData();
      if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
      await this.loadingService.present(this.loadingMessage);
      this.missionService.createFirstVehiculeReturn(uploadData).subscribe({
        next: async value => {
          await this.loadingService.dimiss();
          this.dismiss("fetch");
          localStorage.setItem(`last_return_id`, JSON.stringify(value.id));
          localStorage.setItem(`voice_${this.planningType}_${this.data.planning.id}_first`, JSON.stringify(value));
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
        localStorage.setItem(`images_${this.planningType}_${this.data.planning.id}_first`, JSON.stringify(this.images));
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
