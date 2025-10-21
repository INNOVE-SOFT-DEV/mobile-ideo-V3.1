import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingControllerService} from "../../../widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import {environment} from "src/environments/environment";
import {ModalController} from "@ionic/angular";
import {MissionReturnsPage} from "src/app/widgets/modals/mission-returns/mission-returns.page";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {MapService} from "src/app/widgets/map/map.service";
import {GdcPage} from "src/app/widgets/modals/gdc/gdc.page";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
  standalone: false
})
export class DetailsPage implements OnInit {
  planning: any;
  planningType: string = "";
  loadingMessage: string = "";
  isArray: Function = Array.isArray;
  urlApi: string = environment.urlAPI;
  webUrl: string = environment.url_web;
  supervisors: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingControllerService,
    public translateService: TranslateService,
    private location: Location,
    private modalController: ModalController,
    private router: Router,
    private missionService: MissionService,
    private mapService: MapService
  ) {}

  async ngOnInit() {
    this.supervisors = JSON.parse(this.route.snapshot.paramMap.get("supervisors")!) || [];
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    try {
      await this.refreshLocalData();
      this.setupPhotos();
    } catch (error) {
      console.error("Erreur lors du chargement des détails :", error);
    } finally {
      await this.refreshLocalData();
    }
  }

  setupPhotos() {
    if (this.planning != null) this.planning.info_photos?.length > 0 ? (this.planning.has_info_photo = true) : (this.planning.has_info_photo = false);
  }

  async refreshLocalData() {
    const cached = await JSON.parse(localStorage.getItem("currentPlanning")!);
    this.planning = cached.planning;
    this.planningType = cached.planningType;
    this.setupPhotos();
    await this.loadingService.dimiss();
  }

  transform(): string {
    let frenchDate: string = "";
    if (this.planning?.date) {
      const date = new Date(this.planning.date);
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
    this.router.navigate(["change-vehicle", {data: JSON.stringify(this.planning), type: this.planningType}]);
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
    this.mapService.address = this.planning.address;
    this.mapService.longitude = this.planning.long;
    this.mapService.latitude = this.planning.lat;
    this.mapService.direction();
  }

  createTicket() {
    this.router.navigate(["/add-ticket", {data: JSON.stringify(this.planning), type: this.planningType}]);
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
}
