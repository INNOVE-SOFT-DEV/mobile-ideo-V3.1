import {Component, OnInit} from "@angular/core";
import {ActionSheetController, ModalController, NavParams} from "@ionic/angular";
import {environment} from "src/environments/environment";
import {PhotosService} from "../../photos/photos.service";
import {MaterialsService} from "src/app/pages/materials/service/materials.service";
import {IonAlertCustomEvent, OverlayEventDetail} from "@ionic/core";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import {ToastControllerService} from "../../toast-controller/toast-controller.service";
import {MapService} from "../../map/map.service";
import {GeolocationService} from "../../geolocation/geolocation.service";

@Component({
  selector: "app-materials-agent",
  templateUrl: "./materials-agent.page.html",
  styleUrls: ["./materials-agent.page.scss"],
  standalone: false
})
export class MaterialsAgentPage implements OnInit {
  material: any;
  api = environment.urlAPI;
  web = environment.url_web;
  photos_materials: any[] = [];
  restitution_photos: any[] = [];
  grouped_photos_materials: any = [[{photo: {url: ""}}, {photo: {url: ""}}, {photo: {url: ""}}]];
  grouped_restitution_photos: any = [[{photo: {url: ""}}, {photo: {url: ""}}, {photo: {url: ""}}]];
  isAlertOpen = false;
  alertButtons = ["Oui, supprimer"];
  photoToDelete: any;
  isSliderOpen: boolean = false;
  sliderPhotos: any[] = [];
  initialIndexPhoto: any;
  loadingMessage: string = "";
  note: string = "";
  isPhotoMaterialsEmpty: boolean = true;
  isReturnPhotosEmpty: boolean = true;

  constructor(
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private photosService: PhotosService,
    private materialService: MaterialsService,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private navParams: NavParams,
    private toasCtrl: ToastControllerService,
    private mapService: MapService,
    private geolocationService: GeolocationService
  ) {}

  async ngOnInit() {
    this.material = this.navParams.data;
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingService.present(this.loadingMessage);
    this.materialService.getMaterialById(this.material.id).subscribe({
      next: async value => {
        this.material = value.material;
        if (value.photos_materials.length > 0) {
          this.isPhotoMaterialsEmpty = false;
        }
        if (value.return_materials.length > 0) {
          this.isReturnPhotosEmpty = false;
        }
        this.photos_materials = value.photos_materials;
        this.restitution_photos = value.return_materials;
        if (this.photos_materials?.length == 0) {
          this.photos_materials.push({photo: {url: ""}});
        }
        if (this.restitution_photos?.length == 0) {
          this.restitution_photos.push({photo: {url: ""}});
        }
        this.grouped_photos_materials = this.chunkArray(this.photos_materials, 3);
        this.grouped_restitution_photos = this.chunkArray(this.restitution_photos, 3);
        await this.loadingService.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingService.dimiss();
      }
    });
  }

  dismiss() {
    if (this.isSliderOpen) this.isSliderOpen = false;
    else this.modalController.dismiss();
  }

  openSlides(type: string, i: number) {
    this.isSliderOpen = true;
    type == "photo" ? (this.sliderPhotos = this.grouped_photos_materials.flat()) : (this.sliderPhotos = this.grouped_restitution_photos.flat());
  }

  async destroyIfConfirmed($event: IonAlertCustomEvent<OverlayEventDetail<any>>) {
    this.isAlertOpen = false;
    $event.preventDefault();
    if ($event.detail.role == "backdrop") return;
    else {
      await this.loadingService.present(this.loadingMessage);

      this.materialService.destroyPhoto(this.photoToDelete.type, this.photoToDelete.id).subscribe({
        next: async () => {
          if (this.photoToDelete.type == "photo") {
            this.grouped_photos_materials[this.photoToDelete.l][this.photoToDelete.i] = {photo: {url: ""}};
          } else if (this.photoToDelete.type == "return") {
            this.grouped_restitution_photos[this.photoToDelete.l][this.photoToDelete.i] = {photo: {url: ""}};
          }
          await this.loadingService.dimiss();
        },
        error: async err => {
          console.error(err);
          await this.loadingService.dimiss();
        }
      });
    }
  }

  async takePicture(type: string, l: number, i: number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Choisir option :",
      cssClass: "header_actionSheet",
      buttons: [
        {
          text: "Camera",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Camera", 40);
            await this.uploadPhoto(this.photosService.lastImage, type, l, i);
          }
        },
        {
          text: "Galerie",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Galerie", 40);
            await this.uploadPhoto(this.photosService.lastImage, type, l, i);
          }
        },
        {
          text: "Annuler",
          cssClass: "btn_actionSheet",
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  addPhotoMaterial() {
    this.grouped_photos_materials.push([{photo: {url: ""}}, {photo: {url: ""}}, {photo: {url: ""}}]);
  }

  addPhotoRestitutionMaterial() {
    if (
      this.grouped_restitution_photos[this.grouped_restitution_photos.length - 1][0]?.photo?.url.includes("http") &&
      this.grouped_restitution_photos[this.grouped_restitution_photos.length - 1][1]?.photo?.url.includes("http") &&
      this.grouped_restitution_photos[this.grouped_restitution_photos.length - 1][2]?.photo?.url.includes("http")
    ) {
      this.grouped_restitution_photos.push([{photo: {url: ""}}, {photo: {url: ""}}, {photo: {url: ""}}]);
    }
  }

  async uploadPhoto(img: any, type: string, l: number, i: number) {
    const fileName = new Date().getTime() + ".jpeg";
    const base64Data = img.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    const uploadData = new FormData();
    uploadData.append("photo", blob, fileName);
    uploadData.append("material_id", this.material.material.id);
    uploadData.append("user_material_id", this.material.id + "");
    this.loadingService.present(this.loadingMessage);
    this.materialService.addPhoto(uploadData, type).subscribe({
      next: () => {
        this.materialService.getMaterialById(this.material.id).subscribe({
          next: async value => {
            if (type == "photo") {
              this.grouped_photos_materials[l][i] = value.photos_materials[value.photos_materials.length - 1];
            } else if (type == "return") {
              this.grouped_restitution_photos[l][i] = value.return_materials[value.return_materials.length - 1];
              this.isReturnPhotosEmpty = false;
            }
            await this.loadingService.dimiss();
          },
          error: async err => {
            console.error(err);
            await this.loadingService.dimiss();
          }
        });
      },
      error: async err => {
        console.error(err);
        await this.loadingService.dimiss();
      }
    });
  }

  async setOpen(ev: any, type: string, id: number, photo: any, l: number, i: number) {
    this.isAlertOpen = true;
    this.photoToDelete = {
      id,
      type,
      l,
      i
    };
  }

  chunkArray(array: any, chunkSize: number) {
    const groups = [];
    const remainder = array?.length % chunkSize;
    let startIndex = 0;
    while (startIndex < array.length) {
      let endIndex = startIndex + chunkSize;
      if (remainder !== 0 && endIndex >= array.length) {
        const emptyUrlsToAdd = chunkSize - remainder;
        for (let i = 0; i < emptyUrlsToAdd; i++) {
          array.push({photo: {url: ""}});
        }
        endIndex = array.length;
      }
      groups.push(array.slice(startIndex, endIndex));
      startIndex = endIndex;
    }
    return groups;
  }

  async takeMaterial() {
    await this.loadingService.present(this.loadingMessage);
    let state = this.material.state;
    if (state == "in_progress") {
      const hasURls = this.grouped_restitution_photos.flat().filter((photo: any) => {
        return photo.photo.url?.includes("http");
      });
      if (hasURls!.length == 0) {
        this.isReturnPhotosEmpty = true;
        this.toasCtrl.presentToast("Merci d'ajouter au moins une photo restitution", "danger");
        await this.loadingService.dimiss();
        return;
      }
      const distance = this.geolocationService.getDistanceFromCurrentLoaction({
        longitude: this.material.material.long,
        latitude: this.material.material.lat
      });
      if (false) {
        this.toasCtrl.presentToast("Vous etes trés au point de restitution", "danger");
        await this.loadingService.dimiss();
        return;
      }
    }
    state == "to_collect" ? (state = "in_progress") : (state = "returned");
    this.materialService.takeMaterialRequest(this.note, this.material.material.id, state, this.material.id).subscribe({
      next: async value => {
        await this.loadingService.dimiss();
        this.modalController.dismiss("refresh");
      },
      error: async err => {}
    });
  }

  direction() {
    this.mapService.address = this.material.material.address_recup;
    this.mapService.longitude = this.material.material.long;
    this.mapService.latitude = this.material.material.lat;
    this.mapService.direction();
  }
}
