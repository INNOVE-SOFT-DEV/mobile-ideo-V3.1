import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, from, map, Observable, of, switchMap} from "rxjs";
import {environment} from "src/environments/environment";
import {PlanningData} from "src/app/models/intervention/mission/mission";
import {MissionInterface} from "src/app/interfaces/intervention/mission/mission-interface";
import {Preferences} from "@capacitor/preferences";
import {Pointing_Internal} from "src/app/models/intervention/pointage/pointing-internal.model";
import {Network} from "@capacitor/network";

@Injectable({
  providedIn: "root"
})
export class MissionRepository implements MissionInterface {
  private apiUrl = `${environment.urlAPI}`;
  private backendUrl = `${environment.url_web}`;
  connected: boolean = false;

  constructor(private http: HttpClient) {
    Network.getStatus().then(status => {
      this.connected = status.connected;
    });

    Network.addListener("networkStatusChange", status => {
      this.connected = status.connected;
    });
  }
  getDispatchAgent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}missions/get_dispatch_agent`);
  }
  dispatchAgent(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}missions/dispatch_agent`, data);
  }
  getVehiculeReturnByPlanning(id: number, type: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}missions/find_mission_return_vehicules/${id}/${type}`);
  }
  getRegularReturns(planning_id: number, type_planning: string, filter: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}interventions/get_returns_admin/${planning_id}/-1/${type_planning}/${filter}`);
  }
  updateNoIncludePhotos(data: PlanningData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}photos_report/update_no_include_photos`, data);
  }
  getAgentReport(id: number, type: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}interventions/photos/${id}/${type}`);
  }
  syncPhotos(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}photos_report/sync_photos`, data);
  }

  getPointAgents(data: any): Observable<any> {
    const cacheKey = `point_agents_${JSON.stringify(data)}`;
    return this.http.post<any>(`${this.apiUrl}missions/pointing_agents`, data).pipe(
      switchMap(async response => {
        await Preferences.set({
          key: cacheKey,
          value: JSON.stringify(response)
        });
        return response;
      }),
      catchError(() => {
        return from(Preferences.get({key: cacheKey})).pipe(
          switchMap(storedData => {
            if (storedData.value) {
              return of(JSON.parse(storedData.value));
            }
            return of(null);
          })
        );
      })
    );
  }

  generatePhotosReport(data: any): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}interventions/report`, data);
  }

  getPlannings(isAgent: boolean, date?: string, type?: string): Observable<any> {
    const cacheKey = `plannings_${date}_${type}_${isAgent}`;
    return this.http.get<any>(`${this.apiUrl}missions/plannings/${date}/${type}/${isAgent}`).pipe(
      switchMap(async data => {
        await Preferences.set({
          key: cacheKey,
          value: JSON.stringify(data)
        });
        return data;
      }),
      catchError(() => {
        return from(Preferences.get({key: cacheKey})).pipe(
          switchMap(storedData => {
            if (storedData.value) {
              return of(JSON.parse(storedData.value));
            }
            if (isAgent)
              return of({
                punctuals: [],
                regulars: [],
                forfaitaires: []
              });
            else
              return of({
                [`${type}s`]: []
              });
          })
        );
      })
    );
  }

  getSuperVisorPlanningCounts(date?: string): Observable<any> {
    const cacheKey = `supervisor_planning_counts_${date}`;
    return this.http.get<any>(`${this.apiUrl}missions/supervisor_plannings_counts/${date}`).pipe(
      switchMap(async data => {
        await Preferences.set({
          key: cacheKey,
          value: JSON.stringify(data)
        });
        return data;
      }),
      catchError(() => {
        return from(Preferences.get({key: cacheKey})).pipe(
          switchMap(storedData => {
            if (storedData.value) {
              return of(JSON.parse(storedData.value));
            }
            return of(null);
          })
        );
      })
    );
  }

  getPhotoReportsSupervisor(type: string, id: number): Observable<any> {
    const cacheKey = `photo_reports_supervisor_${type}_${id}`;
    return this.http.get<any>(`${this.apiUrl}photos_report/photos_report_supervisor/${type}/${id}`).pipe(
      switchMap(async data => {
        await Preferences.set({
          key: cacheKey,
          value: JSON.stringify(data)
        });
        return data;
      }),
      catchError(() => {
        return from(Preferences.get({key: cacheKey})).pipe(
          switchMap(storedData => {
            if (storedData.value) {
              return of(JSON.parse(storedData.value));
            }
            return of(null);
          })
        );
      })
    );
  }

  getMissionReturn(planning_id: number, type_planning: string): Observable<any> {
    const cacheKey = `mission_return_${planning_id}_${type_planning}`;
    return this.http.get<any>(`${this.apiUrl}interventions/mission_return/${planning_id}/${type_planning}`).pipe(
      switchMap(async data => {
        await Preferences.set({
          key: cacheKey,
          value: JSON.stringify(data)
        });
        return data;
      }),
      catchError(() => {
        return from(Preferences.get({key: cacheKey})).pipe(
          switchMap(storedData => {
            if (storedData.value) {
              return of(JSON.parse(storedData.value));
            }
            return of(null);
          })
        );
      })
    );
  }

  getMissionReturnAudio(planning_id: number, type_planning: string): Observable<any> {
    const cacheKey = `mission_return_audio_${planning_id}_${type_planning}`;
    return this.http.get<any>(`${this.apiUrl}interventions/mission_return_audio/${planning_id}/${type_planning}`).pipe(
      switchMap(async data => {
        await Preferences.set({
          key: cacheKey,
          value: JSON.stringify(data)
        });
        return data;
      }),
      catchError(() => {
        return from(Preferences.get({key: cacheKey})).pipe(
          switchMap(storedData => {
            if (storedData.value) {
              return of(JSON.parse(storedData.value));
            }
            return of(null);
          })
        );
      })
    );
  }

  deletePhoto(id: string, type: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}interventions/photos/${id}/${type}`);
  }
  getPhotoReport(id: number, type: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}interventions/photos/${id}/${type}`);
  }
  createReportPhoto(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}interventions/photos`, data);
  }
  reportVehiculeDefect(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}interventions/create_has_issue_vehicule_return`, data);
  }
  agentGetVehicule(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}interventions/agent_get_vehicule`, data);
  }
  createNotFunctionalReturn(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}interventions/create_not_function_vehicule_return`, data);
  }

  createNotAdaptedReturn(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}interventions/create_not_adapted_vehicule_return`, data);
  }
  deleteVehiculeReturnPhoto(returnId: number, fileName: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/interventions/delete_vehicule_return_photo/${returnId}/${fileName}`);
  }

  createFirstVehiculeReturn(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}interventions/create_vehicule_return`, data);
  }
  getFreeVehicules(planning_id: number, type_planning: string, user_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/free_vehicules/${planning_id}/${user_id}/${type_planning}`);
  }

  createMissionReturn(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}interventions/mission_return`, data);
  }

  getAgentForfaitaireIntervention(): Observable<PlanningData> {
    return this.http.get<PlanningData>(`${this.apiUrl}planning_forfaitaires`).pipe(
      map(async data => {
        await Preferences.set({
          key: "forfaitaires_agent",
          value: JSON.stringify(data)
        });
        return data;
      }),
      catchError(() => {
        return from(Preferences.get({key: "forfaitaires_agent"})).pipe(
          switchMap(storedData => {
            if (storedData.value) {
              return of(JSON.parse(storedData.value));
            }
            return of(null);
          })
        );
      })
    );
  }

  pointing(pointing_internal: Pointing_Internal): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}interventions/pointing`, pointing_internal);
  }
}
