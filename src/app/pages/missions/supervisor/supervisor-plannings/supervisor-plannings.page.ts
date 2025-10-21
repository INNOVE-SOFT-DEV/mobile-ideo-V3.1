import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {IonDatetime, PopoverController} from "@ionic/angular";
import {Subscription} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";

@Component({
  selector: "app-supervisor-plannings",
  templateUrl: "./supervisor-plannings.page.html",
  styleUrls: ["./supervisor-plannings.page.scss"],
  standalone: false
})
export class SupervisorPlanningsPage implements OnInit, OnDestroy {
  private refreshEvent!: Subscription;
  punctuals: any[] = [];
  punctualDate: string = new Date().toISOString().split("T")[0];
  currentDate: string = "";
  isPopoverOpen: boolean = false;
  executed: boolean = false;
  isTodayPlannings: boolean = true;
  laodingMessage: string = "Loading...";
  superVisors: any[] = [];

  constructor(
    private location: Location,
    private missionService: MissionService,
    private popoverController: PopoverController,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService
  ) {}

  async ngOnInit() {
    this.setCurrentDay();
    this.laodingMessage = await this.translateService.get("Loading").toPromise();
    if (!this.executed) await this.getAllMissions();
    this.refreshEvent = this.missionService.refreshEvent.subscribe(async (data: any) => {
      this.setCurrentDay();
      await this.getAllMissions();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshEvent) {
      this.refreshEvent.unsubscribe();
    }
  }

  async getAllMissions() {
    this.executed = true;
    await this.loadingService.present(this.laodingMessage);
    this.missionService.getPlannings(true, this.punctualDate, "punctual").subscribe(async (data: any) => {
      this.superVisors = data.supervisors_contact;
      this.punctuals = data.punctuals;
      await this.loadingService.dimiss();
      this.executed = false;
    });
  }

  goBack() {
    this.missionService.refreshEvent.emit();
    this.location.back();
  }

  async getByDate() {
    await this.loadingService.present(this.laodingMessage);
    this.missionService.getPlannings(true, this.punctualDate, "punctual").subscribe(async (data: any) => {
      this.punctuals = data.punctuals;
      await this.loadingService.dimiss();
    });
  }
  async openPopover($event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: IonDatetime,
      componentProps: {
        presentation: "day",
        value: this.punctualDate,
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
    this.punctualDate = parisNow.toISOString().split("T")[0];
    this.isTodayPlannings = !shifted;
  }

  async updateDay(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.currentDate = selectedDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
      day: "numeric"
    });
    this.punctualDate = selectedDate.toISOString().split("T")[0];
    this.punctualDate == new Date().toISOString().split("T")[0] ? (this.isTodayPlannings = true) : (this.isTodayPlannings = false);
  }
}
