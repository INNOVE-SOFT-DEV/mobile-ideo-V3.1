import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
declare var google: any;

@Injectable({
  providedIn: "root"
})
export class GoogleMapsLoaderService {
  private apiLoaded = new BehaviorSubject<boolean>(false);
  public apiLoaded$ = this.apiLoaded.asObservable();

  load(apiKey: string) {
    if (typeof google !== "undefined" && google.maps) {
      this.apiLoaded.next(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.apiLoaded.next(true);
    script.onerror = () => console.error("Google Maps failed to load");

    document.body.appendChild(script);
  }
}
