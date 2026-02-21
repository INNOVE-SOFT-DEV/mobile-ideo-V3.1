import {Component, ElementRef, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LoadingControllerService} from "../../../widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import {environment} from "src/environments/environment";
import {ActionSheetController, LoadingController, ModalController} from "@ionic/angular";
import {MissionReturnsPage} from "src/app/widgets/modals/mission-returns/mission-returns.page";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {MapService} from "src/app/widgets/map/map.service";
import {GdcPage} from "src/app/widgets/modals/gdc/gdc.page";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {Ocr} from "@capacitor-community/image-to-text";
import {OcrService} from "../../ocr-scanner/ocr-service/ocr.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {OcrScannerPage} from "../../ocr-scanner/ocr-scanner.page";
import {ChatService} from "src/app/tab2/chatService/chat.service";
import {trigger, state, style, transition, animate} from "@angular/animations";
import { Network } from "@capacitor/network";
import { PhotoReportService } from "../../missions/agents/photo-report/service/photo-report.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
  standalone: false,

  animations: [
    trigger("rotateSvg", [
      state(
        "default",
        style({
          transform: "rotate(0deg)"
        })
      ),
      state(
        "rotated",
        style({
          transform: "rotate(360deg)"
        })
      ),
      transition("default => rotated", animate("400ms ease-out")),
      transition("rotated => default", animate("0ms"))
    ])
  ]
})
export class DetailsPage implements OnInit {
  planning: any;
  planningType: string = "";
  loadingMessage: string = "";
  isArray: Function = Array.isArray;
  urlApi: string = environment.urlAPI;
  webUrl: string = environment.url_web;
  supervisors: any[] = [];
  extractedText: string = "";
  loading: boolean = false;
  imageUrl: string | any = null;
  detectedTexts: string[] = [];
  generatedJson: any = {};
  agent: any;
  hasSubcontractor: boolean = false;
  svgRotationState: Record<string, "default" | "rotated"> = {};
  address: string = "";
  connected: boolean | null = null;
  timestamp : number = new Date().getTime();
  reportStatus: string = "";
   statusColorMap : Record<string, string> = {
  green: "#2ecc71",
  orange: "#f39c12",
  red: "#e74c3c",
};
 iconFill :string =
  this.reportStatus && this.statusColorMap[this.reportStatus]
    ? this.statusColorMap[this.reportStatus]
    : "#00a2e1"; // { path: '', pathMatch: 'full', redirectTo: '
    // ' },
  private subscription!: Subscription;
  

  constructor(
    private loadingService: LoadingControllerService,
    public translateService: TranslateService,
    private modalController: ModalController,
    private router: Router,
    private missionService: MissionService,
    private mapService: MapService,
    private actionSheetCtrl: ActionSheetController,
    private location: Location,
    private ocrService: OcrService,
    private toast: ToastControllerService,
    private modalCtrl: ModalController,
    private chatService: ChatService,
    private el: ElementRef,
    private reportService: PhotoReportService

  ) {}

  async ngOnInit() {
        Network.getStatus().then(status => {
      this.connected = status.connected;
    });
    this.subscription = this.reportService.data$.subscribe(data => {
      this.reportStatus = data;
      this.iconFill = this.getReportColor();
    });
    
 
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    try {
      await this.refreshLocalData();
      this.supervisors = this.planning.supervisors || [];
      this.hasSubcontractor = this.planning.team.some((member: any) => member.manager);

      this.setupPhotos();
    } catch (error) {
      console.error("Erreur lors du chargement des détails :", error);
    } finally {
      await this.refreshLocalData();

      const address: any = this.planning.intervention.address;
      this.address = this.planning.intervention.address;

      this.address = [ address.street,address.postal_code, address.city, address.country]
        .filter(v => v && v.toString().trim() !== "") // remove null, undefined, or empty strings
        .join(", ");
    }

    
  }

  setupPhotos() {
    if (this.planning != null) this.planning.info_photos?.length > 0 ? (this.planning.has_info_photo = true) : (this.planning.has_info_photo = false);
  }

  getReportColor(): string {
  if (!this.connected) {
    return '#00a2e1'; // blue
  }
  
  switch(this.reportStatus) {
    case 'green':
      return '#39c491'; // green
    case 'red':
      return '#FF605C'; // red
    case 'orange':
      return '#FFBD44'; // orange
    default:
      return '#00a2e1'; // blue (fallback)
  }
}



  async refreshLocalData() {
    this.timestamp = new Date().getTime();

    const cached = await JSON.parse(localStorage.getItem("currentPlanning")!);
    this.planning = cached.planning;
    this.planningType = cached.planningType;
    this.supervisors = this.planning.supervisors || [];
    this.setupPhotos();
    const user_v3: any = JSON.parse(localStorage.getItem("user-v3") || "{}");
    this.agent = this.planning.team.find((user: any) => user.id == user_v3.id);
    
    
    if(this.connected) {
      this.reportService.data = {
        planning: this.planning,
        planningType: this.planningType
      }
      await this.reportService.updatePhotoReportStatus();
      
      
    }
    

    await this.loadingService.dimiss();
  }

   countValidPhotos (data :any) {
  let count = 0;

  // photos_truck
  if (Array.isArray(data.photos_truck)) {
    count += data.photos_truck.filter(
      (p:any) => typeof p.url === "string" && p.url.trim() !== ""
    ).length;
  }

  // grouped_presentation_photos
  if (Array.isArray(data.grouped_presentation_photos)) {
    data.grouped_presentation_photos.forEach((group:any) => {
      if (Array.isArray(group)) {
        count += group.filter(
          (p:any) =>
            p.photo &&
            typeof p.photo.url === "string" &&
            p.photo.url.trim() !== ""
        ).length;
      }
    });
  }

  return count;
};


  transform(): string {
    let frenchDate: string = "";
    if (this.planning?.today_schedule?.date) {
      const date = new Date(this.planning?.today_schedule?.date);
      frenchDate = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }
    return frenchDate;
  }

  async missionReturns() {
    if (this.planningType === "regular") {
      this.router.navigate(["/return-recurring-mission-agent", {data: JSON.stringify(this.planning), type: this.planningType}]);
      return;
    }
    const modal = await this.modalController.create({
      component: MissionReturnsPage,
      cssClass: "mission-returns-page",
      animated: true,
      showBackdrop: true,
      componentProps: {planning: this.planning}
    });
    return await modal.present();
  }
  changeVehicle() {
    // this.router.navigate(["change-vehicle", {data: JSON.stringify(this.planning), type: this.planningType}]);
  }

  pointage() {
    this.router.navigate(["/pointage", {data: JSON.stringify(this.planning), type: this.planningType}]);
  }

  goBack() {
    this.missionService.refreshEvent.emit("details");
    this.location.back();
  }

  photoReport() {
    this.router.navigate(["photo-report", {data: JSON.stringify(this.planning), type: this.planningType}]);
  }

  direction() {
    const address: any = this.planning.intervention.address;

    this.mapService.address = [address.postal_code, address.street, address.complement, address.city, address.country]
      .filter(v => v && v.toString().trim() !== "") // remove null, undefined, or empty strings
      .join(", ");
    this.mapService.longitude = this.planning?.intervention?.address.longitude;
    this.mapService.latitude = this.planning?.intervention?.address.latitude;
    this.mapService.direction();
  }

  createTicket() {
    // this.router.navigate(["/add-ticket", {data: JSON.stringify(this.planning), type: this.planningType}]);
  }

  async gdc() {
    const modal = await this.modalController.create({
      component: GdcPage,
      cssClass: "mission-returns-page",
      animated: true,
      showBackdrop: true
    });
    return await modal.present();
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

      const result: any = await Ocr.detectText({filename: photo.path});
      this.detectedTexts = result.textDetections.map((d: any) => d.text);
      this.extractedText = this.detectedTexts.join(" | ");
      const formData = new FormData();
      formData.append("extracted_text", this.extractedText);
      formData.append("image", blob, new Date().getTime() + ".jpg");
      formData.append("schedule_id", this.planning.today_schedule.id);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      formData.append("user_id", user.id); // Example user ID
      await this.loadingService.present("analyse de reçu...");
      this.ocrService.extractText(formData).subscribe({
        next: async (res: any) => {
          await this.loadingService.dimiss();
          this.generatedJson = res.data || {};

          await this.toast.presentToast("Reçu scanné avec succès", "success");
          const modal = await this.modalCtrl.create({
            component: OcrScannerPage,
            componentProps: {
              result: res // Pass full response here
            }
          });
          modal.onDidDismiss().then(async result => {
            if (result.role === "confirm") {
              // Handle confirmed data if needed
              await this.loadingService.dimiss();
            }
          });
          await modal.present();
        },
        error: async err => {
          await this.toast.presentToast("Une erreur s'est produite", "danger");
          await this.loadingService.dimiss();
        }
      });
    } catch (error) {
      console.error("OCR Error:", error);
    }
  }
  ngAfterViewInit() {
    const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".custom-block"));

    // Randomize order
    const shuffled = blocks.sort(() => Math.random() - 0.5);

    shuffled.forEach((block, index) => {
      setTimeout(() => {
        block.classList.add("animate__animated", "animate__bubbleIn");
        block.style.opacity = "1";
        block.style.animationDuration = "700ms";
      }, index * 120); // stagger delay
    });
  }
}
