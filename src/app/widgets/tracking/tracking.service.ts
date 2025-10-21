import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage-angular";
import {HttpClient} from "@angular/common/http";
import {Network} from "@capacitor/network";
import {BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse} from "@ionic-native/background-geolocation/ngx";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class TrackingService {
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    this.initStorage();
    this.monitorNetwork();
  }
  async initStorage() {
    this._storage = await this.storage.create();
  }

  startTracking() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true,
      stopOnTerminate: false,
      startOnBoot: true,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation.on("location" as any).subscribe(async (location: BackgroundGeolocationResponse) => {
        const position = {
          lat: location.latitude,
          lng: location.longitude,
          timestamp: new Date(location.time).toISOString()
        };

        const connected = await this.isConnected();
        if (connected) {
          await this.sendToBackend(position);
        } else {
          await this.saveLocally(position);
        }
      });
    });

    this.backgroundGeolocation.start();
  }

  stopTracking() {
    this.backgroundGeolocation.stop();
  }

  async saveLocally(position: any) {
    if (!this._storage) return;
    const positions = (await this._storage.get("positions")) || [];
    positions.push(position);
    await this._storage.set("positions", positions);
    console.log("Position sauvegardée localement:", position);
  }

  async sendToBackend(position: any) {
    console.log(`position == ${position}`);
    /* try {
      await this.http.post(`${environment.apiUrl}/positions`, position).toPromise();
      console.log("Position envoyée au backend:", position);
    } catch (error) {
      console.error("Erreur envoi backend, sauvegarde local", error);
      await this.saveLocally(position);
    }*/
  }

  async syncStoredPositions() {
    const connected = await this.isConnected();
    console.log(`connected == ${connected}`);
    if (!connected) return;
    if (!this._storage) return;

    const stored = await this._storage.get("positions");
    if (stored && stored.length > 0) {
      console.log(`Envoi de ${stored.length} positions stockées`);
      for (const pos of stored) {
        console.log(`pos == ${pos}`);
        /* try {
          await this.http.post(`${environment.apiUrl}/positions`, pos).toPromise();
          console.log("Position synchronisée:", pos);
        } catch (e) {
          console.error("Erreur sync backend", e);
          break;
        }*/
      }
      await this._storage.set("positions", []);
      console.log("Positions synchronisées et stockage local vidé");
    }
  }

  monitorNetwork() {
    Network.addListener("networkStatusChange", async status => {
      if (status.connected) {
        console.log("Connexion réseau détectée, synchronisation des positions");
        await this.syncStoredPositions();
      }
    });
  }

  async isConnected(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }
}
