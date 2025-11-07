import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Location} from "@angular/common";
import {PopoverController} from "@ionic/angular";
import {IonDatetime} from "@ionic/angular";
import {Router} from "@angular/router";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {environment} from "src/environments/environment";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
@Component({
  selector: "app-mission-details",
  templateUrl: "./mission-details.page.html",
  styleUrls: ["./mission-details.page.scss"],
  standalone: false
})
export class MissionDetailsPage implements OnInit {
  toggleDetails(_t73: any) {
    _t73.showDetails = !_t73.showDetails;
  }
  @ViewChild("search_input", {static: false}) search_input!: ElementRef;

  month: string = "";
  currentMonth: string = "";
  selectedDate: string = new Date().toISOString();
  minDate: string = "";
  isPopoverOpen: boolean = false;
  isAgent: boolean = false;
  type: string = "";
  regularDate: string = "";
  punctualDate: string = "";
  headerTitle: string = "";
  plannings: any[] = [];
  planningsPerAgent: any[] = [];
  env = environment;
  laodingMessage: string = "Loading...";
  searchControl = new FormControl();
  planningsCached: any[] = [];
  date: string = new Date().toISOString().split("T")[0];
  supervisors: any[] = [];
  noSchedule:number = 0

  constructor(
    private popoverController: PopoverController,
    private location: Location,
    private router: Router,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.type = navigation?.extras.state?.["type"];
    this.type == "regular"
      ? (this.headerTitle = "Recurring Missions")
      : this.type == "punctual"
        ? (this.headerTitle = "One-off Missions")
        : (this.headerTitle = "Fixed-price mission");
  }

  async ngOnInit() {
    this.laodingMessage = await this.translateService.get("Loading").toPromise();
    this.setCurrentDay();
    await this.loadingService.present(this.laodingMessage);
    this.missionService.getPlannings(false, this.punctualDate, this.type == 'forfaitaire' ? 'flat_rate' : this.type).subscribe(async (data: any) => {
      this.plannings = this.type == "forfaitaire" ? this.foramtplannings(data['flat_rates']) : this.foramtplannings(data[`${this.type}s`]);      
    
      this.planningsCached = this.plannings;
      this.supervisors = data.supervisors_contact;
      await this.loadingService.dimiss();
    });

    this.searchControl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      if (value.length > 0) {
        const val = value.toLowerCase();
        this.plannings = this.planningsCached.filter((planning: any) => {
          const matchIntervention = planning.intervention_name?.toLowerCase().includes(val);
          const matchTeam = planning.team?.some((member: any) => member.first_name?.toLowerCase().includes(val) || member.last_name?.toLowerCase().includes(val));
          const matchSubcontractor = planning.team?.some((member: any) => {
            const agent = member?.subcontractor_agent;
            return agent?.first_name?.toLowerCase().includes(val) || agent?.last_name?.toLowerCase().includes(val) || agent?.subcontractor?.company?.toLowerCase().includes(val);
          });

          return matchIntervention || matchTeam || matchSubcontractor;
        });
      } else {
        this.plannings = this.planningsCached;
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

  setCurrentDay() {
    const now = new Date();
    const parisNow = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
    if (parisNow.getHours() >= 21) {
      parisNow.setDate(parisNow.getDate() + 1);
    }
    this.currentMonth = parisNow.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
      day: "numeric"
    });

    this.selectedDate = parisNow.toISOString();
    this.punctualDate = parisNow.toISOString().split("T")[0];
  }

  async updateDay(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.currentMonth = selectedDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
      day: "numeric"
    });
    this.selectedDate = selectedDate.toISOString();
    this.date = selectedDate.toISOString().split("T")[0];
    this.punctualDate = selectedDate.toISOString().split("T")[0];
  }

  setCurrentMonth() {
    const date = new Date();
    this.currentMonth = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });
    this.selectedDate = date.toISOString();
    this.date = date.toISOString().split("T")[0];
  }

  async updateMonth(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.currentMonth = selectedDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });
    this.selectedDate = selectedDate.toISOString();
    this.month = selectedDate.toISOString().split("T")[0].slice(0, -3);
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const filterDate = `${year}-${month}`;
    this.regularDate = filterDate;
  }

  async openPopover(event: Event) {
    // if (this.type == "regular") {
    //   const popover = await this.popoverController.create({
    //     component: IonDatetime,
    //     componentProps: {
    //       presentation: "month-year",
    //       value: this.selectedDate,
    //       min: this.minDate,
    //       locale: "fr-FR"
    //     },
    //     cssClass: "custom-picker-popover",
    //     mode: "ios",
    //     event
    //   });

    //   await popover.present();
    //   const datetimeElement = popover.querySelector("ion-datetime");
    //   if (datetimeElement) {
    //     datetimeElement.addEventListener("ionChange", (event: any) => {
    //       this.updateMonth(event);
    //       this.closePopover();
    //     });
    //   }
    // } else {
      const popover = await this.popoverController.create({
        component: IonDatetime,
        componentProps: {
          presentation: "day",
          value: this.selectedDate,
          min: this.minDate,
          locale: "fr-FR"
        },
        cssClass: "custom-picker-popover",
        event,
        mode: "ios"
      });

      await popover.present();
      const datetimeElement = popover.querySelector("ion-datetime");
      if (datetimeElement) {
        datetimeElement.addEventListener("ionChange", (event: any) => {
          this.selectedDate = event.detail.value;
          this.updateDay(event);
          this.closePopover();
        });
      }
    // }
  }

  closePopover() {
    this.isPopoverOpen = false;
    this.popoverController.dismiss();
  }

  siteOrAgent(status: boolean) {
    this.isAgent = status;
    if (this.isAgent) {
      this.planningsPerAgent = this.groupTeamMembersByPlanning(this.plannings);
    }
  }

  async getByDate() {
    await this.loadingService.present(this.laodingMessage);
    this.missionService.getPlannings(false, this.date, this.type == 'forfaitaire' ? 'flat_rate' : this.type).subscribe(async (data: any) => {
          this.plannings = this.type == "forfaitaire" ? this.foramtplannings(data['flat_rates']) : this.foramtplannings(data[`${this.type}s`]);      
      if (this.isAgent) {
        this.planningsPerAgent = this.groupTeamMembersByPlanning(this.plannings);
      }
      await this.loadingService.dimiss();
    });
  }
  menuMession(item: any) {
    item.type = this.type;
    this.router.navigate(["/menu-mession", {data: JSON.stringify(item), supervisors: JSON.stringify(this.supervisors)}]);
  }

  goBack() {
    this.location.back();
  }

  goRegularPerAgent(agent: any) {
    this.router.navigate(["/regular-per-agent"], {
      state: {
        agent: agent,
        supervisors: this.supervisors
      }
    });
  }

  groupTeamMembersByPlanning(plannings: any[]): any[] {
    const teamMap = new Map();
    for (const planning of plannings) {
      const team = planning.team || [];
      for (const member of team) {
        if (!teamMap.has(member.id)) {
          teamMap.set(member.id, {...member, plannings: []});
        }
        const memberData = teamMap.get(member.id);
        if (!memberData.plannings.some((p: any) => p.id === planning.id)) {
          memberData.plannings.push(planning);
        }
      }
    }

    return Array.from(teamMap.values());
  }
}
