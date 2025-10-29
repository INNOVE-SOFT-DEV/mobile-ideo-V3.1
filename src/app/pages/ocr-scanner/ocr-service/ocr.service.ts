import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {OcrInterface} from "src/app/interfaces/ocr/ocr-interface";
import {OcrRepository} from "src/app/repositories/ocr/ocr-repository";

@Injectable({
  providedIn: "root"
})
export class OcrService implements OcrInterface {
  constructor(private ocrRepository: OcrRepository) {}
  extractText(formData: any): Observable<{formData: any}> {
    return this.ocrRepository.extractText(formData);
  }
}
