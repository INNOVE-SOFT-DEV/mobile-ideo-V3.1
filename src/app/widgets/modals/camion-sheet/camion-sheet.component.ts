import {Component, Input} from "@angular/core";
import {ModalController} from "@ionic/angular";

@Component({
  selector: "app-camion-sheet",
  templateUrl: "./camion-sheet.component.html",
  styleUrls: ["./camion-sheet.component.scss"],
  standalone: false
})
export class CamionSheetComponent {
  @Input() sheetData: any;
  constructor(private modalCtrl: ModalController) {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
