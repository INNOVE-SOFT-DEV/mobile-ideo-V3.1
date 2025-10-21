import {Component, OnInit} from "@angular/core";
import {ModalController, NavParams} from "@ionic/angular";

@Component({
  selector: "app-documents-modal",
  templateUrl: "./documents-modal.page.html",
  styleUrls: ["./documents-modal.page.scss"],
  standalone: false
})
export class DocumentsModalPage implements OnInit {
  type: string = "";
  url: string = "";
  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.type = this.navParams.get("type");
    this.url = this.navParams.get("url");
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
