import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {AfterViewInit, ElementRef} from "@angular/core";

@Component({
  selector: "app-missions",
  templateUrl: "./missions.page.html",
  styleUrls: ["./missions.page.scss"],
  standalone: false
})
export class MissionsPage implements OnInit {
  counts: any;
  constructor(
    private location: Location,
    private router: Router,
    private missionService: MissionService,
    private el: ElementRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.counts = navigation?.extras.state?.["counts"];
  }

  async ngOnInit() {}
  ngAfterViewInit() {
    setTimeout(() => {
      const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".custom-block"));

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
  goBack() {
    this.missionService.refreshEvent.emit();
    this.location.back();
  }

  agentTracking() {
    this.router.navigate(["agent-tracking"]);
  }

  goSuperVisorMissionDetails(type: string) {
    this.router.navigate(["mission-details"], {
      state: {type: type}
    });
  }
}
