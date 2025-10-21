import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {GoogleMapsLoaderService} from "../../../../widgets/location-load/google-maps-loader.service";
import {MapService} from "../../services/map.service";
import {PointageService} from "../../services/pointage.service";
import {Pointing_Internal} from "src/app/models/intervention/pointage/pointing-internal.model";
import {Geolocation, Position} from "@capacitor/geolocation";
import {GeolocationService} from "../../../../widgets/geolocation/geolocation.service";
import {ActionSheetController, NavController, PopoverController, ToastController} from "@ionic/angular";
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
  pointing_internal: Pointing_Internal = new Pointing_Internal();
  type: any;
  pointingType: string = "";
  loadingMessage: string = "";
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
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.planning = JSON.parse(this.route.snapshot.paramMap.get("data")!);
    this.teamMember = this.planning.team.find((user: any) => user.id == this.user.id);
    this.planning.first_pointing_internal = this.teamMember.first_pointing_internal;
    this.planning.second_pointing_internal = this.teamMember.second_pointing_internal;
    this.type = this.route.snapshot.paramMap.get("type");
    this.user = this.authService.getCurrentUser();
    this.updateTime();
    this.intervalTimeId = setInterval(() => this.updateTime(), 1000);
    this.googleMapsLoader.apiLoaded$.subscribe(async loaded => {
      if (loaded) {
        await this.initMapAndUserPosition();
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalTimeId);
    clearInterval(this.intervalPositionId);
  }

  async initMapAndUserPosition() {
    const planningLat = parseFloat(this.planning.lat);
    const planningLng = parseFloat(this.planning.long);
    await this.mapService.initMap(this.mapElement, planningLat, planningLng);
    this.mapService.addMarker({lat: planningLat, lng: planningLng}, "Lieu d'intervention", "assets/img/building_marker.png", {width: 30, height: 30});

    this.mapService.addCircle(planningLat, planningLng);
    await this.updateUserPosition();
    this.intervalPositionId = setInterval(() => this.updateUserPosition(), 15000);
  }
  getFirstThreeWords(text: string | undefined): string {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : text;
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

  async setPointing() {
    this.pointing_internal.planning_type = this.type;
    this.pointing_internal.planning_punctual_id = this.planning.id;
    this.pointing_internal.planning_regular_id = this.planning.id;
    this.pointing_internal.intervention_id = this.planning.intervention_id;
    this.pointing_internal.user_id = this.user.id;
    this.pointing_internal.date = new Date();
    await this.geolocationService.getCurrentLocation();
    this.userCoordinates = this.geolocationService.coordinates;
    this.pointing_internal.lat = this.userCoordinates.latitude + "";
    this.pointing_internal.long = this.userCoordinates.longitude + "";
    const distance = this.geolocationService.getDistanceFromCurrentLoaction({
      longitude: parseFloat(this.planning.long),
      latitude: parseFloat(this.planning.lat)
    });

    if (this.planning?.first_pointing_internal?.length == 0 && this.planning?.second_pointing_internal?.length == 1) {
      const actionSheet = await this.actionSheetController.create({
        header: "Vous êtes sur le point de terminer votre mission, assurez-vous d'avoir fait le point avec le pilote et que toutes les tâches sont terminées.",
        cssClass: "header_actionSheet",
        buttons: [
          {
            text: "Oui",
            cssClass: "btn_actionSheet",
            handler: async () => {
              await this.loadingService.present(this.loadingMessage);
              this.missionService.pointing(this.pointing_internal).subscribe(async (data: any) => {
                await this.loadingService.dimiss();
                this.planning.second_pointing_internal = [];
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
      if (distance < 0.5) {
        await this.loadingService.present(this.loadingMessage);
        this.missionService.pointing(this.pointing_internal).subscribe(async (data: any) => {
          await this.loadingService.dimiss();
          this.planning.first_pointing_internal = [];
          this.pointingType = "first";
          this.updateLoaclPlaningData();
          await this.toastController.presentToast("Pointage début réalisé avec succès. Bon courage !", "success");
        });
      } else {
        await this.toastController.presentToast("Vous êtes très loin pour faire votre pointage", "danger");
      }
    }
  }

  updateLoaclPlaningData() {
    const member = this.planning.team.find((u: any) => u.id === this.user.id);
    if (member) {
      if (this.pointingType === "first") {
        member.first_pointing_internal = [];
      } else {
        member.second_pointing_internal = [];
      }
      localStorage.setItem(
        "currentPlanning",
        JSON.stringify({
          planningType: this.type,
          planning: this.planning
        })
      );
    }
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
