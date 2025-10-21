import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";

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
    private missionService: MissionService
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
