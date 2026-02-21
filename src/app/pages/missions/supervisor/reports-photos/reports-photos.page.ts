import {Component, ElementRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {Network} from "@capacitor/network";
import {PhotoReportService} from "../../agents/photo-report/service/photo-report.service";
import {trigger, style, animate, transition} from "@angular/animations";

@Component({
  animations: [
    trigger("fadeUp", [transition(":enter", [style({opacity: 0, transform: "translateY(15px)"}), animate("300ms ease-out", style({opacity: 1, transform: "translateY(0)"}))])])
  ],
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
    private photoReportService: PhotoReportService,
    private el: ElementRef
  ) {}

  onChange(event: any) {
    this.selectedOption = event.target.value;

    // Trouver l'agent sélectionné
    this.pickedAgent = this.team.find(u => u.full_name === this.selectedOption);

    if (this.selectedOption === "Tous les agents") {
      // Récupérer toutes les images
      this.images = this.imagesCache;
      this.imagesCamions = this.imagesCamionsCache;
    } else if (this.pickedAgent) {
      // Filtrer images before/after par agent
      this.images = this.imagesCache.filter((pair: any) => pair.agent === this.pickedAgent?.full_name);

      // Filtrer images camion par agent
      this.imagesCamions = this.imagesCamionsCache.filter((camion: any) => camion.agent === this.pickedAgent?.full_name);
    } else {
      // Si agent non trouvé, vider les images
      this.images = [];
      this.imagesCamions = [];
    }
  }

  async ngOnInit() {
    this.laodingMessage = await this.translateService.get("Loading").toPromise();
    const data = (await JSON.parse(this.route.snapshot.paramMap.get("data")!)) || {};
    this.planning = data;
    const scheduleId = this.planning.today_schedule.id;
    this.team = this.planning.team.filter((member: any) => (member.first_name || member.last_name) && !member?.manager);

    await this.loadingService.present(this.laodingMessage);
    Network.getStatus().then(status => {
      this.isConnected = status.connected;
    });

    Network.addListener("networkStatusChange", status => {
      this.isConnected = status.connected;
    });

    //this.missionService.getPhotoReportsSupervisor(this.planning.type, this.planning.id).subscribe(
    /*this.missionService.getPhotoReportsSupervisor(this.planning.type, scheduleId).subscribe(
      async data => {
        this.images = Array.isArray(data.images) ? data.images : [];
        this.imagesCache = this.images;

        this.imagesCamions = Array.isArray(data.photos_truck) ? data.photos_truck : [];
        this.imagesCamionsCache = this.imagesCamions;

        // Maintenant tu peux mapper sans erreur
        this.images = this.images.map((group: any[]) => {
          if (!Array.isArray(group)) group = [];

          const before = group.find((p: any) => p.photo_type === "before");
          const after = group.find((p: any) => p.photo_type === "after");

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
    );*/

    this.missionService.getPhotoReportsSupervisor(this.planning.type, scheduleId).subscribe(
      async (data: any[]) => {
        this.images = [];
        this.imagesCamions = [];

        data.forEach(agent => {
          if (Array.isArray(agent.images)) {
            agent.images.forEach((group: any[]) => {
              const item = group[0];

              if (item) {
                this.images.push({
                  before: item.before || null,
                  after: item.after || null,
                  agent: agent.agent
                });
              }
            });
          }

          if (Array.isArray(agent.photos_truck)) {
            agent.photos_truck.forEach((photo: any) => {
              this.imagesCamions.push({
                id: photo.id,
                url: photo.image_url?.url || null,
                agent: agent.agent
              });
            });
          }
        });

        this.imagesCache = [...this.images];
        this.imagesCamionsCache = [...this.imagesCamions];
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
    if (type === "photo_before" || type === "photo_after") {
      this.sliderPhotos = this.images.flatMap(pair => {
        const arr: any[] = [];
        if (pair.before?.image_url?.url) arr.push({photo: {url: pair.before.image_url.url}});
        if (pair.after?.image_url?.url) arr.push({photo: {url: pair.after.image_url.url}});
        return arr;
      });

      this.initialIndexPhoto = type === "photo_before" ? i * 2 : i * 2 + 1;
    } else {
      this.sliderPhotos = this.imagesCamions.map(camion => ({photo: {url: camion.url}}));
      this.initialIndexPhoto = i;
    }

    this.isSliderOpen = true;
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
          intervention_id: this.planning.intervention.id,
          date: this.planning.date,
          client_logo_url: this.planning?.logo?.url,
          intervention_name: this.planning?.intervention.name,
          contacts: this.planning?.contacts,
          prestation: this.planning?.prestation,
          prestation_id: this.planning?.prestation_id,
          logo: this.planning?.intervention?.logos.thumb,
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
    const imageTozip = this.images.map(item => {
      item.before.photo = item.before.image_url;
      item.after.photo = item.after.image_url;

      return [item.before, item.after];
    });

    await this.photoReportService.downloadZip(
      this.images.map(item => {
        item.before.photo = item.before.image_url;
        item.after.photo = item.after.image_url;

        return [item.before, item.after];
      }),
      this.imagesCamions,
      this.planning.intervention.name,
      this.planning.type,
      this.planning.today_schedule.date || ""
    );
  }
}
