import {Component, OnInit} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {filter} from "rxjs";
import {MaterialsService} from "../service/materials.service";
import {Location} from "@angular/common";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";

@Component({
  selector: "app-materials-requests-supervisor",
  templateUrl: "./materials-requests-supervisor.page.html",
  styleUrls: ["./materials-requests-supervisor.page.scss"],
  standalone: false
})
export class MaterialsRequestsSupervisorPage implements OnInit {
goScanner() {
    this.router.navigate(["ocr-scanner"]);
}
  pendingCount: any;

  constructor(
    private router: Router,
    private materialService: MaterialsService,
    private location: Location,
    private loadingService: LoadingControllerService
  ) {}

  async ngOnInit() {
    await this.refreshMaterials();
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe(async () => {
      if (this.router.url == "/tabs/materials") {
        await this.refreshMaterials();
      }
    });
  }

  async refreshMaterials() {
    await this.loadingService.present("Chargement...");
    this.materialService.allUserMaterialsCount().subscribe({
      next: async value => {
        this.pendingCount = value.count;
        await this.loadingService.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingService.dimiss();
      }
    });
  }

  goToMaterialRequestProcessed() {
    this.router.navigate(["material-request-processed"]);
  }

  goToMaterialRequest() {
    this.router.navigate(["material-request"]);
  }
  goToMaterialRequestAgent() {
    this.router.navigate(["agent-material"]);
  }
  goBack() {
    this.location.back();
  }

  goToProfile() {
    this.router.navigate(["update"]);
  }
}
