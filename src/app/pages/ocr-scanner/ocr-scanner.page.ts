import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {OcrService} from "./ocr-service/ocr.service";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {Ocr, TextDetections} from "@capacitor-community/image-to-text";
import {ActionSheetController , LoadingController} from "@ionic/angular";
import { Clipboard } from "@capacitor/clipboard";

@Component({
  selector: "app-ocr-scanner",
  templateUrl: "./ocr-scanner.page.html",
  styleUrls: ["./ocr-scanner.page.scss"],
  standalone: false
})
export class OcrScannerPage implements OnInit {
  recognizedText: any;
  extractedText: string = "";
  loading: boolean = false;
  imageUrl: string | any = null;
  detectedTexts: string[] = [];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private location: Location,
    private ocrService: OcrService,

  ) {}

  // Step 1: Let user choose Camera or Gallery
  async chooseSource() {
    const sheet = await this.actionSheetCtrl.create({
      header: "Select Image Source",
      buttons: [
        {
          text: "📷 Camera",
          handler: () => this.takePhoto(CameraSource.Camera)
        },
        {
          text: "🖼️ Gallery",
          handler: () => this.takePhoto(CameraSource.Photos)
        },
        {text: "Cancel", role: "cancel"}
      ]
    });

    await sheet.present();
  }

  // Step 2: Capture or pick image, then run OCR
  async takePhoto(source: CameraSource) {
    try {
      const photo: any = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source
      });

      if (!photo.path && !photo.webPath) return;
      console.log ("Photo : ", photo);

      this.imageUrl = photo.webPath || photo.path;
      const response = await fetch(this.imageUrl);
      console.log("Response: ", response);
      const blob = await response.blob();
      console.log("Blob: ", blob);

      const loading = await this.loadingCtrl.create({
        message: "Detecting text...",
        spinner: "crescent"
      });
      await loading.present();

      const result: any = await Ocr.detectText({filename: photo.path});
      this.detectedTexts = result.textDetections.map((d: any) => d.text);
      // add copy to clip board concatenated text in a hole string seperated '|' 
      this.extractedText = this.detectedTexts.join(" | ");
      const formData = new FormData();
      formData.append('extracted_text', this.extractedText);
      formData.append('image', blob, new Date().getTime() + '.jpg');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      formData.append('user_id', user.id); // Example user ID
  
      this.ocrService.extractText(formData).subscribe({
        next: async (res) => {
          console.log("Extracted Text:", res);
          // this.extractedText = res.text;
        
          await loading.dismiss();
        },
        error: async (err) => {
          console.error("Error extracting text:", err);
          await loading.dismiss();
        }
      });

      

      await loading.dismiss();
    } catch (error) {
      console.error("OCR Error:", error);
    }
  }

  ngOnInit() {}

  async init() {
    const photo: any = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    const data: TextDetections = await Ocr.detectText({filename: photo.path});

    for (let detection of data.textDetections) {
      console.log(detection.text);
    }
  }

  goBack() {
    this.location.back();
  }
}
