import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {AuthService} from "../../login/service/auth.service";
import {User} from "src/app/models/auth/user";
import {PhotosService} from "src/app/widgets/photos/photos.service";
import {ActionSheetController, ModalController} from "@ionic/angular";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {DocumentsModalPage} from "src/app/widgets/modals/documents-modal/documents-modal.page";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.page.html",
  styleUrls: ["./documents.page.scss"],
  standalone: false
})
export class DocumentsPage implements OnInit {
  user: any = null;
  loadingMessage: string = "";

  constructor(
    private location: Location,
    private authServie: AuthService,
    private photosService: PhotosService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingControllerService,
    private toastCtrl: ToastControllerService,
    private translateService: TranslateService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.user = this.authServie.getCurrentUser();
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.loadingCtrl.present(this.loadingMessage);
    this.authServie.getUserById(this.user.id).subscribe({
      next: async data => {
        this.user = data;
        await this.loadingCtrl.dimiss();
      },
      error: async error => {
        await this.loadingCtrl.dimiss();
        console.error(error);
      }
    });
  }

  public async addDocument(type: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Choisir option :",
      cssClass: "header_actionSheet",
      buttons: [
        {
          text: "Camera",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Camera", 40);
            await this.sendDocumentToApi(type, this.photosService.lastImage);
          }
        },
        {
          text: "Galerie",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Galerie", 40);
            await this.sendDocumentToApi(type, this.photosService.lastImage);
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

  async sendDocumentToApi(type: string, image: any) {
    const fileName = new Date().getTime() + ".jpeg";
    const base64Data = image.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    const uploadData = new FormData();
    const doc_name = type;
    uploadData.append(doc_name, blob, fileName);
    await this.loadingCtrl.present(this.loadingMessage);
    this.authServie.uploadUserDocument(uploadData).subscribe({
      next: async updatedUser => {
        this.user = updatedUser;
        await this.loadingCtrl.dimiss();
        await this.toastCtrl.presentToast("Document ajouter avec succès", "success");
      },
      error: async error => {
        console.error(error);
        await this.loadingCtrl.dimiss();
        await this.toastCtrl.presentToast("Echec de chargement de document", "danger");
      }
    });
  }

  async displayDocument(url: string, type: string) {
    const modal = await this.modalController.create({
      component: DocumentsModalPage,
      cssClass: "update-profile-modal",
      animated: true,
      showBackdrop: true,
      componentProps: {url, type}
    });
    return await modal.present();
  }

  goBack() {
    this.location.back();
  }
}
