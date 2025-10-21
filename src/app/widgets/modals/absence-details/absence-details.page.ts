import {Component, OnInit} from "@angular/core";
import {ModalController, NavParams} from "@ionic/angular";
import {Browser} from "@capacitor/browser";
import {AbsenceService} from "src/app/tab3/service/absence/absence.service";

@Component({
  selector: "app-absence-details",
  templateUrl: "./absence-details.page.html",
  styleUrls: ["./absence-details.page.scss"],
  standalone: false
})
export class AbsenceDetailsPage implements OnInit {
  absence: any;
  doc_type: any;
  filePreview: any;
  isPdf: boolean = false;
  imagePreview: any;
  loadingAccept: boolean = false;
  loadingReject: boolean = false;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private absenceService: AbsenceService
  ) {}

  ngOnInit() {
    this.absence = this.navParams.data;
    if (this.absence?.document?.url && this.absence?.document?.url.includes("pdf")) {
      this.filePreview = this.absence?.document?.url;
      this.isPdf = true;
    } else if (this.absence?.document?.url && !this.absence?.document?.url.includes("pdf")) {
      this.imagePreview = this.absence?.document?.url;
      this.isPdf = false;
    }
  }
  async previewDocument(url: string) {
    await Browser.open({url});
  }

  dismiss() {
    this.modalController.dismiss("refresh");
  }

  changeAbsenceState(state: string) {
    if (state == "allowed") {
      this.loadingAccept = true;
    } else {
      this.loadingReject = true;
    }
    this.absenceService.changeAbsenceState(state, this.absence.id).subscribe({
      next: value => {
        this.loadingAccept = false;
        this.loadingReject = false;
        this.modalController.dismiss("refresh");
      },
      error: err => {
        this.loadingAccept = false;
        this.loadingReject = false;
      }
    });
  }
}
