import {EventEmitter, Injectable} from "@angular/core";
import {Capacitor} from "@capacitor/core";
import {Filesystem, Directory} from "@capacitor/filesystem";
import {Network} from "@capacitor/network";
import {Share} from "@capacitor/share";
import {Platform} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import JSZip from "jszip";
import {BehaviorSubject} from "rxjs";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {FileSystemService} from "src/app/widgets/file-system/file-system.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {v4 as uuidv4} from "uuid";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PhotoReportService {
  data: any = {planning: {id: null}};
  planningType: any;
  isConneted: boolean | null = null;
  doneEvent = new EventEmitter<any>();

  private progressSubject = new BehaviorSubject<number>(0);
  public progress$ = this.progressSubject.asObservable();
  private isSyncingSubject = new BehaviorSubject<boolean>(false);
  public isSyncing$ = this.isSyncingSubject.asObservable();
  private isSyncingLock = false;
  get currentProgress() {
    return this.progressSubject.value;
  }

  constructor(
    private fs: FileSystemService,
    private missionsService: MissionService,
    private loadingService: LoadingControllerService,
    private toastController: ToastControllerService,
    private platform: Platform,
    private translateService: TranslateService
  ) {
    Network.getStatus().then(status => {
      this.isConneted = status.connected;
    });
  }

  async detectNetworksStatusChange() {
    Network.addListener("networkStatusChange", async status => {
      this.isConneted = status.connected;
      if (status.connected) {
        await this.checkAndSyncPhotos();
      }
    });
  }

  isRemote(photo: any): boolean {
    return photo?.remote === true;
  }

  updateLocalPhoto(report: any, groupPhotosKey: string, clientUuid: string, newUrl: string, typePhoto: string) {
    const photos = JSON.parse(localStorage.getItem(groupPhotosKey)!) || [];

    let changed = false;

    for (const group of photos) {
      for (const item of group) {
        const type = item.photo_type === "photo_before" ? "before" : "after";
        if (item?.client_uuid === clientUuid && type === typePhoto) {
          item.photo.url = newUrl;
          item.photo.path = newUrl;
          item.photo.remote = false;
          changed = true;
        }
      }
    }

    if (changed) {
      localStorage.setItem(groupPhotosKey, JSON.stringify(photos));
    }
  }

  async checkAndSyncPhotos() {
    if (this.isSyncingLock) return;
    this.isSyncingLock = true;
    this.isSyncingSubject.next(true);
    try {
      const reportsToSync = JSON.parse(localStorage.getItem("report_need_sync")!) || [];
      for (const report of reportsToSync) {
        let groupedPresentationPhotos = JSON.parse(localStorage.getItem(`photo_report_${report.type}_${report.id}_presentation`)!) || [];
        let indexGroupe = 0;
        for (const group of groupedPresentationPhotos) {
          for (let indexItem = 0; indexItem < group.length; indexItem++) {
            const item = group[indexItem];
            if (!item?.photo) continue;
            const photo = item.photo;
            if (!this.isRemote(photo)) continue;
            console.log("🔄 Synchronisation de la photo:", item);
            const fileData = await this.fs.readSecretFile(photo.path);
            const type = item.photo_type === "photo_before" ? "before" : "after";
            const imageBase64 = fileData.startsWith("data:image") ? fileData : `data:image/jpeg;base64,${fileData}`;
            const payload = {
              photo: [
                {
                  photo_type: type,
                  client_uuid: item.client_uuid ,
                  image_base64: imageBase64
                }
              ]
            };
            const response = await lastValueFrom(this.missionsService.createReportPhoto(payload, report.internal));
            const createdPhoto = response?.[0];

            if (createdPhoto?.image_url?.url) {
              const newUrl = createdPhoto.image_url.url;
              const typePhoto = createdPhoto.photo_type;
              const photoToUpdate = typePhoto === "before" ? groupedPresentationPhotos[indexGroupe][0].photo : groupedPresentationPhotos[indexGroupe][1].photo;
              photoToUpdate.url = newUrl;
              photoToUpdate.path = newUrl;
              photoToUpdate.remote = false;

              localStorage.setItem(`photo_report_${report.type}_${report.id}_presentation`, JSON.stringify(groupedPresentationPhotos));

              this.doneEvent.emit(groupedPresentationPhotos);
            }
          }

          indexGroupe++;
        }

        let photosTruck = JSON.parse(localStorage.getItem(`photo_report_${report.type}_${report.id}_truck`)!) || [];
        for (let i = 0; i < photosTruck.length; i++) {
          const truckPhoto = photosTruck[i];
          if (!truckPhoto.remote) continue;
          const uuid = truckPhoto.client_uuid || this.generateUniqueId();
          const fileData = await this.fs.readSecretFile(truckPhoto.path);
          const imageBase64 = fileData.startsWith("data:image") ? fileData : `data:image/jpeg;base64,${fileData}`;
          const payload = {
            photo: [
              {
                photo_type: "truck",
                client_uuid: uuid,
                image_base64: imageBase64
              }
            ]
          };
          const response = await lastValueFrom(this.missionsService.createReportPhoto(payload, report.internal));
          const createdPhoto = response?.[0];
          if (createdPhoto?.image_url?.url) {
            const newUrl = createdPhoto.image_url.url;
            photosTruck[i].url = newUrl;
            photosTruck[i].path = newUrl;
            photosTruck[i].remote = false;
            localStorage.setItem(`photo_report_${report.type}_${report.id}_truck`, JSON.stringify(photosTruck));
            this.doneEvent.emit(photosTruck);

            // console.log("✔️ Truck photo synchronisée:", newUrl);
          }
        }
      }
    } catch (err) {
      console.error("Error syncing photos:", err);
    } finally {
      await this.loadingService.dimiss();
      this.isSyncingLock = false;
      this.isSyncingSubject.next(false);
    }
  }

  async base64ToArrayBuffer(base64: string): Promise<ArrayBuffer> {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async getLocalPhotos(planningId: number, planningType: string) {
    const grouped_presentation_photos = (await JSON.parse(localStorage.getItem(`photo_report_${planningType}_${planningId}_presentation`)!)) || [];
    const photos_truck = (await JSON.parse(localStorage.getItem(`photo_report_${planningType}_${planningId}_truck`)!)) || [];
    return {
      photos_truck,
      grouped_presentation_photos
    };
  }

  async uploadImage(form: any, i: number, grouped_presentation_photos?: any, photos_truck?: any) {
    this.missionsService.createReportPhoto(form, this.getPlanningId()).subscribe({
      next: async value => {
        if (value.photo_type == "photo_before") {
          grouped_presentation_photos[i][0].photo.url = value.photo.url;
          grouped_presentation_photos[i][0].photo.client_uuid = value.client_uuid;
          this.updateLocalPhotos(value.photo_type, grouped_presentation_photos);
        } else if (value.photo_type == "photo_after") {
          grouped_presentation_photos[i][1].photo.url = value.photo.url;
          grouped_presentation_photos[i][1].photo.client_uuid = value.client_uuid;
          this.updateLocalPhotos(value.photo_type, grouped_presentation_photos);
        } else {
          photos_truck[i].url = value.photo.url;
          this.updateLocalPhotos(value.photo_type, photos_truck);
        }
      },
      error(err) {}
    });
  }

  async savePhotoOffline(image: any) {
    let fileName = new Date().getTime() + ".jpeg";
    const data = await this.fs.writeSecretFile(fileName, image.base64String);
    return data;
  }

  updateLocalPhotos(type: string, photos: any) {
    if (type == "photo_truck") {
      localStorage.setItem(`photo_report_${this.planningType}_${this.data.planning.id}_truck`, JSON.stringify(photos));
    } else {
      localStorage.setItem(`photo_report_${this.planningType}_${this.data.planning.id}_presentation`, JSON.stringify(photos));
    }
  }

  async downloadZip(grouped_presentation_photos: any, photos_truck: any, intervention_name: string, type: string, date: string) {
    if (!this.isConneted) {
      this.toastController.presentToast("Action requis une connexion internet", "danger");
      return;
    }
    const loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingService.present(loadingMessage);
    const images = [...grouped_presentation_photos.flat(), ...photos_truck];
    if (images.length == 0) {
      await this.toastController.presentToast("Aucune photo à télécharger", "warning");
      await this.loadingService.dimiss();
      return;
    }
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
    const base64 = await this.blobToBase64(content);
    const fileName = `photos_${intervention_name}_${type}_${date}.zip`;
    await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Documents
    });

    await this.loadingService.dimiss();
    if (this.platform.is("hybrid")) {
      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents
      });
      const fileUri = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName
      });
      await Share.share({
        title: "Partager le fichier",
        text: "Voici votre fichier compressé",
        url: fileUri.uri,
        dialogTitle: "Partager le fichier"
      });
    } else {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  generateUniqueId() {
    const id = uuidv4();
    return id;
  }
  getPlanningId() {
    return this.data.planning.id;
  }

  getPointageId() {
    const user_v3 = JSON.parse(localStorage.getItem("user-v3") || "{}");
    const currentId = user_v3?.id;
    if (!this.data || !this.data.planning || !Array.isArray(this.data.planning.schedule)) {
      console.warn("Schedule non défini ou données non chargées");
      return null;
    }
    const agent = this.data.planning.schedule.flatMap((s: any) => s.agents || []).find((a: any) => a.id === currentId);
    return agent.pointing_internal[0].id || null;
  }

  startedOn() {
    const user_v3 = JSON.parse(localStorage.getItem("user-v3") || "{}");
    const currentId = user_v3?.id;
    if (!this.data || !this.data.planning || !Array.isArray(this.data.planning.schedule)) {
      console.warn("Schedule non défini ou données non chargées");
      return null;
    }
    const agent = this.data.planning.schedule.flatMap((s: any) => s.agents || []).find((a: any) => a.id === currentId);
    return agent.pointing_internal[0].started_on || null;
  }

  updateClientUuidFromGroupedPhotos(data: any, grouped_presentation_photos: any, index: number) {
    if (!data || !Array.isArray(data.photo) || !Array.isArray(grouped_presentation_photos) || !Array.isArray(grouped_presentation_photos[index])) {
      console.warn("⚠️ Données invalides pour updateClientUuidFromGroupedPhotos");
      return data;
    }
    const hasValidPhotoType = data.photo.some((p: any) => p.photo_type === "after" || p.photo_type === "before");

    if (!hasValidPhotoType) {
      console.warn("⏩ Aucun photo_type 'after' ou 'before', aucune mise à jour effectuée.");
      return data;
    }

    const group = grouped_presentation_photos[index];
    data.photo = data.photo.map((p: any, i: number) => {
      const match = group[i]?.photo?.client_uuid;

      if (match) {
        return {
          ...p,
          client_uuid: match
        };
      }

      return p;
    });

    return data;
  }

  getUpdatedClientUuid(data: any, grouped_presentation_photos: any, index: number) {
    // Vérifie que les paramètres sont valides
    if (!data || !Array.isArray(data.photo) || !Array.isArray(grouped_presentation_photos) || !Array.isArray(grouped_presentation_photos[index])) {
      console.warn("⚠️ Données invalides pour getUpdatedClientUuid");
      return [];
    }

    const group = grouped_presentation_photos[index];

    // Retourne uniquement les client_uuid mis à jour
    const updatedClientUuids = data.photo.map((p: any, i: number) => {
      const match = group[i]?.photo?.client_uuid;
      return match || p.client_uuid || null;
    });

    return updatedClientUuids;
  }

  uploadImagetoApi(base64String: any, type: string, currentDate: any , clientUuid?: string) {
    console.log("uploadImagetoApi clientUuid:", clientUuid);
    const uniqueId = this.generateUniqueId();
    type = type === "photo_before" ? "before" : type === "photo_truck" ? "truck" : "after";

    const imageBase64 = base64String.startsWith("data:image") ? base64String : `data:image/jpeg;base64,${base64String}`;

    const payload = {
      photo: [
        {
          photo_type: type,
          client_uuid: clientUuid ,
          image_base64: imageBase64
        }
      ]
    };
    return payload;

    /*
    const fileName = new Date().getTime() + ".jpeg";
    const base64Data = base64String + "";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: "image/jpeg"});
    const uploadData = new FormData();
    uploadData.append("photo", blob, fileName);
    uploadData.append("planning_type", this.planningType);
    uploadData.append("planning_id", this.data.planning.id);
    uploadData.append("uuid", this.generateUniqueId());
     if (this.planningType == "punctual") {
      uploadData.append("planning_punctual_id", this.data.planning.id);
    } else if (this.planningType == "regular") {
      uploadData.append("planning_regular_id", this.data.planning.id);
    } else {
      uploadData.append("forfaitaire_item_id", this.data.planning.id);
    }
    uploadData.append("photo_type", type);
    //uploadData.append("date", currentDate + "");

    return uploadData;*/
  }
}
