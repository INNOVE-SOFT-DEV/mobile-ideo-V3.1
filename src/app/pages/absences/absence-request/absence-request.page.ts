import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ModalController} from "@ionic/angular";
import {AbsenceDetailsPage} from "src/app/widgets/modals/absence-details/absence-details.page";
import {AbsenceService} from "src/app/tab3/service/absence/absence.service";

@Component({
  selector: "app-absence-request",
  templateUrl: "./absence-request.page.html",
  styleUrls: ["./absence-request.page.scss"],
  standalone: false
})
export class AbsenceRequestPage implements OnInit {
  absences: any;

  constructor(
    private location: Location,
    private modalController: ModalController,
    private absencesService: AbsenceService
  ) {}

  ngOnInit() {
    this.listAbsencesByState();
  }

  listAbsencesByState() {
    this.absencesService.getAbsencesByState("pending").subscribe({
      next: async value => {
        this.absences = value;
      },
      error: async err => {}
    });
  }

  async openModal(absence: any) {
    const modal = await this.modalController.create({
      component: AbsenceDetailsPage,
      cssClass: "absence-details-page",
      animated: true,
      showBackdrop: true,
      componentProps: absence
    });
    modal.onDidDismiss().then(result => {
      if (result.data === "refresh") {
        this.listAbsencesByState();
      }
    });
    await modal.present();
  }
  goBack() {
    this.location.back();
  }
}
