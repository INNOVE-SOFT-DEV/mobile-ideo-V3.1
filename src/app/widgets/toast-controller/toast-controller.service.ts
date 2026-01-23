import {Injectable} from "@angular/core";
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class ToastControllerService {
  constructor(private toastController: ToastController) {}

  async presentToast(message: string, type: string = "success") {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "middle",
      icon: "notifications-outline",
      cssClass: `custom-toast-${type}`,
      translucent: true
    });

    toast.present();
  }
}
