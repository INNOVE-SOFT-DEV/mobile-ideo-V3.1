import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {User} from "src/app/models/auth/user";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {MaterialsAgentPage} from "src/app/widgets/modals/materials-agent/materials-agent.page";
import {AuthService} from "../../login/service/auth.service";
import {MaterialRequestPage} from "../material-request/material-request.page";
import {MaterialsService} from "../service/materials.service";

@Component({
  selector: "app-agent-material",
  templateUrl: "./agent-material.page.html",
  styleUrls: ["./agent-material.page.scss"],
  standalone: false
})
export class AgentMaterialPage implements OnInit {
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

  goToProfile() {
    this.router.navigate(["update"]);
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
}
