import {Injectable} from "@angular/core";
import {ActionSheetController} from "@ionic/angular";
import {GeolocationService} from "../geolocation/geolocation.service";

@Injectable({
  providedIn: "root"
})
export class MapService {
  latitude: any;
  longitude: any;
  address: any;

  constructor(
    private actionSheetController: ActionSheetController,
    private geolocationService: GeolocationService
  ) {}

  async direction() {
    let userCoordinates = this.geolocationService.coordinates;
    let latitude = userCoordinates.latitude;
    let longitude = userCoordinates.longitude;
    const actionSheet = await this.actionSheetController.create({
      header: "Ouvrir avec :",
      buttons: [
        {
          text: "Waze",
          icon: "./assets/img/direction/waze_icon.svg",
          handler: () => {
            const url = `https://www.waze.com/fr/live-map/directions?navigate=yes&from=ll.${latitude}%2C${longitude}&to=ll.${this.latitude}%2C${this.longitude}`;
            window.open(url, "_blank");
          }
        },
        {
          text: "Google Maps",
          icon: "./assets/img/direction/map_icon.svg",
          handler: () => {
            const url = `https://maps.google.com/?saddr=My+Location&daddr=${this.latitude},${this.longitude}`;
            window.open(url, "_blank");
          }
        },
        {
          text: "RATP",
          icon: "./assets/img/direction/ratp_icon.svg",
          handler: () => {
            const url = `https://www.ratp.fr/itineraires/${latitude}%2C${longitude}%26${this.address}#no-back`;
            window.open(url, "_blank");
          }
        }
      ]
    });

    await actionSheet.present();
  }
}
