import {Observable} from "rxjs";
import {PlanningData} from "src/app/models/intervention/mission/mission";
import {Pointing_Internal} from "src/app/models/intervention/pointage/pointing-internal.model";

export interface MissionInterface {
  createMissionReturn(data: any): Observable<any>;
  getMissionReturnAudio(planning_id: number, type_planning: string): Observable<any>;
  getMissionReturn(planning_id: number, type_planning: string): Observable<any>;
  getFreeVehicules(planning_id: number, type_planning: string, user_id: number): Observable<any>;
  createFirstVehiculeReturn(data: any): Observable<any>;
  deleteVehiculeReturnPhoto(returnId: number, fileName: string): Observable<any>;
  createNotAdaptedReturn(data: any): Observable<any>;
  createNotFunctionalReturn(data: any): Observable<any>;
  agentGetVehicule(data: any): Observable<any>;
  reportVehiculeDefect(data: any): Observable<any>;
  createReportPhoto(data: any): Observable<any>;
  getPhotoReport(id: number, type: string): Observable<any>;
  pointing(id: any, type: string, body: any): Observable<any>;
  deletePhoto(id: string, type: string): Observable<any>;
  getPlannings(isAgent: boolean, date?: string, type?: string): Observable<any>;
  getSuperVisorPlanningCounts(date?: string): Observable<any>;
  getPhotoReportsSupervisor(type: string, id: number): Observable<any>;
  generatePhotosReport(data: any): Observable<any>;
  getPointAgents(data: any): Observable<any>;
  syncPhotos(data: any): Observable<any>;
  getAgentReport(id: number, type: string): Observable<any>;
  updateNoIncludePhotos(data: PlanningData): Observable<any>;
  getRegularReturns(planning_id: number, type_planning: string, filter: boolean): Observable<any>;
  getVehiculeReturnByPlanning(id: number, type: string): Observable<any>;
  dispatchAgent(data: any): Observable<any>;
  getDispatchAgent(): Observable<any>;
}
