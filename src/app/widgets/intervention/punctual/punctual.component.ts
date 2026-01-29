import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Intervention} from "src/app/models/intervention/mission/mission";
import {environment} from "src/environments/environment";
import {Router} from "@angular/router";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {User} from "src/app/models/auth/user";
import {ModalController} from "@ionic/angular";
import {VehicleAllocationPage} from "../../modals/missions/agents/vehicle-allocation/vehicle-allocation.page";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {trigger, state, style, transition, animate, query, stagger, keyframes} from "@angular/animations";

@Component({
  selector: "app-punctual",
  templateUrl: "./punctual.component.html",
  styleUrls: ["./punctual.component.scss"],
  standalone: false,
  animations: [
    // Card entrance animation - staggered fade in from bottom
    trigger("cardAnimation", [
      transition(
        ":enter",
        [style({opacity: 0, transform: "translateY(30px)"}), animate("400ms {{delay}}ms cubic-bezier(0.35, 0, 0.25, 1)", style({opacity: 1, transform: "translateY(0)"}))],
        {params: {delay: 0}}
      )
    ]),

    // Team member list animation - staggered entrance
    trigger("listAnimation", [
      transition("* => *", [
        query(":enter", [style({opacity: 0, transform: "translateX(-20px)"}), stagger(50, [animate("300ms ease-out", style({opacity: 1, transform: "translateX(0)"}))])], {
          optional: true
        })
      ])
    ]),

    // Expandable content animation
    trigger("expandCollapse", [
      state(
        "collapsed",
        style({
          height: "0",
          opacity: 0,
          overflow: "hidden"
        })
      ),
      state(
        "expanded",
        style({
          height: "*",
          opacity: 1,
          overflow: "visible"
        })
      ),
      transition("collapsed <=> expanded", [animate("350ms cubic-bezier(0.4, 0, 0.2, 1)")])
    ]),

    // Icon rotation for expand/collapse
    trigger("iconRotate", [
      state("collapsed", style({transform: "rotate(0deg)"})),
      state("expanded", style({transform: "rotate(180deg)"})),
      transition("collapsed <=> expanded", [animate("300ms cubic-bezier(0.4, 0, 0.2, 1)")])
    ]),

    // Click ripple effect
    trigger("clickEffect", [
      transition("* => clicked", [animate("0ms", style({transform: "scale(0.97)"})), animate("150ms cubic-bezier(0.4, 0, 0.2, 1)", style({transform: "scale(1)"}))])
    ]),

    // Badge pulse animation
    trigger("badgePulse", [
      transition(":enter", [
        animate(
          "1000ms ease-in-out",
          keyframes([
            style({transform: "scale(1)", opacity: 1, offset: 0}),
            style({transform: "scale(1.05)", opacity: 0.9, offset: 0.5}),
            style({transform: "scale(1)", opacity: 1, offset: 1})
          ])
        )
      ])
    ]),

    // Hover effect for cards
    trigger("cardHover", [
      state("default", style({transform: "translateY(0)", boxShadow: "none"})),
      state(
        "hover",
        style({
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        })
      ),
      transition("default <=> hover", [animate("200ms cubic-bezier(0.4, 0, 0.2, 1)")])
    ]),

    // Show more button animation
    trigger("buttonBounce", [
      transition("* => active", [
        animate(
          "400ms",
          keyframes([style({transform: "translateY(0)", offset: 0}), style({transform: "translateY(-5px)", offset: 0.5}), style({transform: "translateY(0)", offset: 1})])
        )
      ])
    ])
  ]
})
export class PunctualComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() isToDayPlannings: boolean = true;
  @Input() supervisors: any[] = [];
  @Input() date: string = new Date().toISOString();

  urlApi: string = environment.newApiUrl;
  webUrl: string = environment.url_web;
  User: User | null = this.autService.getCurrentUser();
  currentDate: string = "";
  isPopoverOpen: boolean = false;
  punctualDate: string = "";
  env = environment;

  // Animation states
  cardHoverStates: {[key: number]: string} = {};
  clickStates: {[key: number]: string} = {};

  constructor(
    private router: Router,
    private autService: AuthService,
    private modalController: ModalController,
    private missionService: MissionService
  ) {}

  ngOnInit() {
    // Initialize hover states
    this.data.forEach((element: any, index: number) => {
      this.cardHoverStates[index] = "default";
      this.clickStates[index] = "default";
    });
  }

  toggleDetails(planning: Intervention) {
    planning.showDetails = !planning.showDetails;
  }

  onCardHover(index: number, isHovering: boolean) {
    this.cardHoverStates[index] = isHovering ? "hover" : "default";
  }

  onCardClick(index: number) {
    this.clickStates[index] = "clicked";
    setTimeout(() => {
      this.clickStates[index] = "default";
    }, 150);
  }

  async goToDetails(planning: any) {
    localStorage.setItem("currentPlanning", JSON.stringify({planningType: "punctual", planning}));
    if (this.isToDayPlannings) {
      const user = planning.team.find((u: User) => u.id == this.User?.id);
      if (this.User?.is_driver || this.User?.is_teamleader || this.User?.role == "supervisor") {
        if (user?.vehicule_returns) {
          this.missionService.currentPlanning = planning;
          localStorage.setItem("currentPlanning", JSON.stringify({planningType: "punctual", planning}));
          this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "punctual", supervisors: JSON.stringify(this.supervisors)}]);
        } else if (user?.vehicule && !user?.vehicule_returns) {
          const modal = await this.modalController.create({
            component: VehicleAllocationPage,
            componentProps: {data: {planning, teamMember: user}}
          });
          modal.onDidDismiss().then(data => {
            this.missionService.refreshEvent.emit("vehicleAllocation");
          });
          return await modal.present();
        } else {
          this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "punctual", supervisors: JSON.stringify(this.supervisors)}]);
        }
      } else {
        this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "punctual", supervisors: JSON.stringify(this.supervisors)}]);
      }
    } else {
      this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "punctual", supervisors: JSON.stringify(this.supervisors)}]);
    }
  }

  // Helper method to get animation delay for staggered effects
  getAnimationDelay(index: number): number {
    return index * 100; // 100ms delay between each card
  }
}
