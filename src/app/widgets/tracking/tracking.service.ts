import {Injectable, NgZone} from "@angular/core";
import {Storage} from "@ionic/storage-angular";
import {HttpClient} from "@angular/common/http";
import {Network} from "@capacitor/network";
import {lastValueFrom} from "rxjs";
import {environment} from "../../../environments/environment";

import {registerPlugin} from "@capacitor/core";
import type {BackgroundGeolocationPlugin, WatcherOptions} from "@capacitor-community/background-geolocation";

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Injectable({
  providedIn: "root"
})
export class TrackingService {
  private storageReady = false;
  private db: Storage | null = null;
  private storageKey = "positions";
  private watchers: string[] = [];

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private zone: NgZone
  ) {
    this.initStorage();
    this.monitorNetwork();
  }

  async initStorage() {
    this.db = await this.storage.create();
    this.storageReady = true;
  }

  async startTracking() {
    const options: WatcherOptions = {
      requestPermissions: true,
      backgroundTitle: "Tracking actif",
      backgroundMessage: "L’application collecte votre position",
      distanceFilter: 30,
      stale: false
    };

    const id = await BackgroundGeolocation.addWatcher(options, async (location, error) => {
      if (error) {
        console.error("BG error", error);
        if (error.code === "NOT_AUTHORIZED") {
          BackgroundGeolocation.openSettings();
        }
        return;
      }

      // CORRECTION ICI
      this.zone.run(async () => {
        // Vérifier que location existe
        if (!location) {
          console.warn("Location is undefined");
          return;
        }

        const timestampValue = location.time ?? Date.now();
        // Si location.time est null → on utilise Date.now()

        const pos = {
          lat: location.latitude,
          lng: location.longitude,
          timestamp: new Date(timestampValue).toISOString()
        };

        const status = await Network.getStatus();
        status.connected ? await this.sendToBackend(pos) : await this.saveLocally(pos);
      });
    });

    this.watchers.push(id);
  }

  async stopTracking() {
    for (const id of this.watchers) {
      await BackgroundGeolocation.removeWatcher({id});
    }
    this.watchers = [];
  }

  private async saveLocally(pos: any) {
    if (!this.storageReady || !this.db) return;
    const list = (await this.db.get(this.storageKey)) || [];
    list.push(pos);
    await this.db.set(this.storageKey, list);
  }

  async sendToBackend(pos: any) {
    try {
      console.log(pos);
      //await lastValueFrom(this.http.post(`${environment.urlAPI}/positions`, pos));
    } catch {
      await this.saveLocally(pos);
    }
  }

  async syncStored() {
    const status = await Network.getStatus();
    if (!status.connected || !this.storageReady || !this.db) return;

    const local = await this.db.get(this.storageKey);
    if (!local?.length) return;

    for (const pos of local) {
      try {
        console.log(pos);
        //  await lastValueFrom(this.http.post(`${environment.urlAPI}/positions`, pos));
      } catch {
        break;
      }
    }

    await this.db.set(this.storageKey, []);
  }

  monitorNetwork() {
    Network.addListener("networkStatusChange", async st => {
      if (st.connected) await this.syncStored();
    });
  }
}
