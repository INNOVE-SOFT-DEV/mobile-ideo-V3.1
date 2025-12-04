import {Component, EventEmitter, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {GeolocationService} from "./widgets/geolocation/geolocation.service";
import {PhotoReportService} from "./pages/missions/agents/photo-report/service/photo-report.service";
import {GoogleMapsLoaderService} from "./widgets/location-load/google-maps-loader.service";
import {App} from "@capacitor/app";
import {Network} from "@capacitor/network";
import {TrackingService} from "src/app/widgets/tracking/tracking.service";
import {ChatService} from "./tab2/chatService/chat.service";
import {Preferences} from "@capacitor/preferences";
import {SqliteServiceTs} from "src/app/widgets/storage/sqlite.service.ts";
import {Platform} from "@ionic/angular";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: false
})
export class AppComponent implements OnInit {
  loaded = false;
  isConnected = false;

  constructor(
    private geolocationService: GeolocationService,
    private translate: TranslateService,
    private photoReportService: PhotoReportService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private trackingService: TrackingService,
    private chatService: ChatService,
    private platform: Platform,
    private sqliteService: SqliteServiceTs
  ) {
    this.translate.setDefaultLang("fr");
    this.geolocationService.init();
  }

  async ngOnInit() {
    this.loaded = true;
    this.initializeApp();
    await this.platform.ready();
    await this.sqliteService.initDB();
    await this.sqliteService.listTables();
    await this.photoReportService.detectNetworksStatusChange();
    this.photoReportService.checkAndSyncPhotos();
    this.isConnected = (await Network.getStatus()).connected;
    this.chatService.loadUsers();
    App.addListener("appStateChange", ({isActive}) => {
      if (isActive) {
        if (this.isConnected) {
          this.photoReportService.checkAndSyncPhotos();
        }
      }
    });
    this.geolocationService.getApiKey().subscribe((res: any) => {
      if (res) {
        this.googleMapsLoader.load(res);
      }
    });
  }
  initializeApp() {
    this.trackingService.startTracking();
  }

  async logAllCapacitorPreferences() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key!);
      console.log(`${key}:`, value);
    }
  }
}
