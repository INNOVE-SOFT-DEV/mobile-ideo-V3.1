import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
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
  private newApiUrl = `${environment.newApiUrl}`;
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
  getSupervisorAudioReport(data: any): Observable<any> {
    return this.http.get<any>(`${this.newApiUrl}schedules/${data}/get_audio_report`);
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
  syncPhotos(data: any, internal: any): Observable<any> {
    return this.http.post<any>(`${this.newApiUrl}pointing_internals/${internal}/sync_report`, data);
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
    let url = `${environment.newApiUrl}plannings`;
    const isToDayPlannings = date == new Date().toISOString().split("T")[0] ? true : false;
    const timestamp = new Date(date as string).getTime();
    url = isToDayPlannings ? `${url}?date=${timestamp}` : `${url}?date=${timestamp}`;
    type != "all" ? (url = `${url}&type=${type}`) : url;
    return this.http.get<any>(url).pipe(
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
    const cacheKey = `photo_reports_supervisor_${id}`;
    return this.http.get<any>(`${this.newApiUrl}/schedules/${id}/photos/all`).pipe(
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

    /*return this.http.get<any>(`${this.apiUrl}photos_report/photos_report_supervisor/${type}/${id}`).pipe(
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
    );*/
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

  getMissionReturnAudio(id: number): Observable<any> {
    const cacheKey = `mission_return_audio_${id}`;
    return this.http.get<any>(`${this.newApiUrl}pointing_internals/${id}/get_audio_report`).pipe(
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

  deletePhoto(id: string, type: string, uuid: string, typePhoroto: string): Observable<any> {
    const params = new HttpParams().set("photo_type", typePhoroto).set("client_uuid", uuid);
    return this.http.delete(`${this.newApiUrl}pointing_internals/delete_photo/${id}`);

    //return this.http.delete<any>(`${this.apiUrl}interventions/photos/${id}/${type}`);
  }
  getPhotoReport(id: number, type: string): Observable<any> {
    return this.http.get<any>(`${this.newApiUrl}pointing_internals/${id}/photos`);
  }
  createReportPhoto(data: any, id: any): Observable<any> {
    return this.http.post<any>(`${this.newApiUrl}pointing_internals/${id}/upload_photo`, data);
    // return this.http.post<any>(`${this.apiUrl}interventions/photos`, data);
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
    return this.http.post<any>(`${this.newApiUrl}pointing_internals/${data.internal_id}/upload_audio_report`, {audio_report: data.audio_report});
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

  pointing(id: any, type: string, pointing_internal: any): Observable<any> {
    return this.http.post<any>(`${environment.newApiUrl}pointing_internals/${id}/${type}`, pointing_internal);
  }
}
