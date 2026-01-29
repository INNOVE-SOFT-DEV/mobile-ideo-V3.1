import {Injectable, OnDestroy} from "@angular/core";
import {Capacitor} from "@capacitor/core";
import {Geolocation, Position} from "@capacitor/geolocation";
import {HttpClient} from "@angular/common/http";
import {environment} from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class GeolocationService implements OnDestroy {
  public coordinates: any;
  private watchId: string | null = null;
  private apiUrl = `${environment.urlAPI}`;
  private platform = Capacitor.getPlatform();

  constructor(private http: HttpClient) {
    this.init();
  }

  async init() {
    if (this.platform === "android") {
      await new Promise(r => setTimeout(r, 500));
    }

    if (this.platform === "web") {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.coordinates = position.coords;
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("You denied the location permission. Please allow it in browser settings.");
          } else {
            console.error("Error getting location:", error);
          }
        }
      );
    } else {
      await this.checkAndRequestLocationPermission();
      await this.startWatchingLocation();
    }
  }

  getApiKey() {
    return this.http.get(this.apiUrl + "googlemaps");
  }

  async checkAndRequestLocationPermission() {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      if (permissionStatus.location !== "granted") {
        await Geolocation.requestPermissions();
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  }

  async startWatchingLocation() {
    if (this.watchId) return;

    this.watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: this.platform === "android",
        maximumAge: 30000,
        timeout: 30000
      },
      (position: Position | null, err: any) => {
        if (position) {
          // Android: ignore noisy fixes
          if (this.platform !== "android" || position.coords.accuracy <= 30) {
            this.coordinates = position.coords;
          }
        } else if (err) {
          console.error("Watcher error:", err);
        }
      }
    );
  }

  stopWatchingLocation() {
    if (this.watchId) {
      Geolocation.clearWatch({id: this.watchId});
      this.watchId = null;
    }
  }

  ngOnDestroy(): void {
    this.stopWatchingLocation();
  }

  async getDistanceFromCurrentLoaction(coords: any) {
    if (!this.coordinates) return null;

    const R = 6371;
    const dLat = ((coords.latitude - this.coordinates.latitude) * Math.PI) / 180;
    const dLon = ((coords.longitude - this.coordinates.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.coordinates.latitude * Math.PI) / 180) * Math.cos((coords.latitude * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async isAroundIdeo() {
    if (!this.coordinates) return false;

    const TARGET_LAT = 48.9136971;
    const TARGET_LON = 2.3774035;
    const R = 6371;
    const dLat = this.toRad(TARGET_LAT - this.coordinates.latitude);
    const dLon = this.toRad(TARGET_LON - this.coordinates.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRad(this.coordinates.latitude)) * Math.cos(this.toRad(TARGET_LAT)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return true;
  }

  toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}
