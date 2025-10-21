import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AbsenceInterface} from "src/app/interfaces/absence/absence-interface";
import {AbsenceRepository} from "src/app/repositories/absence/absence-repository";

@Injectable({
  providedIn: "root"
})
export class AbsenceService implements AbsenceInterface {
  constructor(private absenceRepo: AbsenceRepository) {}
  changeAbsenceState(state: string, id: number): Observable<any> {
    return this.absenceRepo.changeAbsenceState(state, id);
  }
  getAbsencesByState(state: string): Observable<any> {
    return this.absenceRepo.getAbsencesByState(state);
  }
  getPendingAbsencesCount(): Observable<any> {
    return this.absenceRepo.getPendingAbsencesCount();
  }
  updateAbsenceRequest(data: any, id: number): Observable<any> {
    return this.absenceRepo.updateAbsenceRequest(data, id);
  }
  sendAbsenceRequest(data: any): Observable<any> {
    return this.absenceRepo.sendAbsenceRequest(data);
  }
  getAbsencesFromapi(): Observable<any> {
    return this.absenceRepo.getAbsencesFromapi();
  }
}
