import {Component, Input} from "@angular/core";
import {ModalController} from "@ionic/angular";

@Component({
  selector: "app-agent-sheet",
  templateUrl: "./agent-sheet.component.html",
  styleUrls: ["./agent-sheet.component.scss"],
  standalone: false
})
export class AgentSheetComponent {
  @Input() sheetData: any;
  constructor(private modalCtrl: ModalController) {}

  formatPhoneLink(phone: string): string {
    return phone ? `tel:${phone}` : "";
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
