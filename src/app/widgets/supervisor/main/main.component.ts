import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "src/app/pages/login/service/auth.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  standalone: false
})
export class MainComponent implements OnInit {
  @Input() counts: any;
  user = this.authService.getCurrentUser();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  goSuperVisorAbsences() {
    this.router.navigate(["absence-supervisor"]);
  }
  goSuperVisorMaterials() {
    this.router.navigate(["materials-requests-supervisor"]);
  }

  goSuperVisorMissions() {
    this.router.navigate(["missions"], {
      state: {counts: this.counts}
    });
  }

  documents() {
    this.router.navigate(["/documents-supervisor"]);
  }

  vehicules() {
    this.router.navigate(["/vehicules"]);
  }

  placementOfAgents() {
    this.router.navigate(["/placement-of-agents"]);
  }
  goSuperVisorAgentMissions() {
    this.router.navigate(["supervisor-plannings"], {
      state: {counts: this.counts}
    });
  }

  goTickets() {
    this.router.navigate(["task-list"]);
  }
}
