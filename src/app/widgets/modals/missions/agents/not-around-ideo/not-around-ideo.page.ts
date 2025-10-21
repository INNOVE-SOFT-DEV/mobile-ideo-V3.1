import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";

@Component({
  selector: "app-not-around-ideo",
  templateUrl: "./not-around-ideo.page.html",
  styleUrls: ["./not-around-ideo.page.scss"],
  standalone: false
})
export class NotAroundIdeoPage implements OnInit {
  @Input() data: any;
  @Input() type!: string;

  loadingMessage: string = "";
  planningType: string = "";
  freeVehicules: any[] = [];

  constructor(
    private missionService: MissionService,
    private modalController: ModalController,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.planningType = this.data.teamMember.planning_punctual_agent_id != null ? "punctual" : "forfaitaire";
    await this.loadingService.present(this.loadingMessage);
    this.missionService.getFreeVehicules(this.data.planning.id, this.planningType, this.data.teamMember.id).subscribe({
      next: async value => {
        this.freeVehicules = value;
        await this.loadingService.dimiss();
      },
      error: async err => {
        await this.loadingService.dimiss();
        console.error(err);
      }
    });
  }

  onBackReturn() {
    this.modalController.dismiss();
  }
}
