import {CommonModule} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: "app-pointing-status-indicators",
  templateUrl: "./pointing-status-indicators.component.html",
  styleUrls: ["./pointing-status-indicators.component.scss"],
  imports: [CommonModule, IonicModule]
})
export class PointingStatusIndicatorsComponent implements OnInit {
  @Input() agent: any;

  constructor() {

  }

  ngOnInit() {
  }
}
