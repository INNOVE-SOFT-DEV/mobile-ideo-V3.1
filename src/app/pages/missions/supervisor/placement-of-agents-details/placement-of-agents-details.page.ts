import {Component, ElementRef, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {Subscription} from "rxjs";
import {trigger, style, animate, transition} from "@angular/animations";

@Component({
  animations: [
    trigger("fadeUp", [transition(":enter", [style({opacity: 0, transform: "translateY(15px)"}), animate("300ms ease-out", style({opacity: 1, transform: "translateY(0)"}))])])
  ],
  selector: "app-placement-of-agents-details",
  templateUrl: "./placement-of-agents-details.page.html",
  styleUrls: ["./placement-of-agents-details.page.scss"],
  standalone: false
})
export class PlacementOfAgentsDetailsPage implements OnInit, OnDestroy {
  constructor(
    private location: Location,
    private router: Router,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private translationService: TranslateService,
    private route: ActivatedRoute,
    private el: ElementRef
  ) {}
  ngOnDestroy(): void {
    if (this.refreshEvent) {
      this.refreshEvent.unsubscribe();
    }
  }

  agentData: any = {};
  tommorrow: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];
  plannings: any[] = [];
  refreshEvent!: Subscription;

  loadded: boolean = false;

  async ngOnInit() {
    this.agentData = await JSON.parse(this.route.snapshot.paramMap.get("data")!);
    await this.getPlannings();
    this.refreshEvent = this.missionService.refreshDispatchAgent.subscribe(async data => {
      if (data) {
        await this.getPlannings();
        this.location.back();
      }
    });
  }

  async getPlannings() {
    const message = await this.translationService.get("loading").toPromise();
    this.loadded = false;
    await this.loadingService.present(message);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.missionService.getPlannings(false, tomorrow.toISOString().split("T")[0], "punctual").subscribe({
      next: async value => {
        this.plannings = value.punctuals;
        this.loadded = true;
        await this.loadingService.dimiss();
      },
      error: async error => {
        console.error("Error fetching dispatch agent:", error);
        this.loadded = true;
        await this.loadingService.dimiss();
      }
    });
  }

  placementOfAgentsAffect() {
    const data = {plannings: this.plannings, agent: this.agentData};
    this.router.navigate(["/placement-of-agents-affect", {data: JSON.stringify(data)}]);
  }
  goBack() {
    this.missionService.refreshDispatchAgent.emit();
    this.location.back();
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
