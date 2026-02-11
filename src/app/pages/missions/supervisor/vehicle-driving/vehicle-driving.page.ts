import {Component, ElementRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {PopoverController} from "@ionic/angular";
import {IonDatetime} from "@ionic/angular";
import {MaterialsService} from "src/app/pages/materials/service/materials.service";
import {environment} from "src/environments/environment";
import {Browser} from "@capacitor/browser";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";

@Component({
  selector: "app-vehicle-driving",
  templateUrl: "./vehicle-driving.page.html",
  styleUrls: ["./vehicle-driving.page.scss"],
  standalone: false
})
export class VehicleDrivingPage implements OnInit {
  name: string = "";
  id: any;
  currentMonth: string = "";
  selectedDate: string = new Date().toISOString();
  minDate: string = "";
  month: string = "";
  regularDate: string = "";
  isPopoverOpen: boolean = false;
  date: string = new Date().toISOString().split("-")[0] + "-" + new Date().toISOString().split("-")[1];
  returnsUser: any[] = [];
  allReturnsUser: any[] = [];
  isDocumentBlockActive: boolean = false;
  image: any;

  constructor(
    private location: Location,
    private popoverController: PopoverController,
    private route: ActivatedRoute,
    private router: Router,
    private materialsService: MaterialsService,
    private loadingService: LoadingControllerService,
    private translate: TranslateService,
    private el: ElementRef
  ) {}
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.name = this.route.snapshot.paramMap.get("name") || "";
    this.image = this.route.snapshot.paramMap.get("image") || "";
    this.setCurrentMonth();
    this.getUserVehiculeReturns(this.id, this.date);
  }
  async getUserVehiculeReturns(id: any, date: any) {
    const loadingMessage = await this.translate.get("Loading").toPromise();
    await this.loadingService.present(loadingMessage);

    this.materialsService.getUserVehiculeReturns(id, date).subscribe({
      next: async data => {
        this.returnsUser = data || [];
        this.allReturnsUser = data || [];
        await this.loadingService.dimiss();
      },
      error: async err => {
        this.returnsUser = [];
        this.allReturnsUser = [];
        await this.loadingService.dimiss();
        console.error(err);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".anumation-block"));

      blocks.forEach((block, index) => {
        setTimeout(() => {
          block.classList.add("animate__animated", "animate__fadeInUp");
          block.style.opacity = "1";
          block.style.transform = "translateY(0)";
          block.style.animationDuration = "500ms";
        }, index * 100);
      });
    }, 200);
  }
  setCurrentMonth() {
    const date = new Date();
    this.currentMonth = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });
    this.selectedDate = date.toISOString();
  }
  toggleDocumentBlock() {
    this.isDocumentBlockActive = !this.isDocumentBlockActive;
    if (this.isDocumentBlockActive) {
      this.returnsUser = this.allReturnsUser.filter((returnUser: any) => returnUser.contravention);
    } else {
      this.returnsUser = this.allReturnsUser;
    }
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
      event,
      cssClass: "custom-datetime-popover custom-picker-popover"
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
  async updateMonth(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.currentMonth = selectedDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric"
    });
    this.selectedDate = selectedDate.toISOString();
    this.month = selectedDate.toISOString().split("T")[0].slice(0, -3);
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const filterDate = `${year}-${month}`;
    this.regularDate = filterDate;
    this.getUserVehiculeReturns(this.id, this.regularDate);
  }
  vehicleDrivingDetails(data: any) {
    this.router.navigate(["/vehicle-driving-details", {data: JSON.stringify(data), id: this.id, name: this.name, image: this.image}]);
  }
  goBack() {
    this.location.back();
  }
}
