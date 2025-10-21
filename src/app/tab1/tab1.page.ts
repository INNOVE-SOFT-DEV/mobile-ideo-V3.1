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
  date: string | undefined;
  isPopoverOpen: boolean = false;
  isToDayPlannings: boolean = false;

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
    if (!this.isSuperVisor) {
      await this.loadingService.present(this.loadingMessage);
      this.missionService.getPlannings(true, this.date, "all").subscribe({
        next: async value => {
          this.punctuals = value.punctuals;
          this.regulars = value.regulars;
          this.forfaitaires = value.forfaitaires;
          this.superVisors = value.supervisors_contact;
          await this.loadingService.dimiss();
          this.isLoaded = true;
        },
        error: async err => {
          console.error("Error:", err);
          await this.loadingService.dimiss();
        }
      });
    } else {
      await this.loadingService.present(this.loadingMessage);
      this.missionService.getSuperVisorPlanningCounts(this.date).subscribe({
        next: async value => {
          this.counts = value;
          this.loaded = true;
          await this.loadingService.dimiss();
        },
        error: async err => {
          console.error("Error:", err);
          await this.loadingService.dimiss();
          this.counts = {
            punctuals: 0,
            regulars: 0,
            forfaitaires: 0
          };
          this.loaded = true;
        }
      });
    }
  }

  goToProfile() {
    this.router.navigate(["update"]);
  }

  getByDate() {
    this.missionService.getPlannings(true, this.date, "all").subscribe((data: any) => {
      this.punctuals = data.punctuals;
      this.regulars = data.regulars;
      this.forfaitaires = data.forfaitaires;
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
