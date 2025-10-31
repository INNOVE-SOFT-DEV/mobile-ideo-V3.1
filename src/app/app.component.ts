import {Component, EventEmitter, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {GeolocationService} from "./widgets/geolocation/geolocation.service";
import {PhotoReportService} from "./pages/missions/agents/photo-report/service/photo-report.service";
import {GoogleMapsLoaderService} from "./widgets/location-load/google-maps-loader.service";
import {App} from "@capacitor/app";
import {Network} from "@capacitor/network";
import {TrackingService} from "src/app/widgets/tracking/tracking.service";
import {ChatService} from "./tab2/chatService/chat.service";
import { Preferences } from "@capacitor/preferences";

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
    // private trackingService: TrackingService,
    private chatService: ChatService
  ) {
    this.translate.setDefaultLang("fr");
    this.geolocationService.init();
    // setInterval(() => {
    //   this.logAllCapacitorPreferences();
    // }, 10000); // Log every 60 seconds
  }

  async ngOnInit() {
    this.loaded = true;
    // this.trackingService.startTracking();
    // Start network status listener (should not call checkAndSyncPhotos directly)
    await this.photoReportService.detectNetworksStatusChange();

    // Run a single initial sync attempt — safe because guarded by lock
    this.photoReportService.checkAndSyncPhotos();

    // Get initial network status
    this.isConnected = (await Network.getStatus()).connected;
    this.chatService.loadUsers();
    // Listen for foreground event — safe because guarded by lock
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

async  logAllCapacitorPreferences() {
  // Get all keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key!);
    console.log(`${key}:`, value);
  }
}
}
