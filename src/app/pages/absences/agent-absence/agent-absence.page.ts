import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {User} from "src/app/models/auth/user";
import {AbsenceService} from "src/app/tab3/service/absence/absence.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {MakeRequestPage} from "src/app/widgets/modals/make-request/make-request.page";
import {AuthService} from "../../login/service/auth.service";

@Component({
  selector: "app-agent-absence",
  templateUrl: "./agent-absence.page.html",
  styleUrls: ["./agent-absence.page.scss"],
  standalone: false
})
export class AgentAbsencePage implements OnInit {
  isEmpty: boolean = false;
  absences: any = {pending: [], allowed: []};
  loadingMessage: string = "";
  user: User | null = this.authService.getCurrentUser();
  isSuperVisor: boolean = false;
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private modalController: ModalController,
    private absenceService: AbsenceService,
    private loadingCtrl: LoadingControllerService,
    private authService: AuthService,
    private location: Location
  ) {}

  async goUpdate(absence: any) {
    await this.openModal(true, absence);
  }

  async ngOnInit() {
    this.isSuperVisor = this.authService.isSuperVisor();
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingCtrl.present(this.loadingMessage);
    this.absenceService.getAbsencesFromapi().subscribe({
      next: async data => {
        //this.absences = data;
        // console.log(data);
        const cleanData = data.filter((item: any) => item && Object.keys(item).length > 0);

        // group by state
        this.absences = {
          pending: cleanData.filter((a: any) => a.state === "pending"),
          allowed: cleanData.filter((a: any) => a.state === "allowed"),
          refused: cleanData.filter((a: any) => a.state === "refused")
        };

        // console.log("Grouped absences:", this.absences);
        await this.loadingCtrl.dimiss();
      },
      error: async error => {
        console.error(error);
        await this.loadingCtrl.dimiss();
      }
    });
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
        return item.id === data.update.id ? {...item, ...data.update} : item;
      });
    } else if (data) {
      // console.log("okkkkk");
      // console.log(data);
      this.absences.pending ??= [];
      this.absences.pending.push(data);
    }
  }

  goBack() {
    this.location.back();
  }
}
