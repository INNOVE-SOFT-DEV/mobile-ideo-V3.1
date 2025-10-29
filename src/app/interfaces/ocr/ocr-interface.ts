import {Observable} from "rxjs";

export interface OcrInterface {
    extractText(text: any): Observable<any>;

}
