import {Component, Input, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {OcrService} from "./ocr-service/ocr.service";
import {LoadingController, ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {environment} from "src/environments/environment";

@Component({
  selector: "app-ocr-scanner",
  templateUrl: "./ocr-scanner.page.html",
  styleUrls: ["./ocr-scanner.page.scss"],
  standalone: false
})
export class OcrScannerPage implements OnInit {
  @Input() result: any;
  form!: FormGroup;
  imageUrl: string = "";

  constructor(
    private loadingCtrl: LoadingController,
    private ocrService: OcrService,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private toast: ToastControllerService
  ) {}
  ngOnInit() {
    const recipe = this.result?.data?.recipe || {};
    this.imageUrl = `${environment.newWebUrl}${this.result?.data?.image_url}`;

    this.form = this.fb.group({
      price: [recipe.price || ""],
      date: [recipe.date || ""],
      item: [recipe.item || ""]
    });
  }

  async confirm() {
    if (!this.form.valid) return;

    const payload = this.form.value; // edited fields only

    // ✅ Prepare your FormData (if backend expects multipart/form-data)
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    formData.append("depense_id", this.result?.data?.id || "");

    const loading = await this.loadingCtrl.create({
      message: "Mise à jour du reçu...",
      spinner: "crescent"
    });
    this.ocrService.updateRecipe(formData).subscribe({
      next: async response => {
        // console.log('Recipe updated successfully:', response);
        await this.toast.presentToast("Confirmation effectuée avec succès", "success");
        await this.modalCtrl.dismiss(this.form.value, "confirm");
        await loading.dismiss();
      },
      error: async error => {
        console.error("Error updating recipe:", error);
        await loading.dismiss();
        await this.toast.presentToast("Une erreur est survenue", "danger");
      }
    });
  }

  async goBack() {
    await this.modalCtrl.dismiss();
  }
}
