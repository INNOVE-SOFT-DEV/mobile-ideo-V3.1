import {Component, OnInit} from "@angular/core";
import {ActionSheetController, ModalController, NavParams} from "@ionic/angular";
import {PhotosService} from "../../photos/photos.service";
import {PdfTakerService} from "../../pdf-taker/pdf-taker.service";
import {Browser} from "@capacitor/browser";
import {ToastControllerService} from "../../toast-controller/toast-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {AbsenceService} from "src/app/tab3/service/absence/absence.service";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";

@Component({
  selector: "app-make-request",
  templateUrl: "./make-request.page.html",
  styleUrls: ["./make-request.page.scss"],
  standalone: false
})
export class MakeRequestPage implements OnInit {
  selectedStartDate: string = new Date().toISOString().split("T")[0];
  selectedEndDate: string = new Date().toISOString().split("T")[0];
  minDate: string;
  absenceType: string = "";
  imagePreview: string = "";
  filePreview: any;
  isPdf: boolean = false;
  absences: any;
  reasonRequired: string = "";
  usedDate: string = "";
  loading: boolean = false;
  absenceToUpdate: any;
  currentDate: any;

  constructor(
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private photosService: PhotosService,
    private pdfTaker: PdfTakerService,
    private navParams: NavParams,
    private toastCtrl: ToastControllerService,
    private translateService: TranslateService,
    private absenceService: AbsenceService,
    private loadingCtrl: LoadingControllerService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split("T")[0];
    this.translateService.get("Absence reason required").subscribe((translatedText: string) => {
      this.reasonRequired = translatedText;
    });
    this.translateService.get("Absence date already taken").subscribe((translatedText: string) => {
      this.usedDate = translatedText;
    });
  }

  ngOnInit() {
    this.absences = this.navParams.get("absences");
    this.absenceToUpdate = this.navParams.get("update");
    if (this.absenceToUpdate) {
      this.selectedEndDate = this.absenceToUpdate.date_end;
      this.selectedStartDate = this.absenceToUpdate.date_start;
      if (this.absenceToUpdate.document.url && this.absenceToUpdate.document.url.includes("pdf")) {
        this.filePreview = this.absenceToUpdate.document.url;
        this.isPdf = true;
      } else if (this.absenceToUpdate.document.url && !this.absenceToUpdate.document.url.includes("pdf")) {
        this.imagePreview = this.absenceToUpdate.document.url;
        this.isPdf = false;
      }
      this.absenceType = this.absenceToUpdate.type_absence;
    }
  }

  updateStartDate(event: any) {
    this.selectedStartDate = event.detail.value.split("T")[0];
    if (this.selectedEndDate && this.selectedStartDate && this.selectedEndDate < this.selectedStartDate) {
      this.selectedEndDate = this.selectedStartDate;
    }
  }

  updateEndDate(event: any) {
    const newEndDate = event.detail.value.split("T")[0];
    if (this.selectedStartDate && newEndDate < this.selectedStartDate) {
      alert("La date de fin ne peut pas être avant la date de début !");
      return;
    }
    this.selectedEndDate = newEndDate;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async takeFile() {
    const actionSheet = await this.actionSheetController.create({
      header: "Choisir option :",
      buttons: [
        {
          text: "Camera",
          handler: async () => {
            await this.photosService.takePictureOption("Camera", 40);
            this.imagePreview = `data:image/${this.photosService.lastImage.format};base64,${this.photosService.lastImage.base64String}`;
            this.isPdf = false;
          }
        },
        {
          text: "Galerie",
          handler: async () => {
            await this.photosService.takePictureOption("Galerie", 40);
            this.imagePreview = `data:image/${this.photosService.lastImage.format};base64,${this.photosService.lastImage.base64String}`;
            this.isPdf = false;
          }
        },
        {
          text: "Document",
          handler: async () => {
            this.filePreview = await this.pdfTaker.selectPdf();
            this.isPdf = true;
          }
        },
        {
          text: "Annuler",
          handler: () => {}
        }
      ]
    });

    await actionSheet.present();
  }

  async previewDocument() {
    if (typeof this.filePreview == "string") await Browser.open({url: this.filePreview});
    else {
      const fileURL = URL.createObjectURL(this.filePreview);
      await Browser.open({url: fileURL});
    }
  }

  async saveRequest() {
    if (!this.absenceType) {
      await this.toastCtrl.presentToast(this.reasonRequired, "danger");
    } else {
      if (this.selectedStartDate != null && this.selectedEndDate != null) {
        let isDateAvailable;
        if (this.absenceToUpdate) isDateAvailable = this.isDateRangeAvailable(this.selectedStartDate, this.selectedEndDate, this.absenceToUpdate?.id);
        else isDateAvailable = this.isDateRangeAvailable(this.selectedStartDate, this.selectedEndDate, this.absenceToUpdate?.id);
        if (!isDateAvailable) await this.toastCtrl.presentToast(this.usedDate, "danger");
        else {
          this.loading = true;
          const uploadData = new FormData();
          uploadData.append("type_absence", this.absenceType);
          uploadData.append("date_start", this.selectedStartDate);
          uploadData.append("date_end", this.selectedEndDate);
          if (this.isPdf) {
            const fileName = new Date().getTime() + "." + "pdf";
            uploadData.append("document", this.filePreview, fileName);
          } else if (this.imagePreview != "") {
            const fileName = new Date().getTime() + "." + this.photosService.lastImage.format;
            const file = this.base64ToFile(this.photosService.lastImage.base64String, fileName, this.photosService.lastImage.format);
            uploadData.append("document", file, fileName);
          }
          if (this.absenceToUpdate) {
            this.absenceService.updateAbsenceRequest(uploadData, this.absenceToUpdate.id).subscribe({
              next: update => {
                this.loading = false;
                const data = {update, isUpdate: true};
                this.modalController.dismiss(data);
              },
              error: error => {
                this.loading = false;
                console.error(error);
              }
            });
          } else {
            this.absenceService.sendAbsenceRequest(uploadData).subscribe({
              next: data => {
                this.loading = false;
                this.modalController.dismiss(data);
              },
              error: error => {
                this.loading = false;
                console.error(error);
              }
            });
          }
        }
      }
    }
  }

  base64ToFile(base64String: string, filename: string, format: string): File {
    const byteString = atob(base64String);
    const mimeString = `image/${format}`;
    const ab = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ab[i] = byteString.charCodeAt(i);
    }
    return new File([ab], filename, {type: mimeString});
  }
  isDateRangeAvailable(date_start: string, date_end: string, id?: number): boolean {
    const newStart = new Date(date_start);
    const newEnd = new Date(date_end);
    let allAbsences = [...this.absences.pending, ...this.absences.allowed];
    if (id) {
      allAbsences = allAbsences.filter(absence => absence.id !== id);
    }
    for (const absence of allAbsences) {
      const existingStart = new Date(absence.date_start);
      const existingEnd = new Date(absence.date_end);
      if (newStart <= existingEnd && newEnd >= existingStart) {
        return false;
      }
    }

    return true;
  }
}
