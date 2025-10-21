import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {MissionReturnsSupervisorPage} from "src/app/widgets/modals/mission-returns-supervisor/mission-returns-supervisor.page";
import {GdcPage} from "src/app/widgets/modals/gdc/gdc.page";
import {MapService} from "src/app/widgets/map/map.service";
import { TicketService } from "src/app/pages/tickets/ticket.service";

@Component({
  selector: "app-menu-mession",
  templateUrl: "./menu-mession.page.html",
  styleUrls: ["./menu-mession.page.scss"],
  standalone: false
})
export class MenuMessionPage implements OnInit {
  planning: any = {};
  planningType: string = "";
  supervisors: any[] = [];
  kanban: any

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private mapService: MapService,
    private taskmanagerService: TicketService
  ) {}

  ngOnInit() {
    const data = JSON.parse(this.route.snapshot.paramMap.get("data")!) || {};
    this.planning = data;
    this.supervisors= JSON.parse(this.route.snapshot.paramMap.get("supervisors")!) || [];
    this.planningType = data.type || "";
    this.taskmanagerService.getAllTasksByKanban("superviseur mobile").subscribe((res: any) => {
      this.kanban= res.kanban
      
    })
    
  }

  createTicket() {
    this.router.navigate(["/add-ticket", {data: JSON.stringify(this.planning), type: this.planningType , kanban: JSON.stringify(this.kanban)}]);
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
    this.mapService.address = this.planning.address;
    this.mapService.longitude = this.planning.long;
    this.mapService.latitude = this.planning.lat;
    this.mapService.direction();
  }
}
