import {CommonModule} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: "app-pointing-status-indicators",
  templateUrl: "./pointing-status-indicators.component.html",
  styleUrls: ["./pointing-status-indicators.component.scss"],
  imports: [CommonModule]
})
export class PointingStatusIndicatorsComponent implements OnInit {
  @Input() agent: any;

  constructor() {}

  ngOnInit() {
    // console.log(this.agent);
    
  }
}
