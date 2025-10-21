import {Component, OnInit} from "@angular/core";
import {Browser} from "@capacitor/browser";
import {ModalController} from "@ionic/angular";

@Component({
  selector: "app-gdc",
  templateUrl: "./gdc.page.html",
  styleUrls: ["./gdc.page.scss"],
  standalone: false
})
export class GdcPage implements OnInit {
  openVideo() {
    Browser.open({
      url: "https://www.youtube.com/embed/JKUOlHWaQ5c?si=-2iehC51QmxuAN_f",
      presentationStyle: "popover"
    });
  }
  dismiss() {
    this.modalController.dismiss();
  }

  constructor(private modalController: ModalController) {}

  ngOnInit() {}
}
