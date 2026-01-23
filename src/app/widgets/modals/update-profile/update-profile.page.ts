import {Component, OnInit} from "@angular/core";
import {ActionSheetController, ModalController} from "@ionic/angular";
import {User} from "src/app/models/auth/user";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {ToastControllerService} from "../../toast-controller/toast-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {PhotosService} from "../../photos/photos.service";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";

@Component({
  selector: "app-update-profile",
  templateUrl: "./update-profile.page.html",
  styleUrls: ["./update-profile.page.scss"],
  standalone: false
})
export class UpdateProfilePage implements OnInit {
  user: User | null = this.authService.getCurrentUser();
  phone: string = this.user?.phone || "";
  password: string = "";
  phonePattern = "^(\\+?[0-9]{1,3})?[-.\\s]?([0-9]{2,4})?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$";
  loading: boolean = false;
  successMessage: string = "";
  loadingMessage: string = "";

  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private toastController: ToastControllerService,
    private translateService: TranslateService,
    private photoService: PhotosService,
    private actionSheetCtrl: ActionSheetController,
    private loadingService: LoadingControllerService
  ) {
    this.translateService.get("Success message update profile").subscribe((translatedText: string) => {
      this.successMessage = translatedText;
    });
  }
  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
  }

  dismiss() {
    this.modalController.dismiss(this.user);
  }
  blockChars(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
    this.phone = event.target.value;
  }

  async uploadProfilePic() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Choisir option :",
      cssClass: "header_actionSheet",
      buttons: [
        {
          text: "Camera",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photoService.takePictureOption("Camera", 40);
            await this.updatePicture();
          }
        },
        {
          text: "Galerie",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photoService.takePictureOption("Galerie", 40);
            await this.updatePicture();
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

  async updatePicture() {
    const fileName = new Date().getTime() + ".jpeg";
    const base64Data = this.photoService.lastImage.base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    const uploadData = new FormData();
    const userId = this.user?.id.toString() || "";
    uploadData.append("userId", userId);
    uploadData.append("photo", blob, fileName);
    await this.loadingService.present(this.loadingMessage);
    this.authService.updateProfilePicture(uploadData).subscribe({
      next: async value => {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(value.user));
        this.user = value.user;
        await this.loadingService.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingService.dimiss();
      }
    });
  }

  saveProfile() {
    if (this.user) {
      this.loading = true;
      const data = {
        phone: this.phone,
        password: this.password,
        user_id: this.user.id
      };
      this.authService.updateProfile(data, this.user.id).subscribe({
        next: (response: any) => {
          this.toastController.presentToast(this.successMessage, "success");
          this.loading = false;
          this.user = response.user;
          this.dismiss();
        },
        error: error => {
          this.toastController.presentToast(error.error.error, "danger");
          this.loading = false;
        }
      });
    }
  }
}
