import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionSheetController, LoadingController, ModalController, PopoverController} from "@ionic/angular";
import {MissionReturnsSupervisorPage} from "src/app/widgets/modals/mission-returns-supervisor/mission-returns-supervisor.page";
import {GdcPage} from "src/app/widgets/modals/gdc/gdc.page";
import {MapService} from "src/app/widgets/map/map.service";
import {TicketService} from "src/app/pages/tickets/ticket.service";
import {Ocr} from "@capacitor-community/image-to-text";
import {CameraSource, Camera, CameraResultType} from "@capacitor/camera";
import {OcrScannerPage} from "src/app/pages/ocr-scanner/ocr-scanner.page";
import {OcrService} from "src/app/pages/ocr-scanner/ocr-service/ocr.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {AfterViewInit, ElementRef} from "@angular/core";
import {ConfirmAbsentPage} from "src/app/widgets/modals/confirm-absent/confirm-absent.page";
import {trigger, style, animate, transition} from "@angular/animations";

@Component({
  animations: [
    trigger("fadeUp", [transition(":enter", [style({opacity: 0, transform: "translateY(15px)"}), animate("300ms ease-out", style({opacity: 1, transform: "translateY(0)"}))])])
  ],
  selector: "app-menu-mession",
  templateUrl: "./menu-mession.page.html",
  styleUrls: ["./menu-mession.page.scss"],
  standalone: false
})
export class MenuMessionPage implements OnInit {
  planning: any = {};
  planningType: string = "";
  supervisors: any[] = [];
  kanban: any;
  extractedText: string = "";
  loading: boolean = false;
  imageUrl: string | any = null;
  detectedTexts: string[] = [];
  generatedJson: any = {};
  user: any = JSON.parse(localStorage.getItem("user") || "{}");

  address: string = "";
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private mapService: MapService,
    private taskmanagerService: TicketService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingControllerService,
    private ocrService: OcrService,
    private toast: ToastControllerService,
    private modalCtrl: ModalController,
    private el: ElementRef,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    const data = JSON.parse(this.route.snapshot.paramMap.get("data")!) || {};
    this.planning = data;
    this.supervisors = this.planning?.supervisors || [];
    `${this.planning?.intervention?.address.postal_code},  ${this.planning?.intervention?.address.street},  ${this.planning?.intervention?.address.city} , ${this.planning?.intervention?.address.country}`;
    // this.supervisors = JSON.parse(this.route.snapshot.paramMap.get("supervisors")!) || [];
    this.planningType = data.type || "";
    // this.taskmanagerService.getAllTasksByKanban("superviseur mobile", this.user.email).subscribe((res: any) => {
    //   this.kanban = res.kanban;

    // });

    const address: any = this.planning.intervention.address;
    this.address = this.planning.intervention.address;

    this.address =[ address.street,address.postal_code, address.city, address.country]
      .filter(v => v && v.toString().trim() !== "") // remove null, undefined, or empty strings
      .join(", ");
  }

  createTicket() {
    this.router.navigate(["/add-ticket", {data: JSON.stringify(this.planning), type: this.planningType, kanban: JSON.stringify(this.kanban)}]);
  }

  async missionReturns() {
    if (this.planningType === "regular") {
      this.router.navigate(["/return-recurring-mission", {data: JSON.stringify(this.planning), type: this.planningType}]);
      return;
    }
    const modal = await this.modalController.create({
      component: MissionReturnsSupervisorPage,
      cssClass: "mission-returns-page",
      animated: true,
      showBackdrop: true,
      componentProps: {planning: this.planning}
    });
    return await modal.present();
  }
  reportsPhotos() {
    this.router.navigate(["/reports-photos", {data: JSON.stringify(this.planning), type: this.planningType}]);
  }

  pointages() {
    this.router.navigate(["/pointages", {data: JSON.stringify(this.planning), type: this.planningType}]);
  }

  goBack() {
    this.location.back();
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

  openVehiculeReturn() {
    this.router.navigate(["/see-vehicule-by-planning", {data: JSON.stringify(this.planning), type: this.planningType}]);
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
  async notice(agent: any) {
    console.log(agent);
    const popover = await this.popoverController.create({
      component: ConfirmAbsentPage,
      componentProps: {
        // Pass data to the component here
        agent: agent
      },
      translucent: true,
      cssClass: "popover"
    });

    popover.onDidDismiss().then(data => {
      console.log(data);
      if (data?.data?.confirmed) {
        console.log("====> call api and toast success or error");
      } else {
        console.log("====> user cancled");
      }
    });

    return await popover.present();
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
      formData.append("schedule_id", this.planning.today_schedule.id);
      const user = JSON.parse(localStorage.getItem("user-v3") || "{}");
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
