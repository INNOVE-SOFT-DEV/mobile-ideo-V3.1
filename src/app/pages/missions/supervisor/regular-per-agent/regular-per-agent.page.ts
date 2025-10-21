import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
@Component({
  selector: "app-regular-per-agent",
  templateUrl: "./regular-per-agent.page.html",
  styleUrls: ["./regular-per-agent.page.scss"],
  standalone: false
})
export class RegularPerAgentPage implements OnInit {
  regulars: any[] = [];
  agentName: string = "";
  superVisors: any[] = [];

  constructor(
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    const navigation: any = this.location.getState() as {type?: string};
    this.agentName = `${navigation.agent.first_name} ${navigation.agent.last_name}`;
    this.regulars = navigation.agent.plannings || [];
    this.superVisors = navigation.supervisors;
  }

  goBack() {
    this.location.back();
  }

  menuMession(item: any) {
    item.type = "regular";

    this.router.navigate(["/menu-mession", {data: JSON.stringify(item), supervisors: JSON.stringify(this.superVisors)}]);
  }

  toggleDetails(_t73: any) {
    _t73.showDetails = !_t73.showDetails;
  }
}
