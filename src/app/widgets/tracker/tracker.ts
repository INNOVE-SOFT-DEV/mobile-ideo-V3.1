import {Injectable, EventEmitter} from "@angular/core";
import {Capacitor} from "@capacitor/core";

const {LocationPlugin} = (window as any).Capacitor.Plugins || (window as any).Plugins;

export interface LocationData {
  lat: number;
  lng: number;
  acc: number;
  time: number;
}

@Injectable({providedIn: "root"})
export class Tracker {
  private locations: LocationData[] = [];
  private listener: any;

  // Angular components can subscribe to real-time updates
  public locationUpdated: EventEmitter<LocationData> = new EventEmitter();

  constructor() {
    this.registerListener();
  }

  private registerListener() {
    if (!Capacitor.addListener) return;

    this.listener = Capacitor.addListener("LocationPlugin", "locationUpdate", (event: any) => {
      try {
        const loc: LocationData = JSON.parse(event.location || event.detail?.location);
        this.locations.push(loc);

        // Emit Angular event
        this.locationUpdated.emit(loc);
      } catch (err) {
        console.error("[Tracker] Failed to parse location:", err);
      }
    });
  }

  getHistory(): LocationData[] {
    return [...this.locations];
  }

  clearHistory() {
    this.locations = [];
    console.log("[Tracker] History cleared");
  }
}
