import {Component, ElementRef, OnInit, ViewChild, Injector} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {Location} from "@angular/common";
import {GoogleMapsLoaderService} from "../../../../widgets/location-load/google-maps-loader.service";
import {MapService} from "src/app/pages/pointage/services/map.service";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {MaterialsService} from "src/app/pages/materials/service/materials.service";
import {ChangeDetectorRef} from "@angular/core";
import {AgentSheetComponent} from "src/app/widgets/modals/agent-sheet/agent-sheet.component";
import {CamionSheetComponent} from "src/app/widgets/modals/camion-sheet/camion-sheet.component";

@Component({
  selector: "app-agent-tracking",
  templateUrl: "./agent-tracking.page.html",
  styleUrls: ["./agent-tracking.page.scss"],
  standalone: false
})
export class AgentTrackingPage implements OnInit {
  @ViewChild("map", {static: true}) mapElement!: ElementRef;

  isAgent = false;
  isCamion = false;
  isSheetOpen = false;
  agents: any[] = [];
  vehicules: any[] = [];
  agent: any;
  seenCamion: boolean = true;
  camion: any;

  searchTerm: string = "";
  filteredAgents: any[] = [];
  filteredVehicules: any[] = [];
  type: string = "";

  selectedData: any;
  selectedType: "agent" | "camion" = "agent";

  componentMap: {[key: string]: any} = {
    agent: AgentSheetComponent,
    camion: CamionSheetComponent
  };

  constructor(
    private location: Location,
    private googleMapsLoader: GoogleMapsLoaderService,
    private mapService: MapService,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private translationService: TranslateService,
    private materialsService: MaterialsService,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private modalCtrl: ModalController,
    private el: ElementRef
  ) {}

  async ngOnInit() {
    await this.realoadMaps();
  }
  async realoadMaps() {
    if (this.isAgent) {
      this.getAgents();
    }
    if (this.isCamion) {
      this.getAllVehicules();
    }
    const userPosition = await this.mapService.getUserLocation();
    await this.mapService.initMap(this.mapElement, userPosition.lat, userPosition.lng);
    this.mapService.addUserMarker(userPosition, "Moi", "assets/img/user.png");
    this.mapService.addCircle(userPosition.lat, userPosition.lng, 500);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".custom-block"));

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

  loadCamionsMarkers() {
    if (!this.vehicules || this.vehicules.length === 0) {
      console.warn("Aucun vehicule à afficher");
      return;
    }

    for (const vehicule of this.vehicules) {
      if (vehicule.lat && vehicule.long) {
        const position = {
          lat: parseFloat(vehicule.lat),
          lng: parseFloat(vehicule.long)
        };

        this.mapService.addMarkerAgent(position, vehicule.name, vehicule.photo?.url || "assets/default-avatar.png", {width: 30, height: 30}, () => {
          this.openSheet(vehicule, "camion");
        });

        this.mapService.addCircle(position.lat, position.lng, 500);
      }
    }
  }

  loadAgentsMarkers() {
    if (!this.agents || this.agents.length === 0) {
      console.warn("Aucun agent à afficher");
      return;
    }

    for (const agent of this.agents) {
      if (agent.user.current_position_lat && agent.user.current_position_long) {
        const position = {
          lat: parseFloat(agent.user.current_position_lat),
          lng: parseFloat(agent.user.current_position_long)
        };

        this.mapService.addMarkerAgent(position, agent.name, agent.user.photo?.url || "assets/default-avatar.png", {width: 30, height: 30}, () => {
          this.openSheet(agent, "agent");
        });

        this.mapService.addCircle(position.lat, position.lng, 500);
      }
    }
  }
  async getAllVehicules() {
    const loadingMessage = await this.translationService.get("Loading").toPromise();
    await this.loadingService.present(loadingMessage);
    this.materialsService.getAllVehicules().subscribe(async (data: any) => {
      this.vehicules = data;
      this.loadCamionsMarkers();
      await this.loadingService.dimiss();
    });
  }

  async getAgents() {
    const message = await this.translationService.get("loading").toPromise();
    await this.loadingService.present(message);

    this.missionService.getDispatchAgent().subscribe({
      next: async value => {
        this.agents = value.data;
        this.loadAgentsMarkers();
        await this.loadingService.dimiss();
      },
      error: async error => {
        console.error("Erreur lors du chargement des agents:", error);
        await this.loadingService.dimiss();
      }
    });
  }

  async openSheet(data: any, type: "agent" | "camion") {
    const component = this.componentMap[type];
    const modal = await this.modalCtrl.create({
      component,
      componentProps: {sheetData: data},
      cssClass: "my-sheet-modal"
    });
    await modal.present();

    modal.onDidDismiss().then(() => {
      this.isSheetOpen = false;
    });
  }

  formatPhoneLink(phone?: string): string {
    if (!phone) return "";
    return "tel://" + phone.replace(/\s+/g, "");
  }

  async initMapAndUserPosition() {
    const planningLat = 35.8219776;
    const planningLng = 10.6266624;
    await this.mapService.initMap(this.mapElement, planningLat, planningLng);
    this.mapService.addMarker({lat: planningLat, lng: planningLng}, "Lieu d'intervention", "assets/img/building_marker.png", {width: 30, height: 30});
    this.mapService.addCircle(planningLat, planningLng);
  }

  onAgentToggleChange(event: any) {
    this.isAgent = event.detail.checked;
    if (this.isAgent) {
      this.getAgents();
    } else {
      this.realoadMaps();
    }
  }

  onCamionToggleChange(event: any) {
    this.isCamion = event.detail.checked;

    if (this.isCamion) {
      this.getAllVehicules();
    } else {
      this.realoadMaps();
    }
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredAgents = [];
    this.filteredVehicules = [];

    this.mapService.clearMarkers();

    if (this.isAgent) {
      this.filteredAgents = this.agents.filter(agent => `${agent.user?.first_name || ""} ${agent.user?.last_name || ""}`.toLowerCase().includes(term));

      this.filteredAgents.forEach(agent => {
        const position = {
          lat: parseFloat(agent.user.current_position_lat),
          lng: parseFloat(agent.user.current_position_long)
        };
        this.mapService.addMarkerAgent(position, `${agent.user.first_name} ${agent.user.last_name}`, agent.user?.photo?.url, {width: 30, height: 30}, () => {
          this.openSheet(agent, "agent");
        });
        this.mapService.addCircle(position.lat, position.lng, 500);
      });
    }

    if (this.isCamion) {
      this.filteredVehicules = this.vehicules.filter(camion => (camion.name || "").toLowerCase().includes(term));

      this.filteredVehicules.forEach(camion => {
        const position = {
          lat: parseFloat(camion.lat),
          lng: parseFloat(camion.long)
        };
        this.mapService.addMarkerAgent(position, camion.name, camion?.photo?.url, {width: 30, height: 30}, () => {
          this.openSheet(camion, "camion");
        });
        this.mapService.addCircle(position.lat, position.lng, 500);
      });
    }

    const result = [...this.filteredAgents, ...this.filteredVehicules];
    if (result.length > 0) {
      const first =
        this.isAgent && this.filteredAgents.length > 0
          ? {
              lat: parseFloat(this.filteredAgents[0].user.current_position_lat),
              lng: parseFloat(this.filteredAgents[0].user.current_position_long)
            }
          : {
              lat: parseFloat(this.filteredVehicules[0].lat),
              lng: parseFloat(this.filteredVehicules[0].long)
            };

      this.mapService.panTo(first.lat, first.lng);
      this.mapService.setZoom(15);
    }
  }

  goBack() {
    this.location.back();
  }
}
