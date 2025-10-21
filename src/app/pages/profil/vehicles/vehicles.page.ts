import {Component, OnInit, ViewChild} from "@angular/core";
import {Location} from "@angular/common";
import {PopoverController} from "@ionic/angular";
import {IonDatetime} from "@ionic/angular";
import {AuthService} from "../../login/service/auth.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {Browser} from "@capacitor/browser";
import {environment} from "src/environments/environment";

@Component({
  selector: "app-vehicles",
  templateUrl: "./vehicles.page.html",
  styleUrls: ["./vehicles.page.scss"],
  standalone: false
})
export class VehiclesPage implements OnInit {
  month: string = "";
  currentMonth: string = "";
  selectedDate: string = new Date().toISOString();
  minDate: string = "";
  isPopoverOpen: boolean = false;
  isDocumentBlockActive: boolean = false;
  loadingMessage: string = "";
  allVehiclesReturns: any[] = [];
  vehiclesReturns: any[] = [];

  constructor(
    private location: Location,
    private popoverController: PopoverController,
    private authService: AuthService,
    private loadingCtrl: LoadingControllerService,
    private translateService: TranslateService
  ) {
    this.setCurrentMonth();
  }

  async ngOnInit() {
    this.month = new Date().toISOString().split("T")[0].slice(0, -3);
    await this.getVehiclesReturnsFromApi(this.month);
  }
  toggleDocumentBlock() {
    this.isDocumentBlockActive = !this.isDocumentBlockActive;
    if (this.isDocumentBlockActive) {
      this.vehiclesReturns = this.allVehiclesReturns.filter((returnVehicule: any) => returnVehicule.contravention);
    } else {
      this.vehiclesReturns = this.allVehiclesReturns;
    }
  }

  setCurrentMonth() {
    const date = new Date();
    this.currentMonth = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });
    this.selectedDate = date.toISOString();
  }

  async updateMonth(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.currentMonth = selectedDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });
    this.selectedDate = selectedDate.toISOString();
    this.month = selectedDate.toISOString().split("T")[0].slice(0, -3);
    await this.getVehiclesReturnsFromApi(this.month);
  }

  async getVehiclesReturnsFromApi(month: string) {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingCtrl.present(this.loadingMessage);
    this.authService.getVehicleHistiory(month).subscribe({
      next: async data => {
        this.vehiclesReturns = data;
        this.allVehiclesReturns = data;
        await this.loadingCtrl.dimiss();
      },
      error: async error => {
        await this.loadingCtrl.dimiss();
        console.error(error);
      }
    });
  }

  async openDocument(url: string) {
    await Browser.open({url: url.replace(environment.urlAPI, environment.url_web)});
  }

  async openPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: IonDatetime,
      componentProps: {
        presentation: "month-year",
        value: this.selectedDate,
        min: this.minDate,
        locale: "fr-FR"
      },
      cssClass: "custom-picker-popover",
      event
    });

    await popover.present();
    const datetimeElement = popover.querySelector("ion-datetime");
    if (datetimeElement) {
      datetimeElement.addEventListener("ionChange", (event: any) => {
        this.updateMonth(event);
        this.closePopover();
      });
    }
  }

  closePopover() {
    this.isPopoverOpen = false;
    this.popoverController.dismiss();
  }

  goBack() {
    this.location.back();
  }
}
