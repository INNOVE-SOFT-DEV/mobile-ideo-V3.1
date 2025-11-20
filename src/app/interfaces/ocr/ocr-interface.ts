import {Observable} from "rxjs";

export interface OcrInterface {
  extractText(text: any): Observable<any>;
  updateRecipe(recipeData: any): Observable<any>;
}
