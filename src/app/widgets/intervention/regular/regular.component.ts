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
  env = environment;

  urlApi: string = environment.urlAPI;
  webUrl: string = environment.url_web;
  today: string = new Date().toISOString();

  constructor(private router: Router) {}
  ngOnInit(): void {}

  toggleDetails(planning: Intervention) {
    planning.showDetails = !planning.showDetails;
  }
  goToDetails(planning: any) {
    planning.type = "regular";
    localStorage.setItem("currentPlanning", JSON.stringify({planningType: "regular", planning}));
    this.router.navigate(["tabs/tab1/details", {data: JSON.stringify(planning), type: "regular" , supervisors: JSON.stringify(this.supervisors)}]);
  }
}
