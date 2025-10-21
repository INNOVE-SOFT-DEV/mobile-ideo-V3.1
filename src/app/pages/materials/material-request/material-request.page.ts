import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {MaterialsService} from "../service/materials.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {InfoBoxMaterialPage} from "src/app/widgets/modals/info-box-material/info-box-material.page";
import {ModalController} from "@ionic/angular";

@Component({
  selector: "app-material-request",
  templateUrl: "./material-request.page.html",
  styleUrls: ["./material-request.page.scss"],
  standalone: false
})
export class MaterialRequestPage implements OnInit {
  materials: any;
  AllMaterials: any;

  loadingMessage: string = "";
  filterType: string = "";
  filterKey: string = "";

  constructor(
    private location: Location,
    private materialService: MaterialsService,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingService.present(this.loadingMessage);
    this.getPendingMaterialsRequest();
  }
  goBack() {
    this.location.back();
  }

  getPendingMaterialsRequest() {
    this.materialService.allUserMaterials(["pending"]).subscribe({
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

  async openModal(material: any) {
    const modal = await this.modalController.create({
      component: InfoBoxMaterialPage,
      cssClass: "custom-modal",
      componentProps: material
    });
    modal.onDidDismiss().then(result => {
      if (result.data === "refresh") {
        this.getPendingMaterialsRequest();
      }
    });

    return await modal.present();
  }
}
