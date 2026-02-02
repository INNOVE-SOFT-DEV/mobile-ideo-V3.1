import {EventEmitter, Injectable} from "@angular/core";
import {Capacitor} from "@capacitor/core";
import {Filesystem, Directory} from "@capacitor/filesystem";
import {Network} from "@capacitor/network";
import {Share} from "@capacitor/share";
import {Platform} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject} from "rxjs";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {FileSystemService} from "src/app/widgets/file-system/file-system.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {v4 as uuidv4} from "uuid";
import {lastValueFrom} from "rxjs";
import {zip, zipSync} from "fflate";

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
    if (this.isSyncingLock) {
      console.warn("🔒 Sync already running, skipping");
      return;
    }

    this.isSyncingLock = true;
    this.isSyncingSubject.next(true);

    console.group("🟡 OFFLINE PHOTO SYNC START");

    try {
      const reportsToSync: any[] = JSON.parse(localStorage.getItem("report_need_sync") || "[]");

      console.log("Reports queued for sync:", reportsToSync);
      // await this.loadingService.present("Synchronisation des photos en cours...");

      // IMPORTANT: clone array to avoid mutation bugs
      for (const report of [...reportsToSync]) {
        console.group(`📦 Syncing report internal=${report.internal}`);

        const obj: Record<string, Uint8Array> = {};
        const expectedFiles: string[] = [];

        const groupedPresentationPhotos = JSON.parse(localStorage.getItem(`photo_report_${report.type}_${report.id}_presentation`) || "[]");

        const photosTruck = JSON.parse(localStorage.getItem(`photo_report_${report.type}_${report.id}_truck`) || "[]");

        console.log("Presentation groups:", groupedPresentationPhotos.length);
        console.log("Truck photos:", photosTruck.length);

        /* ------------------ PRESENTATION PHOTOS ------------------ */
        for (const group of groupedPresentationPhotos) {
          // BEFORE
          if (group?.[0]?.photo?.path && group[0].photo.path.includes("v3")) {
            const filename = `before_${group[0].client_uuid}_${Date.now()}.jpeg`;
            expectedFiles.push(filename);

            try {
              const fileData = await this.fs.readSecretFile(group[0].photo.path);
              obj[filename] = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
            } catch (e) {
              console.error("❌ Failed reading BEFORE photo:", group[0].photo.path, e);
            }
          }

          // AFTER
          if (group?.[1]?.photo?.path && group[1].photo.path.includes("v3")) {
            const filename = `after_${group[1].client_uuid}_${Date.now()}.jpeg`;
            expectedFiles.push(filename);

            try {
              const fileData = await this.fs.readSecretFile(group[1].photo.path);
              obj[filename] = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
            } catch (e) {
              console.error("❌ Failed reading AFTER photo:", group[1].photo.path, e);
            }
          }
        }

        /* ------------------ TRUCK PHOTOS ------------------ */
        for (const photo of photosTruck) {
          if (!photo?.path || !photo?.client_uuid) continue;

          const filename = `truck_${photo.client_uuid}_${Date.now()}.jpeg`;
          expectedFiles.push(filename);

          try {
            const fileData = await this.fs.readSecretFile(photo.path);
            obj[filename] = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
          } catch (e) {
            console.error("❌ Failed reading TRUCK photo:", photo.path, e);
          }
        }

        console.log("Expected files:", expectedFiles.length);
        console.log("Files added to ZIP:", Object.keys(obj).length);
        console.log("ZIP filenames:", Object.keys(obj));

        if (Object.keys(obj).length === 0) {
          console.warn("⚠️ No files to sync for this report, skipping");
          console.groupEnd();
          continue;
        }

        /* ------------------ ZIP CREATION ------------------ */
        const zipBlob: Blob = await new Promise((resolve, reject) => {
          zip(obj, (err, data: any) => {
            if (err) return reject(err);
            resolve(new Blob([data], {type: "application/zip"}));
          });
        });

        console.log("ZIP size (bytes):", zipBlob.size);

        /* ------------------ API SYNC ------------------ */
        const formData = new FormData();
        formData.append("zip", zipBlob, `photos_internal_${report.internal}.zip`);
        formData.append("internal", report.internal.toString());

        const syncRes = await lastValueFrom(this.missionsService.syncPhotos(formData, report.internal));

        console.log("✅ Sync API response:", syncRes);

        /* ------------------ SERVER VERIFICATION ------------------ */
        const serverData = await lastValueFrom(this.missionsService.getPhotoReport(report.internal, report.type));

        console.log("Server pairs:", serverData.pairs?.length);
        console.log("Server truck photos:", serverData.truck?.length);

        if (serverData.pairs.length < groupedPresentationPhotos.length || serverData.truck.length < photosTruck.length) {
          console.warn("⚠️ Server mismatch detected, keeping report in sync queue");
          console.groupEnd();
          continue;
        }

        /* ------------------ LOCAL STORAGE UPDATE ------------------ */
        const grouped = serverData.pairs.map((p: any) => [
          {
            id: p.before.id,
            client_uuid: p.before.client_uuid,
            photo_type: "photo_before",
            photo: {url: p.before.image_url?.url, thumb: p.before.image_url?.thumb}
          },
          {
            id: p.after.id,
            client_uuid: p.after.client_uuid,
            photo_type: "photo_after",
            photo: {url: p.after.image_url?.url, thumb: p.after.image_url?.thumb}
          }
        ]);

        const truckPhotos = serverData.truck.map((t: any) => ({
          id: t.id,
          client_uuid: t.client_uuid,
          photo_type: "photo_truck",
          url: t.image_url?.url,
          thumb: t.image_url?.thumb
        }));

        localStorage.setItem(`photo_report_${report.type}_${report.id}_presentation`, JSON.stringify(grouped));
        localStorage.setItem(`photo_report_${report.type}_${report.id}_truck`, JSON.stringify(truckPhotos));

        /* ------------------ REMOVE FROM SYNC QUEUE ------------------ */
        const index = reportsToSync.findIndex((r: any) => r.internal === report.internal);
        if (index !== -1) {
          reportsToSync.splice(index, 1);
          localStorage.setItem("report_need_sync", JSON.stringify(reportsToSync));
        }

        console.log("🟢 Report fully synced and removed from queue");
        this.doneEvent.emit(true);

        console.groupEnd();
      }
    } catch (err) {
      console.error("🔥 Global sync error:", err);
    } finally {
      console.groupEnd();
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
      this.toastController.presentToast("Action requise une connexion internet", "danger");
      return;
    }

    const loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingService.present(loadingMessage);

    const images = [...grouped_presentation_photos.flat(), ...photos_truck];

    if (images.length === 0) {
      await this.toastController.presentToast("Aucune photo à télécharger", "warning");
      await this.loadingService.dimiss();
      return;
    }

    const files: Record<string, Uint8Array> = {};

    for (const [index, img] of images.entries()) {
      if (!img) continue;

      const url = img?.photo?.url || img?.url;
      const response = await fetch(url);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();

      const typePhoto = img?.photo_type === "photo_truck" || !img?.photo_type ? "camion" : img?.photo_type.includes("before") ? "before" : "after";

      const filename = `image_${typePhoto}_${index + 1}_${intervention_name}_${type}_${date}.jpg`;
      files[filename] = new Uint8Array(buffer);
    }

    // Create ZIP (Uint8Array)
    const zipData: Uint8Array = await new Promise((resolve, reject) => {
      zip(files, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Convert Uint8Array → Base64 (REQUIRED for mobile)
    const base64Zip = this.uint8ArrayToBase64(zipData);

    const fileName = `photos_${intervention_name}_${type}_${date}.zip`;

    await Filesystem.writeFile({
      path: fileName,
      data: base64Zip,
      directory: Directory.Documents
    });

    await this.loadingService.dimiss();

    if (this.platform.is("hybrid")) {
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
    }
  }

  uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
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

  uploadImagetoApi(base64String: any, type: string, currentDate: any, clientUuid?: string) {
    const uniqueId = this.generateUniqueId();
    type = type === "photo_before" ? "before" : type === "photo_truck" ? "truck" : "after";

    const imageBase64 = base64String.startsWith("data:image") ? base64String : `data:image/jpeg;base64,${base64String}`;

    const payload = {
      photo: [
        {
          photo_type: type,
          client_uuid: clientUuid,
          image_base64: imageBase64
        }
      ]
    };
    return payload;
  }
}
