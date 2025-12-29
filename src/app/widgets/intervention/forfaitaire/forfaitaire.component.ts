import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Intervention} from "src/app/models/intervention/mission/mission";
import {environment} from "src/environments/environment";
import {Router} from "@angular/router";
import {User} from "src/app/models/auth/user";
import {ModalController} from "@ionic/angular";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {VehicleAllocationPage} from "../../modals/missions/agents/vehicle-allocation/vehicle-allocation.page";

@Component({
  selector: "app-forfaitaire",
  templateUrl: "./forfaitaire.component.html",
  styleUrls: ["./forfaitaire.component.scss"],
  standalone: false
})
export class ForfaitaireComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() isToDayPlannings: boolean = true;
  @Input() supervisors: any[] = [];
  @Input() date: string = new Date().toISOString();

  urlApi: string = environment.urlAPI;
  webUrl: string = environment.url_web;
  User: User | null = this.autService.getCurrentUser();
  env = environment;

  constructor(
    private router: Router,
    private autService: AuthService,
    private modalController: ModalController,
    private missionService: MissionService
  ) {}

  ngOnInit(): void {}

  /**
   * Fired whenever one or more @Input() values change
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      // Perform any refresh, filtering, or logic you need
    }

    if (changes["supervisors"]) {
    }

    if (changes["date"]) {
    }

    if (changes["isToDayPlannings"]) {
    }
  }

  toggleDetails(planning: Intervention) {
    planning.showDetails = !planning.showDetails;
  }

  async goToDetails(planning: any) {
    localStorage.setItem("currentPlanning", JSON.stringify({planningType: "forfaitaire", planning}));

    if (this.isToDayPlannings) {
      const user = planning.team.find((u: User) => u.id == this.User?.id);

      if (this.User?.is_driver || this.User?.is_teamleader) {
        if (user?.vehicule_returns) {
          this.missionService.currentPlanning = planning;
          this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "forfaitaire", supervisors: JSON.stringify(this.supervisors)}]);
        } else if (user?.vehicule && !user?.vehicule_returns) {
          const modal = await this.modalController.create({
            component: VehicleAllocationPage,
            componentProps: {data: {planning, teamMember: user}}
          });
          modal.onDidDismiss().then(() => {
            this.missionService.refreshEvent.emit("vehicleAllocation");
          });
          return await modal.present();
        } else {
          this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "forfaitaire", supervisors: JSON.stringify(this.supervisors)}]);
        }
      } else {
        this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "forfaitaire", supervisors: JSON.stringify(this.supervisors)}]);
      }
    } else {
      this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "forfaitaire", supervisors: JSON.stringify(this.supervisors)}]);
    }
  }
}
