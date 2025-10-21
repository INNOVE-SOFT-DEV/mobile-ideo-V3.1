import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {Network} from "@capacitor/network";
import {PhotoReportService} from "../../agents/photo-report/service/photo-report.service";

@Component({
  selector: "app-reports-photos",
  templateUrl: "./reports-photos.page.html",
  styleUrls: ["./reports-photos.page.scss"],
  standalone: false
})
export class ReportsPhotosPage implements OnInit {
  isConnected: boolean = false;
  closeSlider() {
    this.isSliderOpen = false;
  }
  selectedOption = "Tous les agents";
  activeTab: "prestation" | "Camion" = "prestation";
  images: any[] = [];
  imagesCamions: any[] = [];
  imagesCache: any[] = [];
  imagesCamionsCache: any[] = [];
  planning: any;
  team: any[] = [];
  laodingMessage = "Loading...";
  isSliderOpen = false;
  sliderPhotos: any[] = [];
  initialIndexPhoto: number = 0;
  pickedAgent: any;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService,
    private photoReportService: PhotoReportService
  ) {}

  onChange(event: any) {
    this.selectedOption = event.target.value;
    this.team.find(u => {
      if (`${u.first_name} ${u.last_name}` == this.selectedOption) {
        this.pickedAgent = u;
      }
    });

    if (this.selectedOption == "Tous les agents") {
      this.images = this.imagesCache;
      this.imagesCamions = this.imagesCamionsCache;
    } else {
      this.images = this.imagesCache.filter((image: any) => image[0]?.user_id == this.pickedAgent.id || image[1]?.user_id == this.pickedAgent.id);
      this.imagesCamions = this.imagesCamionsCache.filter((image: any) => image.user_id == this.pickedAgent.id);
    }
  }

  async ngOnInit() {
    this.laodingMessage = await this.translateService.get("Loading").toPromise();
    const data = (await JSON.parse(this.route.snapshot.paramMap.get("data")!)) || {};
    this.planning = data;

    this.team = this.planning.team.filter((member: any) => member.first_name || member.last_name);
    await this.loadingService.present(this.laodingMessage);
    Network.getStatus().then(status => {
      this.isConnected = status.connected;
    });

    Network.addListener("networkStatusChange", status => {
      this.isConnected = status.connected;
    });

    this.missionService.getPhotoReportsSupervisor(this.planning.type, this.planning.id).subscribe(
      async data => {
        this.images = Object.values(data.grouped_photos_prestation);
        this.imagesCache = Object.values(data.grouped_photos_prestation);
        this.imagesCamions = data.photos_truck;
        this.imagesCamionsCache = data.photos_truck;
        this.images = Object.values(this.images).map((group: any) => {
          const before = group.find((p: any) => p.photo_type === "photo_before");
          const after = group.find((p: any) => p.photo_type === "photo_after");
          return [before || null, after || null];
        });
        await this.loadingService.dimiss();
      },
      async err => {
        this.images = [];
        this.imagesCamions = [];
        this.imagesCache = [];
        this.imagesCamionsCache = [];
        await this.loadingService.dimiss();
        console.error(err);
      }
    );
  }

  openSlides(type: string, i: number) {
    if (type == "photo_before") {
      this.initialIndexPhoto = i * 2;
      this.sliderPhotos = this.images.flat();
      this.isSliderOpen = true;
    } else if (type == "photo_after") {
      this.initialIndexPhoto = i * 2 + 1;
      this.sliderPhotos = this.images.flat();
      this.isSliderOpen = true;
    } else {
      this.initialIndexPhoto = i;
      this.sliderPhotos = this.imagesCamions;
      this.isSliderOpen = true;
    }
  }
  setActiveTab(tab: "prestation" | "Camion") {
    this.activeTab = tab;
  }

  sendReport() {
    this.router.navigate([
      "/send-report",
      {
        data: JSON.stringify({
          planning_type: this.planning.type,
          planning_id: this.planning.id,
          intervention_id: this.planning.intervention_id,
          date: this.planning.date,
          client_logo_url: this.planning?.logo?.url,
          intervention_name: this.planning?.intervention_name,
          contacts: this.planning?.contacts,
          prestation: this.planning?.prestation,
          prestation_id: this.planning?.prestation_id,
          intervention_days: this.planning.type == "regular" ? this.planning.intervention_days : ""
        })
      }
    ]);
  }

  goBack() {
    this.isSliderOpen ? (this.isSliderOpen = false) : this.location.back();
  }
  async onToggleInclude(data: any, type: string, index: number) {
    let payload: any;
    if (type == "truck")
      payload = {
        id: data.id,
        include: !data.no_include,
        planning_type: this.planning.type
      };
    else {
      if (data[0] == null) {
        payload = {
          id_after: data[1].id,
          include_after: !data[1].no_include,
          planning_type: this.planning.type
        };
      } else if (data[1] == null)
        payload = {
          id_before: data[0].id,
          include_before: !data[0].no_include,
          planning_type: this.planning.type
        };
      else {
        payload = {
          id_after: data[1].id,
          include_after: !data[1].no_include,
          id_before: data[0].id,
          include_before: !data[0].no_include,
          planning_type: this.planning.type
        };
      }
    }

    await this.loadingService.present(this.laodingMessage);
    this.missionService.updateNoIncludePhotos(payload).subscribe(async data => {
      const presentation = [
        data.updated.find((updated: any) => updated?.photo_type == "photo_before") || {photo: {url: "", photo_type: "photo_before"}},
        data.updated.find((updated: any) => updated?.photo_type == "photo_after") || {photo: {url: "", photo_type: "photo_after"}}
      ];

      if (presentation[0].photo.url?.includes("http") || presentation[1].photo.url?.includes("http")) {
        this.images[index] = presentation;
        this.imagesCache[index] = presentation;
      }
      const camion = data.updated.find((updated: any) => updated?.photo_type == "photo_truck") || {photo: {url: "", photo_type: "photo_truck"}};

      if (camion.photo.url?.includes("http")) {
        this.imagesCamions[index] = camion;
        this.imagesCamionsCache[index] = camion;
      }

      await this.loadingService.dimiss();
    });
  }

  async downloadZip() {
    await this.photoReportService.downloadZip(
      this.images.filter((group: any) => group[0]?.no_include == false || group[1]?.no_include == false),
      this.imagesCamions.filter((group: any) => group?.no_include == false),
      this.planning.intervention_name,
      this.planning.type,
      this.planning.date || ""
    );
  }
}
