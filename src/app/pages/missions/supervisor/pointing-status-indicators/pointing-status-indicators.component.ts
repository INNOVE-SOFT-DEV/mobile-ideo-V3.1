import {CommonModule} from "@angular/common";
import {Component, ElementRef, Input, OnInit} from "@angular/core";

@Component({
  selector: "app-pointing-status-indicators",
  templateUrl: "./pointing-status-indicators.component.html",
  styleUrls: ["./pointing-status-indicators.component.scss"],
  imports: [CommonModule]
})
export class PointingStatusIndicatorsComponent implements OnInit {
  @Input() agent: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // console.log(this.agent);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".custom-block"));

      blocks.forEach((block, index) => {
        setTimeout(() => {
          block.classList.add("animate__animated", "animate__fadeInUp");
          block.style.opacity = "1";
          block.style.transform = "translateY(0)";
          block.style.animationDuration = "500ms";
        }, index * 100);
      });
    }, 200);
  }
}
