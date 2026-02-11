import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {GoogleMapsLoaderService} from "../../../../widgets/location-load/google-maps-loader.service";
import {MapService} from "../../services/map.service";
import {PointageService} from "../../services/pointage.service";
import {GeolocationService} from "../../../../widgets/geolocation/geolocation.service";
import {ActionSheetController} from "@ionic/angular";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";

@Component({
  selector: "app-pointage",
  templateUrl: "./pointage.page.html",
  styleUrls: ["./pointage.page.scss"],
  standalone: false
})
export class PointagePage implements OnInit, OnDestroy {
  @ViewChild("map", {static: true}) mapElement!: ElementRef;
  teamMember: any;
  userCoordinates: any;
  planning: any;
  user: any;
  currentTime: string = "";
  intervalTimeId: any;
  intervalPositionId: any;
  sliderX = 0;
  startX = 0;
  maxSlide = window.innerWidth - 110;
  pointing_internal: any = {};
  type: any;
  pointingType: string = "";
  loadingMessage: string = "";
  address: string = "";
  constructor(
    private location: Location,
    private authService: AuthService,
    private route: ActivatedRoute,
    private googleMapsLoader: GoogleMapsLoaderService,
    private mapService: MapService,
    public pointageService: PointageService,
    private geolocationService: GeolocationService,
    public actionSheetController: ActionSheetController,
    private missionService: MissionService,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private toastController: ToastControllerService
  ) {}

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
    const user_v3: any = JSON.parse(localStorage.getItem("user-v3") || "{}");
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.planning = JSON.parse(localStorage.getItem("currentPlanning")!).planning;
    this.pointing_internal = this.planning.team.find((user: any) => user.id == user_v3.id)?.pointing_internal[0];
    this.type = this.route.snapshot.paramMap.get("type");
    this.user = this.authService.getCurrentUser();
    this.updateTime();
    await this.mapService.loadGoogleMapsApi();
    await this.initMapAndUserPosition();
    this.intervalTimeId = setInterval(() => this.updateTime(), 1000);
    this.googleMapsLoader.apiLoaded$.subscribe(async loaded => {
      if (loaded) {
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalTimeId);
    clearInterval(this.intervalPositionId);
  }

  async initMapAndUserPosition() {
    // console.log("Initializing map...", this.planning);

    const planningLat = parseFloat(this.planning.intervention.address.latitude);
    const planningLng = parseFloat(this.planning.intervention.address.longitude);

    await this.mapService.initMap(this.mapElement, planningLat, planningLng);
    this.mapService.addMarker({lat: planningLat, lng: planningLng}, "Lieu d'intervention", "assets/img/building_marker.png", {width: 30, height: 30});
    this.mapService.addCircle(planningLat, planningLng);
    await this.updateUserPosition();
    this.intervalPositionId = setInterval(() => this.updateUserPosition(), 15000);
  }
  getFirstThreeWords(text: string | undefined): string {
    let address = this.planning?.intervention?.address;
    address = [address?.postal_code, address?.street, address?.complement, address?.city, address?.country].filter(v => v && v.toString().trim() !== ""); // remove null, undefined, or empty strings
    if (!text) return "";
    // const words = text.split(" ");
    // return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : text;
    return address.join(", ");
  }

  async updateUserPosition() {
    const userPos = await this.mapService.getUserLocation();
    this.mapService.addUserMarker(userPos, `${this.user.first_name} ${this.user.last_name}`, this.user?.photo?.thumb?.url);
  }

  updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.currentTime = `${hours}:${minutes}`;
  }
  async getLocation() {
    // if (this.pointing_internal?.started_on != null) {
    // } else {
    //   await this.loadingService.present(this.loadingMessage);
    //   await this.geolocationService.getCurrentLocation();
    //   this.userCoordinates = this.geolocationService.coordinates;
    //   await this.loadingService.dimiss();
    // }
  }
  async setPointing() {
    let body: any = {
      point: {
        longitude: this.geolocationService.coordinates.longitude,
        latitude: this.geolocationService.coordinates.latitude,
        recorder_at: new Date().toISOString()
      }
    };

    if (this.pointing_internal?.started_on != null && this.pointing_internal?.finished_on == null) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      body["finished_on"] = `${hours}:${minutes}`;
      const actionSheet = await this.actionSheetController.create({
        header: "Vous êtes sur le point de terminer votre mission, assurez-vous d'avoir fait le point avec le pilote et que toutes les tâches sont terminées.",
        cssClass: "header_actionSheet",
        buttons: [
          {
            text: "Oui",
            cssClass: "btn_actionSheet",
            handler: async () => {
              const user_v3 = JSON.parse(localStorage.getItem("user-v3") || "{}");
              await this.loadingService.present(this.loadingMessage);
              this.missionService.pointing(this.pointing_internal.id, "finish", body).subscribe(async (data: any) => {
                this.pointing_internal = data;
                await this.loadingService.dimiss();
                this.planning.team.find((u: any) => u.id === user_v3.id).pointing_internal[0] = this.pointing_internal;
                this.teamMember = this.planning.team.find((u: any) => u.id === user_v3.id);
                this.pointingType = "second";
                this.updateLoaclPlaningData();
                await this.toastController.presentToast("Pointage fin réalisé avec succès. Bon courage !", "success");
              });
            }
          },
          {
            text: "Annuler",
            cssClass: "btn_actionSheet",
            handler: () => {
              this.sliderX = 0;
            }
          }
        ]
      });

      await actionSheet.present();
    } else {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      body["started_on"] = `${hours}:${minutes}`;

      const distance = await this.geolocationService.getDistanceFromCurrentLoaction({
        latitude: parseFloat(this.planning.intervention.address.latitude),
        longitude: parseFloat(this.planning.intervention.address.longitude)
      });

      console.log(distance);

      if (distance && distance <= 0.5) {
        // console.log(this.pointing_internal.id, "start", body);

        await this.loadingService.present(this.loadingMessage);
        const user_v3 = JSON.parse(localStorage.getItem("user-v3") || "{}");
        this.missionService.pointing(this.pointing_internal.id, "start", body).subscribe(async (data: any) => {
          await this.loadingService.dimiss();
          this.pointing_internal = data;
          this.planning.team.find((u: any) => u.id === user_v3.id).pointing_internal[0] = this.pointing_internal;
          this.updateLoaclPlaningData();
          await this.toastController.presentToast("Pointage début réalisé avec succès. Bon courage !", "success");
        });
      } else {
        await this.toastController.presentToast("Vous êtes très loin pour faire votre pointage", "danger");
      }
    }
  }

  updateLoaclPlaningData() {
    localStorage.setItem(
      "currentPlanning",
      JSON.stringify({
        planningType: this.type,
        planning: this.planning
      })
    );
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent) {
    const moveX = event.touches[0].clientX;
    const deltaX = moveX - this.startX;
    this.sliderX = Math.max(0, Math.min(this.maxSlide, deltaX));
  }

  async onTouchEnd() {
    if (this.sliderX >= this.maxSlide * 0.8) {
      const result = this.pointageService.togglePointage();
      this.setPointing();
    }
    this.sliderX = 0;
  }

  getConfirmationText(): string {
    return this.pointageService.getConfirmationText();
  }

  isPointed(): boolean {
    return this.pointageService.isPointed();
  }

  shouldShowSlider(): boolean {
    return true;
  }

  goBack() {
    this.location.back();
  }
}
