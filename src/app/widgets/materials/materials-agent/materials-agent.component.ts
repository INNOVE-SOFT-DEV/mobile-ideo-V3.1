import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {MaterialRequestPage} from "../../modals/material-request/material-request.page";
import {MaterialsAgentPage} from "../../modals/materials-agent/materials-agent.page";
import {MaterialsService} from "src/app/pages/materials/service/materials.service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import {Router} from "@angular/router";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {Location} from "@angular/common";
import {environment} from "src/environments/environment";

@Component({
  selector: "app-materials-agent",
  templateUrl: "./materials-agent.component.html",
  styleUrls: ["./materials-agent.component.scss"],
  standalone: false
})
export class MaterialsAgentComponent implements OnInit {
  loadingMessage: string = "";
  materials: any;
  isSuperVisor: boolean = false;
  webUrl = environment.newWebUrl;

  constructor(
    private modalController: ModalController,
    private materialsService: MaterialsService,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  async ngOnInit() {
    this.isSuperVisor = this.authService.isSuperVisor();
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingService.present(this.loadingMessage);
    this.materialsService.getMyMaterials().subscribe({
      next: async data => {
        this.materials = data.equipment_requests;
        this.materials.materials.forEach((el: any) => {
          el.notes = this.materialsService.getMaterialNote(el.material.notes, el.id);
        });
        await this.loadingService.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingService.dimiss();
      }
    });
  }

  async refresh() {
    await this.loadingService.present(this.loadingMessage);
    this.materialsService.getMyMaterials().subscribe({
      next: async data => {
        this.materials = data.equipment_requests;
        await this.loadingService.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingService.dimiss();
      }
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: MaterialRequestPage,
      cssClass: "materials-modal"
    });
    modal.onDidDismiss().then(result => {
      if (result.data === "refresh") {
        this.refresh();
      }
    });
    return await modal.present();
  }

  goBack() {
    this.location.back();
  }

  async openModaMaterialAgentl(material: any) {
    if (material.state != "pending") {
      const modal = await this.modalController.create({
        component: MaterialsAgentPage,
        cssClass: "materials-agent-modal",
        componentProps: material
      });
      modal.onDidDismiss().then(result => {
        if (result.data === "refresh") {
          this.refresh();
        }
      });
      return await modal.present();
    }
  }

  goToProfile() {
    this.router.navigate(["update"]);
  }
}
