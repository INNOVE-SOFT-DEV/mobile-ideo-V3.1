import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OcrInterface } from "src/app/interfaces/ocr/ocr-interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root' // ✅ This makes it injectable globally
})

export class OcrRepository  implements OcrInterface {

    constructor(private http: HttpClient) {}


extractText(formData : any) {
  return this.http.post<any>(environment.urlAPI + 'ocr', formData);
}


}
