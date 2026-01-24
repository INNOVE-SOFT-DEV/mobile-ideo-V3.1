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
import {AuthService} from "src/app/pages/login/service/auth.service";
import exifr from "exifr";
import {GeolocationService} from "src/app/widgets/geolocation/geolocation.service";
import {zip} from "fflate";
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
            await this.photosService.takePictureOption("Camera", 10);
            let currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
            await this.saveNewPhoto(photo_type, i, currentDate);
          }
        },
        {
          text: "Galerie",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Galerie", 10);
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
    if (this.service.startedOn() == null && !this.isPointed) {
      //await this.geolocationService.getCurrentLocation();
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
          // console.log("Pointage début réalisé ");
        },
        error: () => {
          console.error("Erreur lors du pointage ");
        }
      });
    }

    const base64 = this.photosService.lastImage.base64String;

    const blob = this.photosService.getInfoBase64ToBlob(base64, "image/jpeg");

    try {
      const exifData = await exifr.parse(blob);
    } catch (error) {
      console.error("❌ Impossible de lire les EXIF", error);
    }
    if (this.isConneted) {
      let client_uuid = null;
      if (photo_type == "photo_before" && this.grouped_presentation_photos[i][1].photo.client_uuid) {
        client_uuid = this.grouped_presentation_photos[i][1].photo.client_uuid;
      } else if (photo_type == "photo_after" && this.grouped_presentation_photos[i][0].photo.client_uuid) {
        client_uuid = this.grouped_presentation_photos[i][0].photo.client_uuid;
      }
      const data = this.service.uploadImagetoApi(this.photosService.lastImage.base64String, photo_type, currentDate, this.grouped_presentation_photos[i][0].client_uuid);
      const hasAfterOrBefore = data?.photo?.some((p: any) => p.photo_type === "after" || p.photo_type === "before");
      let form = data;
      if (hasAfterOrBefore) {
        form = this.service.updateClientUuidFromGroupedPhotos(data, this.grouped_presentation_photos, i);
      }
      const pointageId = this.service.getPointageId();
      await this.loadingService.present(this.loadingMessage);
      this.missionsService.createReportPhoto(form, pointageId).subscribe({
        next: async value => {
          if (value[0].photo_type == "before") {
            this.grouped_presentation_photos[i][0].photo.url = value[0]?.image_url?.url;
            this.grouped_presentation_photos[i][0].id = value[0].id;
            this.service.updateLocalPhotos(photo_type, this.grouped_presentation_photos);
          } else if (value[0].photo_type == "after") {
            this.grouped_presentation_photos[i][1].photo.url = value[0]?.image_url?.url;
            this.grouped_presentation_photos[i][1].id = value[0].id;
            this.service.updateLocalPhotos(photo_type, this.grouped_presentation_photos);
          } else {
            this.photos_truck[i].url = value[0]?.image_url?.url;
            this.photos_truck[i].id = value[0].id;

            this.photos_truck[i].client_uuid = value[0].client_uuid;
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
      if (url) {
        if (photo_type == "photo_before") {
          this.grouped_presentation_photos[i][0].photo.url = url.displayUri;
          this.grouped_presentation_photos[i][0].photo.path = url.path;
          this.grouped_presentation_photos[i][0].photo.remote = true;
          this.grouped_presentation_photos[i][0].photo.date = currentDate;
          this.service.updateLocalPhotos("photo_before", this.grouped_presentation_photos);
        } else if (photo_type == "photo_after") {
          this.grouped_presentation_photos[i][1].photo.url = url.displayUri;
          this.grouped_presentation_photos[i][1].photo.path = url.path;
          this.grouped_presentation_photos[i][1].photo.remote = true;
          this.grouped_presentation_photos[i][1].photo.date = currentDate;
          this.service.updateLocalPhotos("photo_after", this.grouped_presentation_photos);
        } else {
          this.photos_truck[i].url = url.displayUri;
          this.photos_truck[i].path = url.path;
          this.photos_truck[i].remote = true;
          this.photos_truck[i].date = currentDate;
          this.photos_truck[i].client_uuid = this.service.generateUniqueId();
          this.service.updateLocalPhotos(photo_type, this.photos_truck);
        }
        let reportNeedSync = await JSON.parse(localStorage.getItem("report_need_sync")!);

        const index = reportNeedSync.findIndex((item: any) => item.internal === this.service.getPointageId());
        if (index == -1) {
          reportNeedSync.push({id: this.data.planning.id, type: this.planningType, internal: this.service.getPointageId()});
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
    const client_uuid = this.service.generateUniqueId();
    this.grouped_presentation_photos.push([
      {id: this.grouped_presentation_photos.length + 1, client_uuid: client_uuid, photo_type: "photo_before", photo: {url: ""}},
      {id: this.grouped_presentation_photos.length + 1, client_uuid: client_uuid, photo_type: "photo_after", photo: {url: ""}}
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
    let server_id: any;
    type.includes("before")
      ? (server_id = this.grouped_presentation_photos[index][0].id)
      : type.includes("after")
        ? (server_id = this.grouped_presentation_photos[index][1].id)
        : (server_id = this.photos_truck[index].id);

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

            const isLocalPhoto = photo.url.includes("ideo_v3");

            if (isLocalPhoto) {
              try {
                await this.fs.deleteSecretFile(photo.path);
                await this.handleLocalPhotoStateUpdate(photo, photosArray, type, index, checkGroupedRemoval);
                await this.loadingService.dimiss();
              } catch (localFileErr) {
                await this.loadingService.dimiss();
                console.error(`Error deleting local file (${type}, Path: ${photo.path}):`, localFileErr);
                await this.handleLocalPhotoStateUpdate(photo, photosArray, type, index, checkGroupedRemoval);
              }
            } else {
              if (!this.isConneted) {
                this.setOpen(true);
                return;
              }
              this.missionsService
                .deletePhoto(server_id, this.planningType, this.data.planning.team.find((u: any) => u.id == this.user.id).pointing_internal[0].id, typePhoroto)
                .subscribe({
                  next: async () => {
                    await this.handleLocalPhotoStateUpdate(photo, photosArray, type, index, checkGroupedRemoval);
                    await this.loadingService.dimiss();
                  },
                  error: async (err: any) => {
                    await this.loadingService.dimiss();
                    console.error(`Error deleting photo from API (${type}, ID: ${server_id}):`, err);
                  }
                });
            }
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
      this.data.planning.intervention.name,
      this.data.planningType,
      this.data.planning.today_schedule.date || ""
    );
  }

  async openEmail() {
    await this.loadingService.present(this.loadingMessage);

    const images = [...this.grouped_presentation_photos.flat(), ...this.photos_truck];

    const files: Record<string, Uint8Array> = {};

    for (const [index, img] of images.entries()) {
      if (!img) continue;

      const url = img?.photo?.url || img?.url;
      const response = await fetch(url);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();

      const typePhoto = img?.photo_type === "photo_truck" || !img?.photo_type ? "camion" : img?.photo_type === "photo_before" ? "before" : "after";

      const filename = `image_${typePhoto}_${index + 1}.jpg`;
      files[filename] = new Uint8Array(buffer);
    }

    const zipData: Uint8Array = await new Promise((resolve, reject) => {
      zip(files, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const base64Zip = this.uint8ArrayToBase64(zipData);

    const fileName = `photos_${this.data.planning.intervention.name}_${this.planningType}_${this.data.planning.id}_${this.data.planning.today_schedule.date}.zip`;

    const logoUrl = `${environment.url_web}/assets/img/logo-Ideo2.png`;

    await this.loadingService.dimiss();

    EmailComposer.open({
      to: ["h.hadjrabah@ideogroupe.fr"],
      subject: `Rapport photos ${this.data.planning.intervention.name}`,
      isHtml: true,
      body: this.buildEmailHtml(logoUrl),
      attachments: [
        {
          type: "base64",
          path: base64Zip,
          name: fileName
        }
      ]
    });
  }

  buildEmailHtml(logoUrl: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin:0; padding:0; background:#ddf5ff; font-family:Arial,sans-serif; }
    table { width:100%; border-collapse:collapse; }
    img { max-width:100%; height:auto; display:block; }
  </style>
</head>
<body>
  <center>
    <table style="max-width:600px;background:#ffffff;">
      <tr>
        <td align="center" style="padding:30px;">
          <img src="${"https://ideo.webo.tn/assets/logo-afd07cf48e2d231f6478ebb84df8ff36ea2470c7f5aac563557cd07dbb0e32cf.png"}" width="200" />
        </td>
      </tr>
      <tr>
        <td style="padding:20px;color:#333;font-size:16px;line-height:1.6;">
          Agent : ${this.user.first_name} ${this.user.last_name}<br><br>
          Identifiant agent : ${this.user.id}<br><br>
          Type de mission : ${this.data.planningType === "punctual" ? "Ponctuelle" : this.data.planningType === "regular" ? "Régulière" : "Forfaitaire"}<br><br>
          Mission : ${this.data.planning.intervention.name}<br><br>
          Date : ${this.data.planning.date || ""}<br><br>
          Identifiant mission : ${this.data.planning.id}<br><br>
          Identifiant Schedule : ${this.data.planning.today_schedule.id}

        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
  }

  uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
  }

  async deletePhoto(type: string, i: number, uuid: string, photo: any) {
    uuid = photo?.client_uuid;
    if (type?.includes("before")) {
      photo = this.grouped_presentation_photos[i][0];
    } else if (type?.includes("after")) {
      photo = this.grouped_presentation_photos[i][1];
    } else {
      photo = this.photos_truck[i];
    }

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
    await this.performDeletePhoto(targetPhoto, photosArray, type, i, typePhoroto, photo.client_uuid, checkGroupedRemoval);
  }
}
