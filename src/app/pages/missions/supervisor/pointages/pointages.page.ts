import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {first} from "rxjs";
import {IonDatetime, PopoverController} from "@ionic/angular";

@Component({
  selector: "app-pointages",
  templateUrl: "./pointages.page.html",
  styleUrls: ["./pointages.page.scss"],
  standalone: false
})
export class PointagesPage implements OnInit {
  isPopoverOpen: boolean = false;
  laodingMessage: string = "Loading...";
  planning: any;
  team: any;
  date: string = "";
  selectedOption: string = "";
  pickedAgent: any;
  currentMonth: any;
  selectedDate: string = "";
  month: string = "";
  minDate: any;
  data: any;
  selectedUserRole: string = "";
  nonRegularDay: string = "";
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private missionService: MissionService,
    private popoverController: PopoverController
  ) {}

  async ngOnInit() {
    this.laodingMessage = await this.translateService.get("Loading").toPromise();
    const data = JSON.parse(this.route.snapshot.paramMap.get("data")!) || {};
    this.planning = data;

    if (this.planning.type != "regular") this.nonRegularDay = new Intl.DateTimeFormat("fr-FR", {weekday: "long"})?.format(new Date(this.planning.date));
    this.setDate();
    await this.prepareData();
  }

  async prepareData() {
    await this.loadingService.present(this.laodingMessage);
    this.missionService.getPointAgents({id: this.planning.id, type: this.planning.type, date: this.date}).subscribe(async data => {
      this.team = data.map((member: any) => {
        const foundMember = this.planning.team.find((u: any) => u.id === member.user.id);
        if (foundMember?.vehicule && foundMember.role == "teamleader") {
          member.role = "Chauffeur/Chef d'équipe";
        } else if (foundMember?.vehicule && foundMember.role != "driver") {
          member.role = "Chauffeur";
        } else if (!foundMember?.vehicule && foundMember.role == "teamleader") {
          member.role = "Chef d'équipe";
        } else if (foundMember.role == "agent") {
          member.role = "Agent";
        } else if (foundMember.role == "supervisor" && !foundMember?.vehicule) {
          member.role = "Superviseur";
        } else if (foundMember.role == "supervisor" && foundMember?.vehicule) {
          member.role = "Superviseur/Chauffeur";
        }

        if (this.planning.type == "regular") {
          this.setCurrentMonth();
          this.selectedOption = `${this.planning.team[0].first_name} ${this.planning.team[0].last_name}`;
          if (this.selectedOption == `${foundMember?.first_name} ${foundMember?.last_name}`) this.selectedUserRole = member.role;
        }

        if (member.lat == null && member.lat_2 == null) {
          return {
            first_name: foundMember.first_name,
            last_name: foundMember.last_name,
            first_pointing_internal: [member],
            second_pointing_internal: [member],
            hour_start: member.hour_start,
            hour_end: member.hour_end,
            role: member.role,
            date: member.date,
            photo: member.user.photo.url,
            day: new Intl.DateTimeFormat("fr-FR", {weekday: "long"}).format(new Date(member.date))
          };
        } else if (member.lat != null && member.lat_2 == null) {
          return {
            first_name: foundMember.first_name,
            last_name: foundMember.last_name,
            first_pointing_internal: [],
            second_pointing_internal: [member],
            hour_start: member.hour_start,
            hour_end: member.hour_end,
            role: member.role,
            date: member.date,
            photo: member.user.photo.url,
            day: new Intl.DateTimeFormat("fr-FR", {weekday: "long"}).format(new Date(member.date))
          };
        } else {
          member.lat != null && member.lat_2 != null;
          return {
            first_name: foundMember.first_name,
            last_name: foundMember.last_name,
            first_pointing_internal: [],
            second_pointing_internal: [],
            hour_start: member.hour_start,
            hour_end: member.hour_end,
            role: member.role,
            date: member.date,
            photo: member.user.photo.url,
            day: new Intl.DateTimeFormat("fr-FR", {weekday: "long"}).format(new Date(member.date))
          };
        }
      });

      await this.loadingService.dimiss();
    });
  }

  setDate() {
    if (this.planning.type == "regular") {
      const dateStart = new Date(this.planning.date_start);
      const dateEnd = new Date(this.planning.date_end);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const startMonth = dateStart.getMonth() + 1;
      const endMonth = dateEnd.getMonth() + 1;
      let selectedMonth: number;
      let selectedYear: number;
      if (currentMonth === startMonth || currentMonth === endMonth) {
        selectedMonth = currentMonth;
        selectedYear = currentYear;
      } else {
        const diffToStart = Math.abs(currentMonth - startMonth);
        const diffToEnd = Math.abs(currentMonth - endMonth);
        if (diffToStart <= diffToEnd) {
          selectedMonth = startMonth;
          selectedYear = dateStart.getFullYear();
        } else {
          selectedMonth = endMonth;
          selectedYear = dateEnd.getFullYear();
        }
      }
      const yyyy = selectedYear.toString();
      const mm = selectedMonth.toString().padStart(2, "0");
      this.date = `${yyyy}-${mm}`;
    } else {
      this.date = this.planning.date;
    }
  }

  onChange(event: any) {
    this.selectedOption = event.target.value;
    this.team.filter((u: any) => {
      if (`${u.first_name} ${u.last_name}` == this.selectedOption) {
        this.pickedAgent = u;
        this.selectedUserRole = u.role;
      }
    });
  }

  setCurrentMonth() {
    const date = new Date();
    this.currentMonth = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });
    this.selectedDate = date.toISOString();
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
    this.date = `${year}-${month}`;
    await this.prepareData();
  }

  async openPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: IonDatetime,
      componentProps: {
        presentation: "month-year",
        value: this.selectedDate,
        min: this.minDate,
        locale: "fr-FR"
      },
      cssClass: "custom-picker-popover",
      event
    });

    await popover.present();
    const datetimeElement = popover.querySelector("ion-datetime");
    if (datetimeElement) {
      datetimeElement.addEventListener("ionChange", (event: any) => {
        this.updateMonth(event);
        this.closePopover();
      });
    }
  }

  closePopover() {
    this.isPopoverOpen = false;
    this.popoverController.dismiss();
  }

  goBack() {
    this.location.back();
  }
}
