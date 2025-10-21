import {Component, OnInit} from "@angular/core";
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params["data"]) {
        this.data = JSON.parse(params["data"]);
      }
    });
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
