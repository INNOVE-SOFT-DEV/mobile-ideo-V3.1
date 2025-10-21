import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "src/environments/environment";
import {AbsenceInterface} from "src/app/interfaces/absence/absence-interface";

@Injectable({
  providedIn: "root"
})
export class AbsenceRepository implements AbsenceInterface {
  private apiUrl = `${environment.urlAPI}`;

  constructor(private http: HttpClient) {}
  changeAbsenceState(state: string, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}user/absence/${id}`, {state, id});
  }
  getAbsencesByState(state: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/list_absences_by_state/${state}`);
  }
  getPendingAbsencesCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/supervisor_absences_count`);
  }
  updateAbsenceRequest(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}user/agent_absence_update/${id}`, data);
  }

  getAbsencesFromapi(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/absences`);
  }
  sendAbsenceRequest(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}user/absence`, data);
  }
}
