import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormControl} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {debounceTime} from "rxjs";
import {MaterialsRepository} from "src/app/repositories/materials/materials-repository";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {ToastControllerService} from "../../toast-controller/toast-controller.service";

@Component({
  selector: "app-material-request",
  templateUrl: "./material-request.page.html",
  styleUrls: ["./material-request.page.scss"],
  standalone: false
})
export class MaterialRequestPage implements OnInit {
  pickedMaterial: any[] = [];
  searchControl = new FormControl();
  @ViewChild("search_input", {static: false}) search_input!: ElementRef;
  materials: any[] = [];
  list_filtered_materials: any[] = [];
  loadingMessage: string = "";
  constructor(
    private modalController: ModalController,
    private materialsRepo: MaterialsRepository,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private toastCtrl: ToastControllerService
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.loadingService.present(this.loadingMessage);
    this.materialsRepo.getMaterials().subscribe({
      next: async value => {
        this.materials = value;
        this.list_filtered_materials = this.materials;
        await this.loadingService.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingService.dimiss();
      }
    });

    this.searchControl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      if (value.length > 0) {
        this.list_filtered_materials = this.materials.filter((material: any) => material.designation.toLowerCase().includes(value));
      } else {
        this.list_filtered_materials = this.materials;
      }
    });
  }

  dismiss() {
    this.modalController.dismiss("refresh");
  }

  PickMaterial(id: number) {
    if (this.pickedMaterial.indexOf(id) != -1) {
      this.pickedMaterial.splice(this.pickedMaterial.indexOf(id), 1);
    } else {
      this.pickedMaterial.push(id);
    }
  }

  requireMaterial() {
    this.loadingService.present(this.loadingMessage);
    this.materialsRepo.requireMaterials({material_ids: this.pickedMaterial}).subscribe({
      next: async value => {
        await this.loadingService.dimiss();
        await this.modalController.dismiss("refresh");
        await this.toastCtrl.presentToast("Demande envoyée avec succès", "success");
      },
      error: async err => {
        await this.loadingService.dimiss();
        await this.toastCtrl.presentToast("Une erreur est survenue. Veuillez réessayer.", "danger");
      }
    });
  }
}
