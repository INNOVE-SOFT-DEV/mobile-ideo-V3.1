import {AuthService} from "./../pages/login/service/auth.service";
import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {ModalController, NavParams} from "@ionic/angular";
import {MakeRequestPage} from "src/app/widgets/modals/make-request/make-request.page";
import {AbsenceService} from "./service/absence/absence.service";
import {LoadingControllerService} from "../widgets/loading-controller/loading-controller.service";
import {User} from "../models/auth/user";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
  standalone: false
})
export class Tab3Page implements OnInit {
  async goUpdate(absence: any) {
    await this.openModal(true, absence);
  }
  isEmpty: boolean = false;
  absences: any;
  loadingMessage: string = "";
  user: User | null = this.authService.getCurrentUser();
  isSuperVisor: boolean = false;
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private modalController: ModalController,
    private absenceService: AbsenceService,
    private loadingCtrl: LoadingControllerService,
    private authService: AuthService
  ) {}
  async ngOnInit() {
    this.isSuperVisor = this.authService.isSuperVisor();
  }

  goToProfile() {
    this.router.navigate(["update"]);
  }

  async openModal(update?: any, pending?: any) {
    const props: any = {absences: this.absences};
    if (update) props.update = pending;
    const modal = await this.modalController.create({
      component: MakeRequestPage,
      cssClass: "make-request",
      animated: true,
      showBackdrop: true,
      componentProps: props
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();

    if (data && data.isUpdate) {
      this.absences.pending = this.absences.pending.map((item: any) => {
        if (item.id === data.update.id) {
          return {...item, ...data.update};
        } else return item;
      });
    } else if (data) {
      this.absences.pending.push(data);
    }
  }
}
