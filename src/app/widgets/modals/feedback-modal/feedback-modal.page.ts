import {Component, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";

@Component({
  selector: "app-feedback-modal",
  templateUrl: "./feedback-modal.page.html",
  styleUrls: ["./feedback-modal.page.scss"],
  standalone: false
})
export class FeedbackModalPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}
  dismiss() {
    this.modalController.dismiss();
  }
}
