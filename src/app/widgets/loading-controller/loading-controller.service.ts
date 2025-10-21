import {Injectable} from "@angular/core";
import {LoadingController} from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class LoadingControllerService {
  private loading: HTMLIonLoadingElement | null = null;
  private isLoading = false;

  constructor(private loadingController: LoadingController) {}

  async present(loadingMessage: string = "Chargement...") {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.loading = await this.loadingController.create({
      message: loadingMessage,
      spinner: "crescent"
    });

    await this.loading.present();
  }

  async dimiss() {
    if (!this.isLoading || !this.loading) {
      return;
    }

    try {
      await this.loading.dismiss();
    } catch (error) {
      console.warn("Loading already dismissed:", error);
    } finally {
      this.loading = null;
      this.isLoading = false;
    }
  }
}
