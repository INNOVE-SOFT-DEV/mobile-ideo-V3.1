import {Component, EventEmitter, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {GeolocationService} from "./widgets/geolocation/geolocation.service";
import {PhotoReportService} from "./pages/missions/agents/photo-report/service/photo-report.service";
import {GoogleMapsLoaderService} from "./widgets/location-load/google-maps-loader.service";
import {App} from "@capacitor/app";
import {Network} from "@capacitor/network";
import {ChatService} from "./tab2/chatService/chat.service";

import {Platform} from "@ionic/angular";
import {PushService} from "./widgets/push/push.service";

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
    private chatService: ChatService,
    private platform: Platform,
    private pushService: PushService
  ) {
    this.translate.setDefaultLang("fr");
  }

  async ngOnInit() {
    this.loaded = true;
    await this.platform.ready();
    this.pushService.initPush();
    // await this.sqliteService.initDB();
    // await this.sqliteService.listTables();
    await this.photoReportService.detectNetworksStatusChange();
    this.photoReportService.checkAndSyncPhotos();
    this.isConnected = (await Network.getStatus()).connected;
    this.isConnected ? this.photoReportService.checkAndSyncPhotos() : null;
    // this.chatService.loadUsers();
    // App.addListener("appStateChange", ({isActive}) => {
    //   if (isActive) {
    //     if (this.isConnected) {
    //       this.photoReportService.checkAndSyncPhotos();
    //     }
    //   }
    // });
    //  this.googleMapsLoader.load(res);
    // this.geolocationService.getApiKey().subscribe((res: any) => {
    //   if (res) {
    //   }
    // });
  }
}
