import {Component, OnInit, SimpleChanges, OnChanges} from "@angular/core";
import {Location} from "@angular/common";
import {ModalController} from "@ionic/angular";
import {UnsuitableVehiclePage} from "src/app/widgets/modals/missions/agents/unsuitable-vehicle/unsuitable-vehicle.page";
import {NonRollingVehiclePage} from "src/app/widgets/modals/missions/agents/non-rolling-vehicle/non-rolling-vehicle.page";
import {ReportDefectPage} from "src/app/widgets/modals/missions/agents/report-defect/report-defect.page";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {ActivatedRoute} from "@angular/router";
import {GetVehiculePage} from "src/app/widgets/modals/missions/agents/get-vehicule/get-vehicule.page";
import {GeolocationService} from "src/app/widgets/geolocation/geolocation.service";
import {NotAroundIdeoPage} from "src/app/widgets/modals/missions/agents/not-around-ideo/not-around-ideo.page";
@Component({
  selector: "app-change-vehicle",
  templateUrl: "./change-vehicle.page.html",
  styleUrls: ["./change-vehicle.page.scss"],
  standalone: false
})
export class ChangeVehiclePage implements OnInit, OnChanges {
  currentPlanning: any;
  User: any;
  currentVehicule: any;
  planningType: string = "";
  data: any;
  hasVehicule: boolean = false;
  isAroundIdeo: boolean = false;
  constructor(
    private location: Location,
    private modalController: ModalController,
    private authService: AuthService,
    private route: ActivatedRoute,
    private geolocation: GeolocationService
  ) {}

  async ngOnInit() {
    this.User = this.authService.getCurrentUser();
    this.data = await JSON.parse(this.route.snapshot.paramMap.get("data")!);
    this.planningType = this.route.snapshot.paramMap.get("type") || "";
    this.currentPlanning = this.data;
    this.updateCurrentData();
    const navType = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navType?.type === "reload") {
      await this.getLoaclStorageData();
      this.updateCurrentData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.updateCurrentData();
    }
  }

  async getLoaclStorageData() {
    const cached = await JSON.parse(localStorage.getItem("currentPlanning")!);
    this.currentPlanning = cached.planning;
    this.planningType = cached.planningType;
  }
  updateCurrentData() {
    const teamMember = this.currentPlanning?.team?.find((u: any) => u.id == this.User.id);
    if (teamMember?.vehicule) {
      this.hasVehicule = true;
      this.currentVehicule = [teamMember.vehicule.id, teamMember.vehicule.name, teamMember.vehicule.driver_id];
    } else {
      this.hasVehicule = false;
    }
    this.data = {teamMember, planning: this.currentPlanning};
  }

  didDimmiss(modal: any) {
    modal.onDidDismiss().then(async (result: any) => {
      await this.getLoaclStorageData();
      this.updateCurrentData();
      if (result.data == "fetch01") {
      }
    });
  }

  async unsuitableVehicle() {
    this.isAroundIdeo = await this.geolocation.isAroundIdeo();
    if (this.isAroundIdeo) {
      const modal = await this.modalController.create({
        component: UnsuitableVehiclePage,
        cssClass: "custom-modal",
        componentProps: {data: this.data}
      });
      this.didDimmiss(modal);

      return await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: NotAroundIdeoPage,
        cssClass: "custom-modal",
        componentProps: {data: this.data, type: "unsuitable"}
      });
      this.didDimmiss(modal);
      return await modal.present();
    }
  }

  async nonRollingVehicle() {
    const modal = await this.modalController.create({
      component: NonRollingVehiclePage,
      cssClass: "custom-modal",
      componentProps: {data: this.data}
    });
    this.didDimmiss(modal);
    return await modal.present();
  }

  async reportDefect() {
    const modal = await this.modalController.create({
      component: ReportDefectPage,
      cssClass: "custom-modal",
      componentProps: {data: this.data}
    });
    this.didDimmiss(modal);

    return await modal.present();
  }

  async vehicleAllocation() {
    this.isAroundIdeo = await this.geolocation.isAroundIdeo();
    if (this.isAroundIdeo) {
      const modal = await this.modalController.create({
        component: GetVehiculePage,
        cssClass: "custom-modal",
        componentProps: {data: this.data, type: "get"}
      });
      this.didDimmiss(modal);
      return await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: NotAroundIdeoPage,
        cssClass: "custom-modal",
        componentProps: {data: this.data}
      });
      this.didDimmiss(modal);
      return await modal.present();
    }
  }

  goBack() {
    this.location.back();
  }
}
