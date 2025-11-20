import {Component, Input, OnInit} from "@angular/core";
import {Intervention} from "src/app/models/intervention/mission/mission";
import {environment} from "src/environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: "app-regular",
  templateUrl: "./regular.component.html",
  styleUrls: ["./regular.component.scss"],
  standalone: false
})
export class RegularComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() supervisors: any[] = [];
  @Input() date: string = new Date().toISOString();
  env = environment;
  team: any[] = [];
  schedule: any = {};

  urlApi: string = environment.urlAPI;
  webUrl: string = environment.url_web;
  today: string = new Date().toISOString();

  constructor(private router: Router) {}
  ngOnInit(): void {
    // this.data.forEach((element: any) => {
    //   element["showDetails"] = false;
    //   element["today_schedule"] = element.schedules.find((s : any) => s.date == this.date)
    //   element["team"] = [...element["today_schedule"]["agents"], ...element["today_schedule"]["subcontractors"]]
    // })
  }

  toggleDetails(planning: Intervention) {
    planning.showDetails = !planning.showDetails;
  }
  goToDetails(planning: any) {
    planning.type = "regular";
    localStorage.setItem("currentPlanning", JSON.stringify({planningType: "regular", planning}));
    this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "regular", supervisors: JSON.stringify(this.supervisors)}]);
  }
}
