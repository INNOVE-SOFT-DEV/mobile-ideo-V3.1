import {Component, OnDestroy, OnInit} from "@angular/core";
import {MissionService} from "./service/intervention/mission/mission.service";
import {Intervention} from "../models/intervention/mission/mission";
import {AuthService} from "../pages/login/service/auth.service";
import {User} from "../models/auth/user";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "../widgets/loading-controller/loading-controller.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {IonDatetime, PopoverController} from "@ionic/angular";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  standalone: false
})
export class Tab1Page implements OnInit, OnDestroy {
  user: User | null = this.authService.getCurrentUser();
  isSuperVisor: boolean = false;
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
  isPopoverOpen: boolean = false;
  isToDayPlannings: boolean = false;
  noSchedule: number = 0

  constructor(
    private missionService: MissionService,
    private router: Router,
    private authService: AuthService,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private popoverController: PopoverController
  ) {}
  ngOnDestroy(): void {
    if (this.refreshEvent) {
      this.refreshEvent.unsubscribe();
    }
  }

  async ngOnInit() {
    this.setCurrentDay();
    this.isSuperVisor = this.authService.isSuperVisor();
    console.log("isSuperVisor", this.isSuperVisor);
    const user_v3 = JSON.parse(localStorage.getItem("user-v3") || "{}");
    console.log(user_v3.role);
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.setCurrentDay();
    await this.getAllMissions();
    this.refreshEvent = this.missionService.refreshEvent.subscribe(async (data: any) => {
      this.setCurrentDay();
      await this.getAllMissions();
    });
  }

  async getAllMissions() {
    this.executed = true;
    console.log(this.date , this.isSuperVisor);  
    // await this.loadingService.present("loading");
    this.isLoaded = false;
    this.missionService.getPlannings(true, this.date, "all").subscribe({
      next: async value => {
        console.log(value);
        this.isLoaded = true;

        console.log("🚀 ~ file: tab1.page.ts:83 ~ Tab1Page ~ getAllMissions ~ value", value , this.isToDayPlannings);
        this.punctuals = this.foramtplannings(value.punctuals);
        this.regulars =  this.foramtplannings(value.regulars);
        this.forfaitaires = this.foramtplannings(value.flat_rates);
        console.table({
          punctuals: this.punctuals,
          regulars: this.regulars,
          forfaitaires: this.forfaitaires
        })
        // this.counts = value.counts;
        this.superVisors = value.supervisors_contact;
        // await this.loadingService.dimiss();
      },
      error: async err => {
        console.error("Error:", err);
        await this.loadingService.dimiss();
      }
    });

  }

  foramtplannings(data: any) {
    this.noSchedule = 0
    return data.map((element: any) => {
      element["showDetails"] = false;
      element["today_schedule"] = element?.schedules?.find((s: any) => s.date == this.date) || element?.schedule?.find((s: any) => s.date == this.date) || null
      
      let subcontractors: any[] = [];
      if (element["today_schedule"] == null) {
        this.noSchedule++
        return element;
      }
      element["today_schedule"]["subcontractors"].forEach((subcontractor: any, index: number) => {
        subcontractor.agents.forEach((agent: any) => {
          subcontractors.push({
            ...subcontractor,
            ...agent
          });
        });
      });
      element["team"] = [...element["today_schedule"]["agents"], ...subcontractors];
      return element;
    });
  }

  goToProfile() {
    this.router.navigate(["update"]);
  }

  getByDate() {
    this.isLoaded = false;
    this.missionService.getPlannings(true, this.date, "all").subscribe((value: any) => {
     this.punctuals = this.foramtplannings(value.punctuals);
        this.regulars =  this.foramtplannings(value.regulars);
        this.forfaitaires = this.foramtplannings(value.flat_rates);
      this.isLoaded = true;
    });
  }
  async openPopover($event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: IonDatetime,
      componentProps: {
        presentation: "day",
        value: this.date,
        locale: "fr-FR"
      },
      event
    });

    await popover.present();
    const datetimeElement = popover.querySelector("ion-datetime");
    if (datetimeElement) {
      datetimeElement.addEventListener("ionChange", (event: any) => {
        this.currentDate = event.detail.value;
        this.updateDay(event);
        this.closePopover();
      });
    }
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
    this.currentDate = parisNow.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
      day: "numeric"
    });
    this.date = parisNow.toISOString().split("T")[0];
    this.isToDayPlannings = !shifted;
  }

  async updateDay(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.currentDate = selectedDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
      day: "numeric"
    });
    this.date = selectedDate.toISOString().split("T")[0];
    this.date == new Date().toISOString().split("T")[0] ? (this.isToDayPlannings = true) : (this.isToDayPlannings = false);
  }
}
