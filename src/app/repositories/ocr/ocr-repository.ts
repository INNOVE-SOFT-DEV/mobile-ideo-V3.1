import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OcrInterface } from "src/app/interfaces/ocr/ocr-interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class OcrRepository  implements OcrInterface {

    constructor(private http: HttpClient) {}
    updateRecipe(recipeData: any): Observable<any> {
        return this.http.put<any>(environment.urlAPI + 'ocr/update_recipe' , recipeData);
    }


extractText(formData : any) {
  return this.http.post<any>(environment.urlAPI + 'ocr', formData);
}


}
