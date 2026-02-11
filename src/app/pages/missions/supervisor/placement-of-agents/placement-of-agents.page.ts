import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {environment} from "src/environments/environment";
import {AfterViewInit, ElementRef} from "@angular/core";

@Component({
  selector: "app-placement-of-agents",
  templateUrl: "./placement-of-agents.page.html",
  styleUrls: ["./placement-of-agents.page.scss"],
  standalone: false
})
export class PlacementOfAgentsPage implements OnInit, OnDestroy {
  filterKey: string = "";
  agents: any[] = [];
  tommorrow: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];
  refreshEvent!: Subscription;
  env = environment;

  constructor(
    private location: Location,
    private router: Router,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private translationService: TranslateService,
    private el: ElementRef
  ) {}
  ngOnDestroy(): void {
    if (this.refreshEvent) {
      this.refreshEvent.unsubscribe();
    }
  }

  async ngOnInit() {
    await this.getAgents();

    this.refreshEvent = this.missionService.refreshDispatchAgent.subscribe(async data => {
      await this.getAgents();
    });
  }
  async getAgents() {
    const message = await this.translationService.get("loading").toPromise();
    await this.loadingService.present(message);
    this.missionService.getDispatchAgent().subscribe({
      next: async value => {
        this.agents = value.data;
        await this.loadingService.dimiss();
      },
      error: async error => {
        console.error("Error fetching dispatch agent:", error);
        await this.loadingService.dimiss();
      }
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".anumation-block"));

      blocks.forEach((block, index) => {
        setTimeout(() => {
          block.classList.add("animate__animated", "animate__fadeInUp");
          block.style.opacity = "1";
          block.style.transform = "translateY(0)";
          block.style.animationDuration = "500ms";
        }, index * 100);
      });
    }, 200);
  }

  placementOfAgentsDetails(agent: any) {
    this.router.navigate(["/placement-of-agents-details", {data: JSON.stringify(agent)}]);
  }
  goBack() {
    this.location.back();
  }
}
