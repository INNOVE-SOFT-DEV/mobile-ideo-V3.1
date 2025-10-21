import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ModalController} from "@ionic/angular";
import {AbsenceDetailsPage} from "src/app/widgets/modals/absence-details/absence-details.page";
import {AbsenceService} from "src/app/tab3/service/absence/absence.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-request-processed",
  templateUrl: "./request-processed.page.html",
  styleUrls: ["./request-processed.page.scss"],
  standalone: false
})
export class RequestProcessedPage implements OnInit {
  absences: any;
  loadingMessage: string = "";
  constructor(
    private location: Location,
    private modalController: ModalController,
    private absenceService: AbsenceService,
    private loadingCtrl: LoadingControllerService,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingCtrl.present(this.loadingMessage);
    this.absenceService.getAbsencesByState("treated").subscribe({
      next: async value => {
        this.absences = value;
        await this.loadingCtrl.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingCtrl.dimiss();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  async openModal(absence: any) {
    const modal = await this.modalController.create({
      component: AbsenceDetailsPage,
      cssClass: "absence-details-page",
      animated: true,
      showBackdrop: true,
      componentProps: absence
    });
    await modal.present();
  }
}
