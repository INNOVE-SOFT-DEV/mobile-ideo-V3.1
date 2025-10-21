import {Injectable} from "@angular/core";
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class ToastControllerService {
  constructor(private toastController: ToastController) {}
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 400,
      position: "bottom",
      color: color
    });

    toast.present();
  }
}
