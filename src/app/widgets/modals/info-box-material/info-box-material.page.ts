import {Component, OnInit} from "@angular/core";
import {ModalController, NavParams} from "@ionic/angular";
import {MaterialsService} from "src/app/pages/materials/service/materials.service";

@Component({
  selector: "app-info-box-material",
  templateUrl: "./info-box-material.page.html",
  styleUrls: ["./info-box-material.page.scss"],
  standalone: false
})
export class InfoBoxMaterialPage implements OnInit {
  material: any;
  materialData: any;
  loadingAccept: boolean = false;
  constructor(
    private modalController: ModalController,
    private materialService: MaterialsService,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.material = this.navParams.data;
    this.materialService.getMaterialById(this.material.id).subscribe({
      next: async value => {
        this.materialData = value;
        this.material.note = this.materialService.getMaterialNote(this.materialData.material.material.notes, this.materialData.material.id);
      },
      error(err) {
        console.error(err);
      }
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  confirm() {
    this.loadingAccept = true;
    this.materialService.changeUserMaterialState("to_collect", this.material.id).subscribe({
      next: async value => {
        this.loadingAccept = false;
        this.modalController.dismiss("refresh");
      },
      error: async err => {
        this.loadingAccept = false;
        console.error(err);
      }
    });
  }
}
