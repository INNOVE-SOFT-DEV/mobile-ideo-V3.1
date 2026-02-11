import {Component, OnDestroy, OnInit} from "@angular/core";
import {MissionService} from "./service/intervention/mission/mission.service";
import {Intervention} from "../models/intervention/mission/mission";
import {AuthService} from "../pages/login/service/auth.service";
import {User} from "../models/auth/user";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "../widgets/loading-controller/loading-controller.service";
import {Router} from "@angular/router";
import {elementAt, Subscription} from "rxjs";
import {IonDatetime, PopoverController} from "@ionic/angular";
import {trigger, transition, style, animate, query, stagger} from "@angular/animations";
import {AfterViewInit, ElementRef} from "@angular/core";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  standalone: false,
  animations: [
    // Header slide in
    // Header slide in from top with fade
    trigger("headerAnim", [
      transition(":enter", [style({transform: "translateY(-100px)", opacity: 0}), animate("500ms ease-out", style({transform: "translateY(0)", opacity: 1}))])
    ]),

    // Cards entrance with stagger + 3D
    trigger("cardsAnim", [
      transition(":enter", [style({opacity: 0, transform: "translateY(75px)"}), animate("500ms 700ms ease-out", style({opacity: 1, transform: "translateY(0)"}))])
    ]),
    // Button fade + scale
    trigger("buttonAnim", [transition(":enter", [style({opacity: 0, transform: "scale(0.8)"}), animate("400ms 800ms ease-out", style({opacity: 1, transform: "scale(1)"}))])])
  ]
})
export class Tab1Page implements OnInit, OnDestroy {
  user: User | null = this.authService.getCurrentUser();
  isSuperVisor: boolean =    this.authService.isSuperVisor();

  punctuals: Intervention[] = [];
  regulars: Intervention[] = [];
  forfaitaires: Intervention[] = [];
  loadingMessage: string = "";
  counts: any;
  loaded: boolean = false;
  superVisors: any[] = [];

  private refreshEvent!: Subscription;
  executed: boolean = false;
  isLoaded: boolean = false;
  currentDate: any;
  date: string = new Date().toISOString().split("T")[0];
  isToDayPlannings: boolean = false;
  noSchedule: number = 0;
  clickedButton: string = "";
  isPopoverOpen: boolean = false;

  constructor(
    private missionService: MissionService,
    private router: Router,
    private authService: AuthService,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private popoverController: PopoverController,
    private el: ElementRef
  ) {}

  ngOnDestroy(): void {
    if (this.refreshEvent) this.refreshEvent.unsubscribe();
  }

  async ngOnInit() {
    
    setTimeout(() => {
      const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".custom-block"));
  
      blocks.forEach((block, index) => {
        setTimeout(() => {
          block.classList.add("animate__animated", "animate__fadeInUp");
          block.style.opacity = "1";
          block.style.animationDuration = "600ms";
        }, index * 150);
      });
    }, 300);
  
    this.setCurrentDay();
    this.isSuperVisor = this.authService.isSuperVisor();
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.getAllMissions();
    this.refreshEvent = this.missionService.refreshEvent.subscribe(async () => {
      this.setCurrentDay();
      await this.getAllMissions();
    });

  }

  


  async getAllMissions() {
    this.isLoaded = false;
    console.log(this.isSuperVisor);
    if(this.isSuperVisor){
      this.missionService.getSuperVisorPlanningCounts(this.date).subscribe({
        next: (value: any) => {
          this.isLoaded = true;
          // this.punctuals = this.formatPlannings(value.punctuals) || [];
          // this.regulars = this.formatPlannings(value.regulars|| []);
          // this.forfaitaires = this.formatPlannings(value.flat_rates || []);
          this.counts = {
            punctuals_count: value.punctuals,
            regulars_count: value.regulars,
            forfaitaires_count: value.flat_rates, 
            supervisor_punctuals_count : value?.our_missions
  
          };

          console.log(this.counts);
          
          // this.superVisors = value.supervisors_contact;
          
  
        },
        error: async err => {
          console.error("Error:", err);
          this.isLoaded = true;
          // await this.loadingService.dimiss();
        }
      })

    }else {

      this.missionService.getPlannings(true, this.date, "all").subscribe({
        next: (value: any) => {
          this.isLoaded = true;
          this.punctuals = this.formatPlannings(value.punctuals) || [];
          this.regulars = this.formatPlannings(value.regulars|| []);
          this.forfaitaires = this.formatPlannings(value.flat_rates || []);
          
          
          
          this.counts = {
            punctuals_count: this.punctuals.length,
            regulars_count: this.regulars?.length || 0,
            forfaitaires_count: this.forfaitaires?.length || 0,
  
          };
          this.superVisors = value.supervisors_contact;
          
  
        },
        error: async err => {
          console.error("Error:", err);
          this.isLoaded = true;
          // await this.loadingService.dimiss();
        }
      });
    }
    
    this.loaded = true;
  }

  formatPlannings(data: any) {
    this.noSchedule = 0;
    return data?.map((el: any) => {
      el.showDetails = false;
      el.today_schedule = el?.schedules?.find((s: any) => s.date === this.date) || el?.schedule?.find((s: any) => s.date === this.date) || null;
      el.today_schedule?.agents?.forEach((agent: any) => {
        agent.first_name = agent.full_name.split(" ")[0];
        agent.last_name = agent.full_name.split(" ")[1] || "";
        agent.role = agent.role_name;
      });
      console.log(el.today_schedule)
      

      let subcontractors: any[] = [];
      if (!el.today_schedule) {
        this.noSchedule++;
        return el;
      }

      el.today_schedule.subcontractors.forEach((sub: any) => {
        sub.agents.forEach((agent: any) => subcontractors.push({...sub, ...agent}));
      });

      el.team = [...el.today_schedule.agents, ...subcontractors];
      return el;
    });
  }

  goToProfile() {
    this.router.navigate(["update"]);
  }

  getByDate() {
    this.isLoaded = false;
    this.missionService.getPlannings(true, this.date, "all").subscribe((value: any) => {
      this.punctuals = this.formatPlannings(value.punctuals);
      this.regulars = this.formatPlannings(value.regulars);
      this.forfaitaires = this.formatPlannings(value.flat_rates);
      this.isLoaded = true;
    });
  }

  async openPopover($event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: IonDatetime,
      componentProps: {presentation: "day", value: this.date, locale: "fr-FR"},
      event: $event
    });
    await popover.present();
    const datetimeElement = popover.querySelector("ion-datetime");
    datetimeElement?.addEventListener("ionChange", (event: any) => {
      this.currentDate = event.detail.value;
      this.updateDay(event);
      this.closePopover();
    });
  }

  closePopover() {
    this.isPopoverOpen = false;
    this.popoverController.dismiss();
  }

  setCurrentDay() {
    const now = new Date();
    const parisNow = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
    let shifted = false;
    if (parisNow.getHours() >= 21) {
      parisNow.setDate(parisNow.getDate() + 1);
      shifted = true;
    }
    this.currentDate = parisNow.toLocaleDateString("fr-FR", {month: "long", year: "numeric", day: "numeric"});
    this.date = parisNow.toISOString().split("T")[0];
    this.isToDayPlannings = !shifted;
  }

  updateDay(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.currentDate = selectedDate.toLocaleDateString("fr-FR", {month: "long", year: "numeric", day: "numeric"});
    this.date = selectedDate.toISOString().split("T")[0];
    this.isToDayPlannings = this.date === new Date().toISOString().split("T")[0];
    this.getByDate();
  }
}
