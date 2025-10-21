import {Injectable, ElementRef} from "@angular/core";
import {Geolocation} from "@capacitor/geolocation";

declare var google: any;

@Injectable({
  providedIn: "root"
})
export class MapService {
  map: any;
  userMarkerFront: any;
  userMarkerBack: any;
  markers: any[] = [];
  async initMap(mapElement: ElementRef, lat: number, lng: number): Promise<any> {
    const mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    return this.map;
  }

  async getUserLocation() {
    const coords = await Geolocation.getCurrentPosition();
    return {
      lat: coords.coords.latitude,
      lng: coords.coords.longitude
    };
  }

  addMarker(position: any, title: string, iconUrl: string, size: {width: number; height: number}) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(size.width, size.height)
      }
    });

    this.markers.push(marker);
    return marker;
  }

  addMarkerAgent(position: any, title: string, iconUrl: string, size: {width: number; height: number}, onClick?: () => void) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(size.width, size.height)
      }
    });

    if (onClick && typeof onClick === "function") {
      marker.addListener("click", () => {
        onClick();
      });
    }

    this.markers.push(marker); // 👈 track marker
    return marker;
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  panTo(lat: number, lng: number) {
    if (this.map) {
      this.map.panTo({lat, lng});
    }
  }

  setZoom(level: number) {
    if (this.map) {
      this.map.setZoom(level);
    }
  }

  addUserMarker(position: any, name: string, photoUrl: string) {
    if (this.userMarkerFront) this.userMarkerFront.setMap(null);
    if (this.userMarkerBack) this.userMarkerBack.setMap(null);

    this.userMarkerFront = this.addMarker(position, name, photoUrl, {
      width: 20,
      height: 20
    });
    this.userMarkerBack = this.addMarker(position, name, "assets/img/marker.png", {width: 40, height: 40});
  }

  addCircle(lat: number, lng: number, radius: number = 500) {
    return new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: "#82e2a8",
      fillOpacity: 0.3,
      map: this.map,
      center: {lat, lng},
      radius
    });
  }
}
