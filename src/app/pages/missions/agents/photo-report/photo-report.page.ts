import {Component, OnDestroy, OnInit} from "@angular/core";
import {DatePipe, Location} from "@angular/common";
import {ActionSheetController, AlertController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {PhotosService} from "src/app/widgets/photos/photos.service";
import {PhotoReportService} from "./service/photo-report.service";
import {FileSystemService} from "src/app/widgets/file-system/file-system.service";
import {Network} from "@capacitor/network";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {environment} from "src/environments/environment";
import {Subscription} from "rxjs";
import {EmailComposer} from "capacitor-email-composer";
import JSZip from "jszip";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {Capacitor} from "@capacitor/core";
import exifr from "exifr";
import {GeolocationService} from "src/app/widgets/geolocation/geolocation.service";

@Component({
  selector: "app-photo-report",
  templateUrl: "./photo-report.page.html",
  styleUrls: ["./photo-report.page.scss"],
  standalone: false
})
export class PhotoReportPage implements OnInit, OnDestroy {
  isDeviceReady: boolean = false;
  isPointed: boolean = false;
  shareWithSupervisor() {
    this.openEmail();
  }
  grouped_presentation_photos: any[] = [];
  photos_truck: any[] = [];
  data: any;
  planningType: any;
  isConneted: boolean | null = null;
  remotePhotos: any;
  isReportUpdated: boolean | null = null;
  isOffLineAlertOpen = false;
  alertButtons = ["Fermer"];
  loadingMessage: string = "";
  isSliderOpen: any = false;
  sliderPhotos: any[] = [];
  initialIndexPhoto: number = 0;
  private doneSyncEvent!: Subscription;
  public syncProgress$ = this.service.progress$;
  public isSyncing$ = this.service.isSyncing$;
  isSynced: boolean = true;
  isLoading: boolean = true;
  win: any;
  user: any = this.authServie.getCurrentUser();
  baseUrl = `${environment.newWebUrl}`;

  setOpen(isOpen: boolean) {
    this.isOffLineAlertOpen = isOpen;
  }

  constructor(
    private authServie: AuthService,
    private location: Location,
    private actionSheetController: ActionSheetController,
    private photosService: PhotosService,
    private fs: FileSystemService,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService,
    private service: PhotoReportService,
    private datePipe: DatePipe,
    private missionsService: MissionService,
    private geolocationService: GeolocationService,
    private alertController: AlertController
  ) {}
  ngOnDestroy(): void {
    if (this.doneSyncEvent) {
      this.doneSyncEvent.unsubscribe();
    }
  }

  async ngOnInit() {
    await this.refreshLocalData();
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    Network.addListener("networkStatusChange", async status => {
      this.isConneted = status.connected;
    });
    this.isConneted = (await Network.getStatus()).connected;
    await this.loadingService.dimiss();

    let reportNeedSync = await JSON.parse(localStorage.getItem("report_need_sync")!);
    if (!reportNeedSync) {
      localStorage.setItem("report_need_sync", JSON.stringify([]));
      reportNeedSync = [];
    } else {
      this.isSynced = this.isConneted && reportNeedSync.length == 0;
    }
    this.doneSyncEvent = this.service.doneEvent.subscribe(async data => {
      await this.refreshLocalData();
    });
  }

  async refreshLocalData() {
    await this.loadingService.present(this.loadingMessage);
    const cached = await JSON.parse(localStorage.getItem("currentPlanning")!);
    this.data = cached;
    this.planningType = cached.planningType;
    this.service.data = this.data;
    this.service.planningType = this.planningType;
    const local: any = await this.service.getLocalPhotos(this.data.planning.id, this.planningType);
    this.grouped_presentation_photos = local.grouped_presentation_photos;
    this.photos_truck = local.photos_truck;
    if (this.grouped_presentation_photos.length == 0) this.addPhotoPrestation();
    if (this.photos_truck.length == 0) this.addPhotoCamion();
    await this.loadingService.dimiss();
    this.isLoading = false;
  }

  async takePicture(photo_type: string, i: number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Choisir option :",
      cssClass: "header_actionSheet",
      buttons: [
        {
          text: "Camera",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Camera", 40);
            let currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
            await this.saveNewPhoto(photo_type, i, currentDate);
          }
        },
        {
          text: "Galerie",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Galerie", 40);
            let currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
            await this.saveNewPhoto(photo_type, i, currentDate);
          }
        },
        {
          text: "Annuler",
          cssClass: "btn_actionSheet",
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  async saveNewPhoto(photo_type: string, i: number, currentDate: any) {
    console.log("planning data", this.service.data);
    if (this.service.startedOn() == null && !this.isPointed) {
      await this.geolocationService.getCurrentLocation();
      let userCoordinates = this.geolocationService.coordinates;
      let pointageInternalId = this.service.getPointageId();
      let body: any = {
        point: {
          longitude: userCoordinates.longitude,
          latitude: userCoordinates.latitude,
          recorder_at: new Date().toISOString()
        }
      };

      this.missionsService.pointing(pointageInternalId, "start", body).subscribe({
        next: async () => {
          this.isPointed = true;
          console.log("Pointage début réalisé ");
        },
        error: () => {
          console.error("Erreur lors du pointage ");
        }
      });
    }

    const base64 = this.photosService.lastImage.base64String;
    const blob = this.photosService.getInfoBase64ToBlob(base64);
    try {
      const exifData = await exifr.parse(blob);
      console.log("📸 EXIF DATA:", exifData);
    } catch (error) {
      console.log("❌ Impossible de lire les EXIF", error);
    }
    if (this.isConneted) {
      let prestation_id = null;
      if (photo_type == "photo_before" && this.grouped_presentation_photos[i][1].photo.prestation_id) {
        prestation_id = this.grouped_presentation_photos[i][1].photo.prestation_id;
      } else if (photo_type == "photo_after" && this.grouped_presentation_photos[i][0].photo.prestation_id) {
        prestation_id = this.grouped_presentation_photos[i][0].photo.prestation_id;
      }
      const data = this.service.uploadImagetoApi(this.photosService.lastImage.base64String, photo_type, currentDate);
      const hasAfterOrBefore = data?.photo?.some((p: any) => p.photo_type === "after" || p.photo_type === "before");
      let form = data;
      if (hasAfterOrBefore) {
        form = this.service.updateClientUuidFromGroupedPhotos(data, this.grouped_presentation_photos, i);
      }
      const pointageId = this.service.getPointageId();
      await this.loadingService.present(this.loadingMessage);
      this.missionsService.createReportPhoto(form, pointageId).subscribe({
        next: async value => {
          console.log("image_url", value[0]?.image_url?.url);
          if (value[0].photo_type == "before") {
            this.grouped_presentation_photos[i][0].photo.url = value[0]?.image_url?.url;
            this.grouped_presentation_photos[i][0].photo.prestation_id = value[0].client_uuid;
            this.service.updateLocalPhotos(photo_type, this.grouped_presentation_photos);
          } else if (value[0].photo_type == "after") {
            this.grouped_presentation_photos[i][1].photo.url = value[0]?.image_url?.url;
            this.grouped_presentation_photos[i][1].photo.prestation_id = value[0].client_uuid;
            this.service.updateLocalPhotos(photo_type, this.grouped_presentation_photos);
          } else {
            console.log("photos_truck", this.photos_truck[i]);
            this.photos_truck[i].url = value[0]?.image_url?.url;

            this.photos_truck[i].prestation_id = value[0].client_uuid;
            this.service.updateLocalPhotos(photo_type, this.photos_truck);
          }
          await this.loadingService.dimiss();
        },
        error: async err => {
          await this.loadingService.dimiss();
          console.error(err);
        }
      });
    } else {
      const url = await this.service.savePhotoOffline(this.photosService.lastImage);
      console.log("url", url);
      if (url) {
        if (photo_type == "photo_before") {
          this.grouped_presentation_photos[i][0].photo.url = url.displayUri;
          this.grouped_presentation_photos[i][0].photo.path = url.path;
          this.grouped_presentation_photos[i][0].photo.prestation_id = this.service.getUpdatedClientUuid(this.data, this.grouped_presentation_photos, i);
          this.grouped_presentation_photos[i][0].photo.date = currentDate;
          console.log("grouped_presentation_photos", this.grouped_presentation_photos[i]);
          this.service.updateLocalPhotos("photo_before", this.grouped_presentation_photos);
        } else if (photo_type == "photo_after") {
          this.grouped_presentation_photos[i][1].photo.url = url.displayUri;
          this.grouped_presentation_photos[i][1].photo.path = url.path;
          this.grouped_presentation_photos[i][1].photo.prestation_id = this.service.getUpdatedClientUuid(this.data, this.grouped_presentation_photos, i);
          this.grouped_presentation_photos[i][1].photo.date = currentDate;
          this.service.updateLocalPhotos("photo_after", this.grouped_presentation_photos);
        } else {
          this.photos_truck[i].url = url.displayUri;
          this.photos_truck[i].path = url.path;
          this.photos_truck[i].date = currentDate;
          this.photos_truck[i].prestation_id = this.service.generateUniqueId();
          this.service.updateLocalPhotos(photo_type, this.photos_truck);
        }
        let reportNeedSync = await JSON.parse(localStorage.getItem("report_need_sync")!);
        const index = reportNeedSync.findIndex((item: any) => item.id === this.data.planning.id && item.type === this.planningType);
        if (index == -1) {
          reportNeedSync.push({id: this.data.planning.id, type: this.planningType});
          localStorage.setItem("report_need_sync", JSON.stringify(reportNeedSync));
        }
      }
    }
  }

  goBack() {
    if (this.isSliderOpen) this.isSliderOpen = false;
    else this.location.back();
  }

  addPhotoPrestation() {
    this.grouped_presentation_photos.push([
      {id: this.grouped_presentation_photos.length + 1, photo_type: "photo_before", photo: {url: ""}},
      {id: this.grouped_presentation_photos.length + 1, photo_type: "photo_after", photo: {url: ""}}
    ]);
  }

  addPhotoCamion() {
    this.photos_truck.push({url: null});
  }

  openSlides(type: string, i: number) {
    if (type == "photo_before") {
      this.initialIndexPhoto = i * 2;
      this.sliderPhotos = this.grouped_presentation_photos.flat();
      this.isSliderOpen = true;
    } else if (type == "photo_after") {
      this.initialIndexPhoto = i * 2 + 1;
      this.sliderPhotos = this.grouped_presentation_photos.flat();
      this.isSliderOpen = true;
    } else {
      this.initialIndexPhoto = i;
      this.sliderPhotos = this.photos_truck;
      this.isSliderOpen = true;
    }
  }

  private getPhotoIdFromUrl(url: string): string {
    const parts = url.split("/");
    return parts[parts.length - 2];
  }

  private async handleLocalPhotoStateUpdate(photo: any, photosArray: any, type: string, index: number, checkGroupedRemoval?: () => boolean): Promise<void> {
    photo.url = "";
    photo.path = "";

    this.service.updateLocalPhotos(type, photosArray);

    if (photo.url === "" && photo.path === "") {
      if (type === "photo_truck") {
        (photosArray as any[]).splice(index, 1);
      } else if (checkGroupedRemoval && checkGroupedRemoval()) {
        (photosArray as any[][]).splice(index, 1);
      }
    }

    const hasUnsyncedPresentation = this.grouped_presentation_photos.some(group => group.some((p: any) => p.photo?.path?.includes("ideo_v3")));
    const hasUnsyncedTruck = this.photos_truck.some(p => p?.path?.includes("ideo_v3"));

    if (!hasUnsyncedPresentation && !hasUnsyncedTruck) {
      const reportNeedSync = JSON.parse(localStorage.getItem("report_need_sync") || "[]");
      const mainIndex = reportNeedSync.findIndex((item: any) => item.id === this.data.planning.id && item.type === this.planningType);
      if (mainIndex !== -1) {
        reportNeedSync.splice(mainIndex, 1);
        localStorage.setItem("report_need_sync", JSON.stringify(reportNeedSync));
      }
    }
  }

  private async performDeletePhoto(
    photo: any,
    photosArray: any,
    type: string,
    index: number,
    typePhoroto: string,
    uuid: string,
    checkGroupedRemoval?: () => boolean
  ): Promise<void> {
    const alert = await this.alertController.create({
      header: "Supprimer la photo ?",
      message: "Voulez-vous vraiment supprimer cette photo ?",
      buttons: [
        {
          text: "Annuler",
          role: "cancel"
        },
        {
          text: "Supprimer",
          handler: async () => {
            /* if (!photo || (!photo.url && !photo.path)) {
              console.warn(`Attempted to delete a photo object at index ${index} of type ${type} that is missing 'url' and 'path'.`);
              return;
            }*/

            if (!this.isConneted) {
              this.setOpen(true);
              return;
            }
            const photoId = this.getPhotoIdFromUrl(photo.url);
            await this.loadingService.present(this.loadingMessage);

            this.missionsService.deletePhoto(photoId, this.planningType, uuid, typePhoroto).subscribe({
              next: async () => {
                await this.handleLocalPhotoStateUpdate(photo, photosArray, type, index, checkGroupedRemoval);
                await this.loadingService.dimiss();
              },
              error: async (err: any) => {
                await this.loadingService.dimiss();
                console.error(`Error deleting photo from API (${type}, ID: ${photoId}):`, err);
              }
            });

            /*const isServerPhoto = photo.url && photo.url.includes(environment.urlAPI);
            if (isServerPhoto) {
              
            } else {
              if (photo.path) {
                try {
                  await this.fs.deleteSecretFile(photo.path);
                  await this.handleLocalPhotoStateUpdate(photo, photosArray, type, index, checkGroupedRemoval);
                } catch (localFileErr) {
                  console.error(`Error deleting local file (${type}, Path: ${photo.path}):`, localFileErr);
                  await this.handleLocalPhotoStateUpdate(photo, photosArray, type, index, checkGroupedRemoval);
                }
              } else {
                console.warn(`Local photo at index ${index} of type ${type} has no path to delete. Updating local state.`);
                await this.handleLocalPhotoStateUpdate(photo, photosArray, type, index, checkGroupedRemoval);
              }
            }*/
          }
        }
      ]
    });

    await alert.present();
  }

  async downloadZip() {
    await this.service.downloadZip(
      this.grouped_presentation_photos,
      this.photos_truck,
      this.data.planning.intervention_name,
      this.data.planningType,
      this.data.planning.date || ""
    );
  }

  async openEmail() {
    await this.loadingService.present(this.loadingMessage);
    const images = [...this.grouped_presentation_photos.flat(), ...this.photos_truck];
    const zip = new JSZip();
    for (const [index, img] of images.entries()) {
      if (img != null) {
        let url = img?.photo?.url || img?.url;
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(`image_${img?.photo_type == "photo_truck" || !img?.photo_type ? "camion" : img?.photo_type == "photo_before" ? "before" : "after"}_${index + 1}.jpg`, blob);
      }
    }
    const content = await zip.generateAsync({type: "blob"});
    const base64 = await this.service.blobToBase64(content);
    const fileName = `photos_${this.data.planning.intervention_name}_${this.planningType}_${this.data.planning.id}_${this.data.planning.date}.zip`;

    const logUrl = `${environment.url_web}/assets/img/logo-Ideo2.png`;
    await this.loadingService.dimiss();
    EmailComposer.open({
      to: ["h.hadjrabah@ideogroupe.fr"],
      subject: `Raport photos ${this.data.planning.intervention_name}`,
      isHtml: true,
      body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mobile Blue Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    img {
      border: 0;
      display: block;
      max-width: 100%;
      height: auto;
    }
    @media screen and (max-width: 600px) {
      h1 {
        font-size: 24px !important;
      }
      p {
        font-size: 16px !important;
      }
      .button {
        padding: 14px 24px !important;
        font-size: 16px !important;
      }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; background-color: #ddf5ff;">
  <center style="width: 100%; background-color: #ddf5ff;">
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 600px;">
      <!-- Header -->
      <tr>
        <td align="center" bgcolor="#ddf5ff" style="padding: 40px 10px;">
          <img src="${logUrl}" alt="Logo" width="200" height="200" style="display: block; margin: 0 auto;" />
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td bgcolor="#ffffff" style="padding: 30px 20px 40px 20px; text-align: left;">
          <p style="font-family: Arial, sans-serif; font-size: 18px; line-height: 1.6; color: #333;">
          Agent : ${this.user.first_name} ${this.user.last_name}
          <br><br>  
          Identifiant de l'agent : ${this.user.id}
          <br><br>
          Type de mission : ${this.data.planningType == "punctual" ? "Ponctuelle" : this.data.planningType == "regular" ? "Régulière" : "Forfaitaire"}
          <br><br>
          Mission : ${this.data.planning.intervention_name}
          <br><br>
          Date : ${this.data.planning.date || ""}
          <br><br>
          Identifiant de la mission : ${this.data.planning.id}
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`,
      attachments: [
        {
          type: "base64",
          path: base64,
          name: fileName
        }
      ]
    });
  }

  async deletePhoto(type: string, i: number, uuid: string) {
    console.log("deletePhoto", uuid);
    let targetPhoto: any;
    let photosArray: any;
    let typePhoroto: string = "";
    let checkGroupedRemoval: (() => boolean) | undefined;
    switch (type) {
      case "photo_truck":
        targetPhoto = this.photos_truck[i];
        photosArray = this.photos_truck;
        typePhoroto = "truck";
        break;
      case "photo_before":
        targetPhoto = this.grouped_presentation_photos[i]?.[0]?.photo;
        photosArray = this.grouped_presentation_photos;
        typePhoroto = "before";
        checkGroupedRemoval = () => this.grouped_presentation_photos[i]?.[0]?.photo?.url === "" && this.grouped_presentation_photos[i]?.[1]?.photo?.url === "";
        break;
      case "photo_after":
        targetPhoto = this.grouped_presentation_photos[i]?.[1]?.photo;
        photosArray = this.grouped_presentation_photos;
        typePhoroto = "after";
        checkGroupedRemoval = () => this.grouped_presentation_photos[i]?.[0]?.photo?.url === "" && this.grouped_presentation_photos[i]?.[1]?.photo?.url === "";
        break;
      default:
        console.warn(`Unknown photo type: ${type}`);
        return;
    }

    if (!targetPhoto || !photosArray) {
      console.warn(`Photo object or array not found for type: ${type}, index: ${i}. Cannot proceed with deletion.`);
      return;
    }

    await this.performDeletePhoto(targetPhoto, photosArray, type, i, typePhoroto, uuid, checkGroupedRemoval);
  }
}
