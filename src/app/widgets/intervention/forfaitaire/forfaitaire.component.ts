import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Intervention} from "src/app/models/intervention/mission/mission";
import {environment} from "src/environments/environment";
import {Router} from "@angular/router";
import {User} from "src/app/models/auth/user";
import {ModalController} from "@ionic/angular";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {VehicleAllocationPage} from "../../modals/missions/agents/vehicle-allocation/vehicle-allocation.page";
import {trigger, transition, style, animate, query, stagger, state, keyframes} from "@angular/animations";

@Component({
  selector: "app-forfaitaire",
  templateUrl: "./forfaitaire.component.html",
  styleUrls: ["./forfaitaire.component.scss"],
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
export class ForfaitaireComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() isToDayPlannings: boolean = true;
  @Input() supervisors: any[] = [];
  @Input() date: string = new Date().toISOString();
  cardHoverStates: {[key: number]: string} = {};
  clickStates: {[key: number]: string} = {};

  urlApi: string = environment.urlAPI;
  webUrl: string = environment.url_web;
  User: User | null = this.autService.getCurrentUser();
  env = environment;

  constructor(
    private router: Router,
    private autService: AuthService,
    private modalController: ModalController,
    private missionService: MissionService
  ) {}

  ngOnInit(): void {}

  /**
   * Fired whenever one or more @Input() values change
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      // Perform any refresh, filtering, or logic you need
    }

    if (changes["supervisors"]) {
    }

    if (changes["date"]) {
    }

    if (changes["isToDayPlannings"]) {
    }
  }

  toggleDetails(planning: Intervention) {
    planning.showDetails = !planning.showDetails;
  }

  async goToDetails(planning: any) {
    localStorage.setItem("currentPlanning", JSON.stringify({planningType: "forfaitaire", planning}));

    if (this.isToDayPlannings) {
      const user = planning.team.find((u: User) => u.id == this.User?.id);

      if (this.User?.is_driver || this.User?.is_teamleader) {
        if (user?.vehicule_returns) {
          this.missionService.currentPlanning = planning;
          this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "forfaitaire", supervisors: JSON.stringify(this.supervisors)}]);
        } else if (user?.vehicule && !user?.vehicule_returns) {
          const modal = await this.modalController.create({
            component: VehicleAllocationPage,
            componentProps: {data: {planning, teamMember: user}}
          });
          modal.onDidDismiss().then(() => {
            this.missionService.refreshEvent.emit("vehicleAllocation");
          });
          return await modal.present();
        } else {
          this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "forfaitaire", supervisors: JSON.stringify(this.supervisors)}]);
        }
      } else {
        this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "forfaitaire", supervisors: JSON.stringify(this.supervisors)}]);
      }
    } else {
      this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "forfaitaire", supervisors: JSON.stringify(this.supervisors)}]);
    }
  }

  // Helper method to get animation delay for staggered effects
  getAnimationDelay(index: number): number {
    return index * 100; // 100ms delay between each card
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
}
