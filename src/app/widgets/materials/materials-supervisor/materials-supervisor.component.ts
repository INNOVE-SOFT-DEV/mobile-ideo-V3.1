import {Component, Input, OnInit} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {MaterialsService} from "src/app/pages/materials/service/materials.service";

@Component({
  selector: "app-materials-supervisor",
  templateUrl: "./materials-supervisor.component.html",
  styleUrls: ["./materials-supervisor.component.scss"],
  standalone: false
})
export class MaterialsSupervisorComponent implements OnInit {
  @Input() pendingCount: any;

  constructor(
    private router: Router,
    private materialsService: MaterialsService
  ) {}

  ngOnInit() {}

  goToMaterialRequestProcessed() {
    this.router.navigate(["material-request-processed"]);
  }

  goToMaterialRequest() {
    this.router.navigate(["material-request"]);
  }
}
