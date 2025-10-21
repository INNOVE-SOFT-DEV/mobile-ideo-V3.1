import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ModalController, NavParams} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";

@Component({
  selector: "app-placement-of-agents-confirm-modal",
  templateUrl: "./placement-of-agents-confirm-modal.page.html",
  styleUrls: ["./placement-of-agents-confirm-modal.page.scss"],
  standalone: false
})
export class PlacementOfAgentsConfirmModalPage implements OnInit {
  data: any;
  selectedSite: any;
  tommorrow: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];
  planning: any;
  loadingMessage: string = "";

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private translationService: TranslateService
  ) {}

  async ngOnInit() {
    this.data = this.navParams.get("data");
    this.selectedSite = this.navParams.get("selectedSite");
    this.planning = this.data.plannings.find((planning: any) => planning.id === this.navParams.get("selectedSite"));
    this.loadingMessage = await this.translationService.get("loading").toPromise();
  }
  dismiss() {
    this.modalController.dismiss(false);
  }

  async confirmPlacement() {
    const planning = this.data.plannings.find((planning: any) => planning.id === this.selectedSite);
    const agent = this.data.agent.user;

    const payload = {
      planning_punctual_id: planning.id,
      user_id: agent.id,
      intervention_id: planning.intervention_id,
      is_driver: agent.is_driver,
      is_teamleader: agent.is_teamleader,
      is_extern: agent.is_extern,
      absent: false,
      is_excluded: false,
      date: this.tommorrow
    };
    await this.loadingService.present(this.loadingMessage);
    this.missionService.dispatchAgent(payload).subscribe(
      async () => {
        this.modalController.dismiss(true);
        await this.loadingService.dimiss();
      },
      async error => {
        console.error("Error dispatching agent:", error);
        await this.loadingService.dimiss();
      }
    );
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
}
