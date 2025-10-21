import {Injectable} from "@angular/core";
@Injectable({
  providedIn: "root"
})
export class PdfTakerService {
  constructor() {}

  async selectPdf(): Promise<File | null> {
    return new Promise((resolve, reject) => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".xlsm", ".csv"].join(",");
      fileInput.style.display = "none";
      fileInput.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          resolve(file);
        } else {
          resolve(null);
        }
      };

      fileInput.onerror = error => {
        reject(error);
      };

      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    });
  }

  readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
