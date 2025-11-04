import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Router} from "@angular/router";
import {Ocr} from "@capacitor-community/image-to-text";
import {CameraSource, Camera, CameraResultType} from "@capacitor/camera";
import {ActionSheetController, ModalController} from "@ionic/angular";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {OcrScannerPage} from "src/app/pages/ocr-scanner/ocr-scanner.page";
import {OcrService} from "src/app/pages/ocr-scanner/ocr-service/ocr.service";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import {ToastControllerService} from "../../toast-controller/toast-controller.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  standalone: false
})
export class MainComponent implements OnInit {
  @Input() counts: any;
  user = this.authService.getCurrentUser();
    imageUrl: string | any = null;
  detectedTexts: string[] = [];
  generatedJson: any = {};
    extractedText: string = "";


  constructor(
    private router: Router,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingControllerService,
    private ocrService: OcrService,
    private toast: ToastControllerService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  goSuperVisorAbsences() {
    this.router.navigate(["absence-supervisor"]);
  }
  goSuperVisorMaterials() {
    this.router.navigate(["materials-requests-supervisor"]);
  }

  goSuperVisorMissions() {
    this.router.navigate(["missions"], {
      state: {counts: this.counts}
    });
  }

  documents() {
    this.router.navigate(["/documents-supervisor"]);
  }

  vehicules() {
    this.router.navigate(["/vehicules"]);
  }

  placementOfAgents() {
    this.router.navigate(["/placement-of-agents"]);
  }
  goSuperVisorAgentMissions() {
    this.router.navigate(["supervisor-plannings"], {
      state: {counts: this.counts}
    });
  }

  goTickets() {
    this.router.navigate(["task-list"]);
  }

  async chooseSource() {
    const sheet = await this.actionSheetCtrl.create({
      header: "Select Image Source",
      buttons: [
        {
          text: "📷 Camera",
          handler: () => this.takePhoto(CameraSource.Camera)
        },
        {
          text: "🖼️ Gallery",
          handler: () => this.takePhoto(CameraSource.Photos)
        },
        {text: "Cancel", role: "cancel"}
      ]
    });

    await sheet.present();
  }

  async takePhoto(source: CameraSource) {
    try {
      const photo: any = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source
      });
      if (!photo.path && !photo.webPath) return;

      this.imageUrl = photo.webPath || photo.path;
      const response = await fetch(this.imageUrl);
      const blob = await response.blob();

      await this.loadingCtrl.present("analyse de reçu...");
      const result: any = await Ocr.detectText({filename: photo.path});
      this.detectedTexts = result.textDetections.map((d: any) => d.text);
      this.extractedText = this.detectedTexts.join(" | ");
      const formData = new FormData();
      formData.append("extracted_text", this.extractedText);
      formData.append("image", blob, new Date().getTime() + ".jpg");
      formData.append("planning_id", "-");
      formData.append("planning_type", "-");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      formData.append("user_id", user.id); // Example user ID
      this.ocrService.extractText(formData).subscribe({
        next: async (res: any) => {
          this.generatedJson = res.data || {};
          await this.loadingCtrl.dimiss();
          await this.toast.presentToast("Reçu scanné avec succès", "success");
          const modal = await this.modalCtrl.create({
            component: OcrScannerPage,
            componentProps: {
              result: res // Pass full response here
            }
          });
          await modal.present();
        },
        error: async err => {
          await this.toast.presentToast("Une erreur s'est produite", "danger");
          await this.loadingCtrl.dimiss();
        }
      });

      // await loading.dismiss();
    } catch (error) {
      console.error("OCR Error:", error);
    }
  }
}
