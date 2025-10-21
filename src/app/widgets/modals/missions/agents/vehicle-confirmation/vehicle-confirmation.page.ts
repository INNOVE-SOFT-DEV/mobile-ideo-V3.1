import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";

@Component({
  selector: "app-vehicle-confirmation",
  templateUrl: "./vehicle-confirmation.page.html",
  styleUrls: ["./vehicle-confirmation.page.scss"],
  standalone: false
})
export class VehicleConfirmationPage implements OnInit {
  success: string = "400";
  @Input() data: any;
  loadingMessage: any;
  constructor(
    private modalController: ModalController,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
  }
  async dismiss(confirmed: string) {
    await this.loadingService.present(this.loadingMessage);

    this.modalController.dismiss(confirmed);
  }
}
