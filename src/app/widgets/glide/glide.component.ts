import {CommonModule} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import Glide from "@glidejs/glide";
import {Network} from "@capacitor/network";
import {Filesystem, Directory} from "@capacitor/filesystem";
import {Capacitor} from "@capacitor/core";
import {ToastControllerService} from "../toast-controller/toast-controller.service";

@Component({
  selector: "app-glide",
  templateUrl: "./glide.component.html",
  styleUrls: ["./glide.component.scss"],
  imports: [CommonModule]
})
export class GlideComponent implements OnInit {
  @Input() images: any[] = [];
  @Input() index: number = 0;

  downloadingIndex: number | null = null;

  glide: any = new Glide(".glide", {
    type: "slider",
    perView: 1,
    focusAt: "center",
    gap: 10
  });

  constructor(private Toast: ToastControllerService) {
    const T = setTimeout(() => {
      this.glide.mount();
      this.glide.go(`=${this.index}`);
      clearTimeout(T);
    }, 100);
  }

  ngOnInit() {}

  // ─── URL Detection ───────────────────────────────────────────────

  isLocalUrl(url: string): boolean {
    return (
      url.startsWith("capacitor://") ||
      url.startsWith("filesystem://") ||
      url.startsWith("blob:") ||
      url.startsWith("file://") ||
      url.startsWith("/_capacitor_file_/") ||
      url.startsWith("data:")
    );
  }

  // ─── Main Download Handler ───────────────────────────────────────

  async downloadImage(image: any, index: number) {
    const url: string = image?.photo?.url || image?.url;

    if (!url) {
      await this.Toast.presentToast("Aucune URL trouvée pour cette image.", "danger");
      return;
    }

    const isLocal = this.isLocalUrl(url);

    if (!isLocal) {
      const status = await Network.getStatus();
      if (!status.connected) {
        await this.Toast.presentToast(
          "Vous êtes hors ligne. Impossible de télécharger des images distantes.",
          "danger"
        );
        return;
      }
    }

    try {
      this.downloadingIndex = index;

      const base64 = await this.urlToBase64(url);
      const extension = this.getExtensionFromBase64(base64) || "jpg";
      const fileName = `IMG_${Date.now()}.${extension}`;
      const platform = Capacitor.getPlatform();

      if (platform === "android") {
        await this.saveToAndroidGallery(base64, fileName);
      } else if (platform === "ios") {
        await this.saveToIOSGallery(base64, fileName);
      } else {
        this.webDownload(base64, fileName);
      }

      await this.Toast.presentToast("Image enregistrée dans la galerie !", "success");

    } catch (err: any) {
      console.error(err);
      await this.Toast.presentToast(
        `Échec de l'enregistrement : ${err?.message || "Erreur inconnue"}`,
        "danger"
      );
    } finally {
      this.downloadingIndex = null;
    }
  }

  // ─── Android: Save to public Pictures folder ────────────────────

  private async saveToAndroidGallery(base64: string, fileName: string) {
    // Request storage permission (required for Android < 10)
    const permission = await Filesystem.requestPermissions();
    if (permission.publicStorage !== "granted") {
      throw new Error("Permission de stockage refusée.");
    }

    // Write to public Pictures directory — auto-indexed by gallery on Android 10+
    await Filesystem.writeFile({
      path: `Pictures/ideogroupe/${fileName}`,
      data: base64.split(",")[1],
      directory: Directory.ExternalStorage,
      recursive: true
    });

    // Get the native URI and trigger media scan for older Android
    const {uri} = await Filesystem.getUri({
      path: `Pictures/ideogroupe/${fileName}`,
      directory: Directory.ExternalStorage
    });

    this.triggerAndroidMediaScan(uri);
  }

  // Android 9 and below: signal MediaScannerConnection via iframe trick
  private triggerAndroidMediaScan(fileUri: string) {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = fileUri;
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    } catch (e) {
      console.warn("Déclenchement du scan média échoué :", e);
    }
  }

  // ─── iOS: Write to cache then share to Photos ────────────────────

  private async saveToIOSGallery(base64: string, fileName: string) {
    const tempPath = `temp/${fileName}`;

    // Write image to cache directory
    await Filesystem.writeFile({
      path: tempPath,
      data: base64.split(",")[1],
      directory: Directory.Cache,
      recursive: true
    });

    // Resolve native file URI
    const fileUri = await Filesystem.getUri({
      path: tempPath,
      directory: Directory.Cache
    });

    // Open native Share sheet — user taps "Enregistrer l'image" to save to Photos
    const {Share} = await import("@capacitor/share");
    await Share.share({
      title: "Enregistrer l'image",
      url: fileUri.uri,
      dialogTitle: "Enregistrer dans Photos"
    });

    // Clean up temp file after sharing
    await Filesystem.deleteFile({
      path: tempPath,
      directory: Directory.Cache
    });
  }

  // ─── Web browser fallback ─────────────────────────────────────────

  private webDownload(base64: string, fileName: string) {
    const a = document.createElement("a");
    a.href = base64;
    a.download = fileName;
    a.click();
  }

  // ─── Utilities ────────────────────────────────────────────────────

  private async urlToBase64(url: string): Promise<string> {
    // Already a data URL — return as-is
    if (url.startsWith("data:")) return url;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Échec du téléchargement de l'image");

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private getExtensionFromBase64(base64: string): string {
    // Extract extension from "data:image/jpeg;base64,..." → "jpeg"
    const match = base64.match(/data:image\/(\w+);base64/);
    return match ? match[1] : "jpg";
  }
}