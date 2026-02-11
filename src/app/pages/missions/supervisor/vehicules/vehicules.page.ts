import {Component, ElementRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {MaterialsService} from "src/app/pages/materials/service/materials.service";
import {Router} from "@angular/router";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-vehicules",
  templateUrl: "./vehicules.page.html",
  styleUrls: ["./vehicules.page.scss"],
  standalone: false
})
export class VehiculesPage implements OnInit {
  filterKey: string = "";
  vehicules: any[] = [];
  search_result: any[] = [];

  constructor(
    private location: Location,
    private materialsService: MaterialsService,
    private router: Router,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService,
    private el: ElementRef
  ) {}

  async ngOnInit() {
    const loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingService.present(loadingMessage);

    this.materialsService.getAllVehicules().subscribe(async (data: any) => {
      this.vehicules = data;
      this.search_result = data;
      await this.loadingService.dimiss();
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
  applyFilter() {
    const key = this.filterKey.toLowerCase();
    this.search_result = this.vehicules.filter(vehicle => vehicle.name?.toLowerCase().includes(key));
  }

  vehicleDriving(name: string, id: string, image: string) {
    this.router.navigate(["/vehicle-driving", id, name, encodeURIComponent(image)]);
  }

  goBack() {
    this.location.back();
  }
}
