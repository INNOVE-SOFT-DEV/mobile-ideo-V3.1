import {Component, OnInit} from "@angular/core";
import {AuthService} from "./../pages/login/service/auth.service";
import {User} from "../models/auth/user";
import {Router} from "@angular/router";
import {MaterialRequestPage} from "src/app/widgets/modals/material-request/material-request.page";
import {MaterialsAgentPage} from "src/app/widgets/modals/materials-agent/materials-agent.page";
import {ModalController} from "@ionic/angular";
import {MaterialsService} from "../pages/materials/service/materials.service";
import {LoadingControllerService} from "../widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-materials",
  templateUrl: "./materials.page.html",
  styleUrls: ["./materials.page.scss"],
  standalone: false
})
export class MaterialsPage implements OnInit {
  user: User | null = this.authService.getCurrentUser();
  isSuperVisor: boolean = false;
  materials: any;
  loadingMessage: string = "";
  pendingCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private materialsService: MaterialsService,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.isSuperVisor = this.authService.isSuperVisor();
  }

  async ionViewWillEnter() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
  }

  goToMaterialRequest() {
    this.router.navigate(["material-request"]);
  }

  goToMaterialRequestProcessed() {
    this.router.navigate(["material-request-processed"]);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: MaterialRequestPage,
      cssClass: "materials-modal"
    });
    return await modal.present();
  }

  async openModaMaterialAgentl(material: any) {
    const modal = await this.modalController.create({
      component: MaterialsAgentPage,
      cssClass: "materials-agent-modal",
      componentProps: material
    });
    modal.onDidDismiss().then(result => {
      if (result.data === "refresh") {
      }
    });
    return await modal.present();
  }

  goToProfile() {
    this.router.navigate(["update"]);
  }
}
