import {Injectable} from "@angular/core";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Injectable({
  providedIn: "root"
})
export class PhotosService {
  lastImage: any;
  multipleImages: any[] = [];
  constructor() {}

  dataURLtoBlob(imagePath: string) {
    const arr = imagePath.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  public async takePictureOption(option: string, quality: number) {
    if (option == "Camera") {
      this.lastImage = await Camera.getPhoto({
        quality: quality,
        correctOrientation: true,
        presentationStyle: "fullscreen",
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      
    } else {
      this.lastImage = await Camera.getPhoto({
        quality: quality,
        correctOrientation: true,
        presentationStyle: "fullscreen",
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });
      console.log("Gallery Image: ", this.lastImage.path);
    }
  }

  async pickImages() {
    const list = await Camera.pickImages({
      quality: 40,
      correctOrientation: true,
      presentationStyle: "fullscreen"
    });
    this.multipleImages = list.photos;
  }

  base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length).fill(0).map((_, i) => slice.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: "jpeg"});
  }
}
