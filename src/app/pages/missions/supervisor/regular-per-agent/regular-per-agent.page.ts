import {Component, ElementRef, OnInit} from "@angular/core";
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
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit() {
    const navigation: any = this.location.getState() as {type?: string};
    this.agentName = `${navigation.agent.first_name} ${navigation.agent.last_name}`;
    this.regulars = navigation.agent.plannings || [];
    this.superVisors = navigation.supervisors;
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
