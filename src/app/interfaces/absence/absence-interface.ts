import {Observable} from "rxjs";

export interface AbsenceInterface {
  getAbsencesFromapi(): Observable<any>;
  sendAbsenceRequest(data: any): Observable<any>;
  updateAbsenceRequest(data: any, id: number): Observable<any>;
  getPendingAbsencesCount(): Observable<any>;
  getAbsencesByState(state: string): Observable<any>;
  changeAbsenceState(state: string, id: number): Observable<any>;
}
