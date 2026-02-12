import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {AfterViewInit, ElementRef} from "@angular/core";
import {trigger, style, animate, transition} from "@angular/animations";

@Component({
  animations: [
    trigger("fadeUp", [transition(":enter", [style({opacity: 0, transform: "translateY(15px)"}), animate("300ms ease-out", style({opacity: 1, transform: "translateY(0)"}))])])
  ],
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
