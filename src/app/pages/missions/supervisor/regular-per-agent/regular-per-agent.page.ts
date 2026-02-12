import {Component, ElementRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {trigger, style, animate, transition} from "@angular/animations";

@Component({
  animations: [
    trigger("fadeUp", [transition(":enter", [style({opacity: 0, transform: "translateY(15px)"}), animate("300ms ease-out", style({opacity: 1, transform: "translateY(0)"}))])])
  ],
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
    private router: Router,
    private el: ElementRef
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
