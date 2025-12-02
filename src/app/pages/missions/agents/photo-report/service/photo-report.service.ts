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

  async checkAndSyncPhotos() {
    if (this.isSyncingLock) {
      return;
    }
    this.isSyncingLock = true;
    this.isSyncingSubject.next(true);
    try {
      const reportsToSync = JSON.parse(localStorage.getItem("report_need_sync")!) || [];

      for (const report of reportsToSync) {
        const groupedPresentationPhotos = JSON.parse(localStorage.getItem(`photo_report_${report.type}_${report.id}_presentation`)!) || [];
        for (const group of groupedPresentationPhotos) {

          const uuid = group[0]?.photo?.client_uuid || group[1]?.photo?.client_uuid || this.generateUniqueId();
          let body: any = {};
          if (group[0]?.photo?.path && group[0].photo.path.includes("v3")) {
            const fileDataBefore = await this.fs.readSecretFile(group[0].photo.path);

          }
          if (group[1]?.photo?.path && group[1].photo.path.includes("v3")) {
            const fileDataAfter = await this.fs.readSecretFile(group[1].photo.path);
          }
        }
        const photosTruck = JSON.parse(localStorage.getItem(`photo_report_${report.type}_${report.id}_truck`)!) || [];
      }

      // for (const report of reportsToSync) {
      //   const zip = new JSZip();
      //   const reportFolder = zip.folder(`${report.type}_${report.id}`);
      //   if (!reportFolder) continue;
      //   const truckFolder: any = reportFolder.folder("truck");
      //   const presentationFolder: any = reportFolder.folder("presentation");
      //   const groupedPresentationPhotos = JSON.parse(localStorage.getItem(`photo_report_${report.type}_${report.id}_presentation`)!) || [];
      //   const photosTruck = JSON.parse(localStorage.getItem(`photo_report_${report.type}_${report.id}_truck`)!) || [];
      //   for (const group of groupedPresentationPhotos) {
      //     if (group[0]?.photo?.path && group[0].photo.path.includes("v3")) {
      //       const fileDataBefore = await this.fs.readSecretFile(group[0].photo.path);
      //       const dateBefore = group[0].photo.date;
      //       const filenameBefore = `photo_before_${group[0].photo.prestation_id}_${dateBefore}.jpeg`;
      //       const binaryBefore = await this.base64ToArrayBuffer(fileDataBefore);
      //       presentationFolder.file(filenameBefore, binaryBefore);
      //     }
      //     if (group[1]?.photo?.path && group[1].photo.path.includes("v3")) {
      //       const fileDataAfter = await this.fs.readSecretFile(group[1].photo.path);
      //       const dateAfter = group[1].photo.date;
      //       const filenameAfter = `photo_after_${group[1].photo.prestation_id}_${dateAfter}.jpeg`;
      //       const binaryAfter = await this.base64ToArrayBuffer(fileDataAfter);
      //       presentationFolder.file(filenameAfter, binaryAfter);
      //     }
      //   }

      //   for (const photo of photosTruck) {
      //     if (!photo.path || !photo.date) continue;
      //     const fileData = await this.fs.readSecretFile(photo.path);
      //     const dateTruck = photo.date;
      //     const originalFilename = photo.path.split("/").pop() || `truck_photo_${photo.id}.jpeg`;
      //     const filenameParts = originalFilename.split(".");
      //     const filenameWithDate = `${filenameParts[0]}_${dateTruck}_${photo.prestation_id}.${filenameParts[1] || "jpeg"}`;
      //     const binary = await this.base64ToArrayBuffer(fileData);
      //     truckFolder.file(filenameWithDate, binary);
      //   }
      //   const zipBlob = await zip.generateAsync({type: "blob"});
      //   const formData = new FormData();
      //   formData.append("zip_file", zipBlob, `${report.type}_${report.id}.zip`);
      //   this.missionsService.syncPhotos(formData).subscribe({
      //     next: async () => {
      //       this.missionsService.getAgentReport(report.id, report.type).subscribe({
      //         next: async (res: any) => {
      //           let empty: any = {
      //             id: null,
      //             photo_type: null,
      //             photo: {
      //               url: ""
      //             }
      //           };
      //           const grouped = Object.values(res.grouped_photos_prestation).map((group: any, i: number) => {
      //             const before = group.find((p: any) => p.photo_type === "photo_before");
      //             const after = group.find((p: any) => p.photo_type === "photo_after");
      //             if (before && after) {
      //               return [before, after];
      //             } else if (before && !after) {
      //               empty.id = i + 1;
      //               empty.photo_type = "photo_after";
      //               return [before, empty];
      //             } else {
      //               empty.id = i + 1;
      //               empty.photo_type = "photo_before";
      //               return [empty, after];
      //             }
      //           });
      //           localStorage.setItem(`photo_report_${report.type}_${report.id}_presentation`, JSON.stringify(grouped));
      //           localStorage.setItem(`photo_report_${report.type}_${report.id}_truck`, JSON.stringify(res.photos_truck.map((photo: any) => photo.photo)));
      //           reportsToSync.splice(reportsToSync.indexOf(report), 1);
      //           localStorage.setItem("report_need_sync", JSON.stringify(reportsToSync));
      //           this.doneEvent.emit(res);
      //         },
      //         error: async error => {
      //           console.error("Error syncing photos:", error);
      //         }
      //       });
      //     },
      //     error: async error => {
      //       console.error("Error syncing photos:", error);
      //     }
      //   });
      // }
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
          grouped_presentation_photos[i][0].photo.prestation_id = value.prestation_id;
          this.updateLocalPhotos(value.photo_type, grouped_presentation_photos);
        } else if (value.photo_type == "photo_after") {
          grouped_presentation_photos[i][1].photo.url = value.photo.url;
          grouped_presentation_photos[i][1].photo.prestation_id = value.prestation_id;
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
      const match = group[i]?.photo?.prestation_id;

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
      const match = group[i]?.photo?.prestation_id;
      return match || p.client_uuid || null;
    });

    return updatedClientUuids;
  }

  uploadImagetoApi(base64String: any, type: string, currentDate: any) {
    const uniqueId = this.generateUniqueId();
    type = type === "photo_before" ? "before" : type === "photo_truck" ? "truck" : "after";

    const imageBase64 = base64String.startsWith("data:image") ? base64String : `data:image/jpeg;base64,${base64String}`;

    const payload = {
      photo: [
        {
          photo_type: type,
          client_uuid: uniqueId,
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
