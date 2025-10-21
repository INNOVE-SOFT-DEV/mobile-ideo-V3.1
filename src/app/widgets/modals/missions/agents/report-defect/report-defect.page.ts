import {Component, OnInit, ViewChild, ElementRef, Input} from "@angular/core";
import {ActionSheetController, ModalController} from "@ionic/angular";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import WaveSurfer from "wavesurfer.js";
import {Subscription} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {PhotosService} from "src/app/widgets/photos/photos.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {environment} from "src/environments/environment";
@Component({
  selector: "app-report-defect",
  templateUrl: "./report-defect.page.html",
  styleUrls: ["./report-defect.page.scss"],
  standalone: false
})
export class ReportDefectPage implements OnInit {
  images: any[] = [];
  @ViewChild("fileInput") fileInputRef!: ElementRef<HTMLInputElement>;
  @Input() data: any;

  recording: boolean = false;
  isRecording: boolean = false;
  durationDisplay: string = "";
  waveSurfer?: WaveSurfer;
  audioRecording?: File;
  blobUrl?: string;
  private durationSub?: Subscription;
  loadingMessage: string = "";
  initialIndexPhoto: number = 0;
  isSliderOpen: boolean = false;
  photoTodelete: {index: number; image: any} = {index: 0, image: null};
  isAlertOpen: boolean = false;
  planningType: string = "";
  currentLocation: any;
  materials: any;
  note: string = "";
  createdNotFunctionalReturn: boolean = false;
  voice: any = {file: []};
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
  constructor(
    private modalController: ModalController,
    private audioRecorderService: AudioRecorderService,
    private actionSheetCtrl: ActionSheetController,
    private photosService: PhotosService,
    private toastCtrl: ToastControllerService,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService,
    private missionService: MissionService
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.planningType = this.data.teamMember.planning_punctual_agent_id != null ? "punctual" : "forfaitaire";
    this.materials = (await JSON.parse(localStorage.getItem(`materials_${this.planningType}_${this.data.planning.id}_has_issue`)!)) || {};
    this.images = (await JSON.parse(localStorage.getItem(`images_${this.planningType}_${this.data.planning.id}_has_issue`)!)) || [];
    this.voice = (await JSON.parse(localStorage.getItem(`voice_${this.planningType}_${this.data.planning.id}_has_issue`)!)) || {file: []};

    if (this.voice.file.length > 0) {
      const fileName = this.voice.file.find((f: any) => f.type == "has_issue")?.file_name;
      this.blobUrl = `${environment.urlAPI}uploads/mission_return_vehicule/audio/${fileName}`;
      this.isRecording = true;
      this.createWaves();
      this.waveSurfer?.load(this.blobUrl);
    }
  }
  ngOnDestroy(): void {
    this.durationSub?.unsubscribe();
    this.waveSurfer?.destroy();
  }
  dismiss(type: string) {
    if (this.isSliderOpen) {
      this.isSliderOpen = false;
    } else {
      if (this.createdNotFunctionalReturn) this.modalController.dismiss(type);
      else this.modalController.dismiss("");
    }
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

  createWaves() {
    this.waveSurfer?.destroy();
    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
      normalize: true
    });
  }

  verifyForm() {
    const verified = {hasImages: false, pickedVehicule: false, hasVoice: false};
    if (this.images.length > 0) verified.hasImages = true;
    if (this.audioRecording) verified.hasVoice = true;
    return verified;
  }
  async takePicture() {
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
    this.missionService.reportVehiculeDefect(uploadData).subscribe({
      next: async value => {
        this.createdNotFunctionalReturn = true;
        this.images = value?.mobile_photos;
        await this.loadingService.dimiss();
        localStorage.setItem(`images_${this.planningType}_${this.data.planning.id}_has_issue`, JSON.stringify(value?.mobile_photos));

        if (!this.materials.initial) {
          localStorage.setItem(
            `materials_${this.planningType}_${this.data.planning.id}_has_issue`,
            JSON.stringify({initial: this.data.teamMember.vehicule.id, final: this.data.teamMember.vehicule.id})
          );
        }
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
    uploadData.append("material_id", this.data.teamMember.vehicule.id);
    uploadData.append("date", new Date() + "");
    uploadData.append("is_changed", "false");
    uploadData.append("date", new Date() + "");
    uploadData.append("note", this.note);
    uploadData.append(
      "hour_start",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1]
    );
    const last = JSON.parse(localStorage.getItem("last_return_id")!);
    uploadData.append("last", last);
    uploadData.append("return_type", "has_issue");
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
    if (!verified.hasImages && !verified.hasVoice && this.note.length == 0) {
      await this.toastCtrl.presentToast("Veuillez ajouter au moins une photo ou un message vocal ou bien une note.", "danger");
    } else {
      const uploadData = this.createFormData();
      if (this.audioRecording) {
        let fileName = new Date().getTime() + ".wav";
        uploadData.append("file", this.audioRecording, fileName);
      }
      await this.loadingService.present(this.loadingMessage);
      this.missionService.reportVehiculeDefect(uploadData).subscribe({
        next: async value => {
          await this.loadingService.dimiss();
          localStorage.setItem(`voice_${this.planningType}_${this.data.planning.id}_has_issue`, JSON.stringify(value));

          if (this.note.length > 0) {
            localStorage.setItem(`text_note_${this.planningType}_${this.data.planning.id}`, this.note);
          }

          this.createdNotFunctionalReturn = true;
          this.dismiss("fetch01");
          this.missionService.refreshEvent.emit({missions: this.planningType, event: "fetch"});
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
        localStorage.setItem(`images_${this.planningType}_${this.data.planning.id}_has_issue`, JSON.stringify(this.images));
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
