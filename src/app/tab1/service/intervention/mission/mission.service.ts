import {EventEmitter, Injectable} from "@angular/core";
import {MissionRepository} from "src/app/repositories/intervention/mission/mission-repository";
import {Observable, Subject, tap} from "rxjs";
import {Intervention, PlanningData} from "src/app/models/intervention/mission/mission";
import {MissionInterface} from "src/app/interfaces/intervention/mission/mission-interface";
import {Network} from "@capacitor/network";
import {Pointing_Internal} from "src/app/models/intervention/pointage/pointing-internal.model";
import {App} from "@capacitor/app";

@Injectable({
  providedIn: "root"
})
export class MissionService implements MissionInterface {
  connected: boolean | null = null;
  punctuals: Intervention[] = [];
  regulars: Intervention[] = [];
  forfaitaires: Intervention[] = [];
  currentPlanning: any;

  refreshEvent = new EventEmitter<any>();
  refreshAgent = new EventEmitter<any>();
  refreshDispatchAgent = new EventEmitter<any>();

  constructor(private missionRepo: MissionRepository) {
    Network.getStatus().then(status => {
      this.connected = status.connected;
    });
    Network.addListener("networkStatusChange", status => {
      this.connected = status.connected;
    });
    App.addListener("appStateChange", ({isActive}) => {
      if (isActive) {
        this.refreshEvent.emit();
      }
    });
  }
  getDispatchAgent(): Observable<any> {
    return this.missionRepo.getDispatchAgent();
  }
  dispatchAgent(data: any): Observable<any> {
    return this.missionRepo.dispatchAgent(data);
  }
  getVehiculeReturnByPlanning(id: number, type: string): Observable<any> {
    return this.missionRepo.getVehiculeReturnByPlanning(id, type);
  }
  getRegularReturns(planning_id: number, type_planning: string, filter: boolean): Observable<any> {
    return this.missionRepo.getRegularReturns(planning_id, type_planning, filter);
  }
  updateNoIncludePhotos(data: PlanningData): Observable<any> {
    return this.missionRepo.updateNoIncludePhotos(data);
  }
  getAgentReport(id: number, type: string): Observable<any> {
    return this.missionRepo.getAgentReport(id, type);
  }
  syncPhotos(data: any): Observable<any> {
    return this.missionRepo.syncPhotos(data);
  }

  getPointAgents(data: any): Observable<any> {
    return this.missionRepo.getPointAgents(data);
  }
  getPhotoReportsSupervisor(type: string, id: number): Observable<any> {
    return this.missionRepo.getPhotoReportsSupervisor(type, id);
  }
  generatePhotosReport(data: any): Observable<any> {
    return this.missionRepo.generatePhotosReport(data);
  }

  getSuperVisorPlanningCounts(date?: string): Observable<any> {
    return this.missionRepo.getSuperVisorPlanningCounts(date);
  }
  getPlannings(isAgent: boolean, date?: string, type?: string): Observable<any> {
    return this.missionRepo.getPlannings(isAgent, date, type);
  }
  deletePhoto(id: string, type: string): Observable<any> {
    return this.missionRepo.deletePhoto(id, type);
  }
  getPhotoReport(id: number, type: string): Observable<any> {
    return this.missionRepo.getPhotoReport(id, type);
  }
  createReportPhoto(data: any, id: any): Observable<any> {
    return this.missionRepo.createReportPhoto(data, id);
  }
  reportVehiculeDefect(data: any): Observable<any> {
    return this.missionRepo.reportVehiculeDefect(data);
  }
  agentGetVehicule(data: any): Observable<any> {
    return this.missionRepo.agentGetVehicule(data);
  }
  createNotFunctionalReturn(data: any): Observable<any> {
    return this.missionRepo.createNotFunctionalReturn(data);
  }

  createNotAdaptedReturn(data: any): Observable<any> {
    return this.missionRepo.createNotAdaptedReturn(data);
  }
  deleteVehiculeReturnPhoto(returnId: number, fileName: string): Observable<any> {
    return this.missionRepo.deleteVehiculeReturnPhoto(returnId, fileName);
  }
  createFirstVehiculeReturn(data: any): Observable<any> {
    return this.missionRepo.createFirstVehiculeReturn(data);
  }
  getFreeVehicules(planning_id: number, type_planning: string, user_id: number): Observable<any> {
    return this.missionRepo.getFreeVehicules(planning_id, type_planning, user_id);
  }
  getMissionReturnAudio(planning_id: number, type_planning: string): Observable<any> {
    return this.missionRepo.getMissionReturnAudio(planning_id, type_planning);
  }
  getMissionReturn(planning_id: number, type_planning: string): Observable<any> {
    return this.missionRepo.getMissionReturn(planning_id, type_planning);
  }
  createMissionReturn(data: any): Observable<any> {
    return this.missionRepo.createMissionReturn(data);
  }

  pointing(id: any, type: string, body: any): Observable<any> {
    return this.missionRepo.pointing(id, type, body);
  }

  private backDataSubject = new Subject<any>();
  backData$ = this.backDataSubject.asObservable();

  sendBackData(data: any) {
    this.backDataSubject.next(data);
  }
}
