import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {InfoBoxMaterialPage} from "src/app/widgets/modals/info-box-material/info-box-material.page";
import {ModalController} from "@ionic/angular";
import {MaterialsService} from "../service/materials.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-request-processed",
  templateUrl: "./request-processed.page.html",
  styleUrls: ["./request-processed.page.scss"],
  standalone: false
})
export class RequestProcessedPage implements OnInit {
  filterType: string = "";
  filterKey: string = "";
  materials: any;
  AllMaterials: any;
  loadingMessage: any;
  constructor(
    private location: Location,
    private modalController: ModalController,
    private materialService: MaterialsService,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingService.present(this.loadingMessage);
    this.materialService.allUserMaterials(["returned"]).subscribe({
      next: async value => {
        this.AllMaterials = value.materials;
        this.materials = value.materials;
        await this.loadingService.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingService.dimiss();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  async openModal(material: any) {
    const modal = await this.modalController.create({
      component: InfoBoxMaterialPage,
      componentProps: material,
      cssClass: "custom-modal"
    });
    modal.onDidDismiss().then(result => {
      if (result.data === "refresh") {
      }
    });
    return await modal.present();
  }

  fliterUserMAterials() {
    if (this.filterType == "agents") {
      this.materials = this.AllMaterials.filter((item: any) => {
        const first = item.user_first_name?.toLowerCase() || "";
        const last = item.user_last_name?.toLowerCase() || "";
        return first.includes(this.filterKey.toLowerCase()) || last.includes(this.filterKey.toLowerCase());
      });
    }
    if (this.filterType == "consumable" || this.filterType == "tool") {
      this.materials = this.AllMaterials.filter((item: any) => {
        const name = item.material.name?.toLowerCase() || "";
        return item.material.type_material == this.filterType && name.includes(this.filterKey);
      });
    }

    if (this.filterType == "") {
      this.materials = this.AllMaterials.filter((item: any) => {
        const name = item.material.name?.toLowerCase() || "";
        const first = item.user_first_name?.toLowerCase() || "";
        const last = item.user_last_name?.toLowerCase() || "";
        return name.includes(this.filterKey) || first.includes(this.filterKey.toLowerCase()) || last.includes(this.filterKey.toLowerCase());
      });
    }
  }
}
