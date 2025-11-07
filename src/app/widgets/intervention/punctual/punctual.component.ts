import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Intervention} from "src/app/models/intervention/mission/mission";
import {environment} from "src/environments/environment";
import {Router} from "@angular/router";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {User} from "src/app/models/auth/user";
import {ModalController} from "@ionic/angular";
import {VehicleAllocationPage} from "../../modals/missions/agents/vehicle-allocation/vehicle-allocation.page";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";

@Component({
  selector: "app-punctual",
  templateUrl: "./punctual.component.html",
  styleUrls: ["./punctual.component.scss"],
  standalone: false
})
export class PunctualComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() isToDayPlannings: boolean = true;
  @Input() supervisors: any[] = [];
  @Input() date : string = new Date().toISOString();

  urlApi: string = environment.urlAPI;
  webUrl: string = environment.url_web;
  User: User | null = this.autService.getCurrentUser();
  currentDate: string = "";
  isPopoverOpen: boolean = false;
  punctualDate: string = "";
  env = environment;
  constructor(
    private router: Router,
    private autService: AuthService,
    private modalController: ModalController,
    private missionService: MissionService
  ) {}

  ngOnInit() {
    // this.data.forEach((element: any) => {
    //   console.log(element);
      
    //   element["showDetails"] = false;
    //   element["today_schedule"] = element.schedule.find((s : any) => s.date == this.date)
    //   element["team"] = [...element["today_schedule"]["agents"], ...element["today_schedule"]["subcontractors"]]      
    // })
    

  }

  toggleDetails(planning: Intervention) {
    planning.showDetails = !planning.showDetails;
  }

  async goToDetails(planning: any) {
    localStorage.setItem("currentPlanning", JSON.stringify({planningType: "punctual", planning}));
    if (this.isToDayPlannings) {
      const user = planning.team.find((u: User) => u.id == this.User?.id);
      if (this.User?.is_driver || this.User?.is_teamleader || this.User?.role == "supervisor") {
        if (user?.vehicule_returns) {
          this.missionService.currentPlanning = planning;
          localStorage.setItem("currentPlanning", JSON.stringify({planningType: "punctual", planning}));
          this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "punctual", supervisors: JSON.stringify(this.supervisors)}]);
        } else if (user?.vehicule && !user?.vehicule_returns) {
          const modal = await this.modalController.create({
            component: VehicleAllocationPage,
            componentProps: {data: {planning, teamMember: user}}
          });
          modal.onDidDismiss().then(data => {
            this.missionService.refreshEvent.emit("vehicleAllocation");
          });
          return await modal.present();
        } else {
          this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "punctual", supervisors: JSON.stringify(this.supervisors)}]);
        }
      } else {
        this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "punctual", supervisors: JSON.stringify(this.supervisors)}]);
      }
    } else {
      this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "punctual", supervisors: JSON.stringify(this.supervisors)}]);
    }
  }
}
