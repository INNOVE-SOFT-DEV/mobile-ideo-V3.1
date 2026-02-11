import {Component, ElementRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-send-report",
  templateUrl: "./send-report.page.html",
  styleUrls: ["./send-report.page.scss"],
  standalone: false
})
export class SendReportPage implements OnInit {
  data: any;
  selectedContactId: any = null;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params["data"]) {
        this.data = JSON.parse(params["data"]);
      }
    });
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
  shareReport() {
    if (this.selectedContactId === null) {
      console.warn("No contact selected");
      return;
    }
    this.router.navigate([
      "/share-report",
      {
        data: JSON.stringify(this.data),
        contacts: JSON.stringify(this.data.contacts.find((c: any) => c.id === this.selectedContactId))
      }
    ]);
  }

  goBack() {
    this.location.back();
  }

  selectContact(id: number) {
    this.selectedContactId = id;
  }
  onRadioChange(event: any) {
    const selected = this.data.contacts.find((c: any) => c.id === this.selectedContactId);
  }
}
