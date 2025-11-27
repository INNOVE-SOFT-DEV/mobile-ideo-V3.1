import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {from, Observable, switchMap} from "rxjs";
import {environment} from "src/environments/environment";
import {AbsenceInterface} from "src/app/interfaces/absence/absence-interface";
import {SqliteServiceTs} from "src/app/widgets/storage/sqlite.service.ts";
import {AuthService} from "src/app/pages/login/service/auth.service";

@Injectable({
  providedIn: "root"
})
export class AbsenceRepository implements AbsenceInterface {
  private apiUrl = `${environment.urlAPI}`;
  private newApiUrl = `${environment.newApiUrl}`;

  constructor(
    private http: HttpClient,
    private sqlite: SqliteServiceTs,
    private authService: AuthService
  ) {}
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
    return this.http.put<any>(`${this.newApiUrl}absences/${id}`, data);
  }

  /*updateAbsenceRequest(data: any, id: number): Observable<any> {
    const isOnline = false;
    let converted: any = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => (converted[k] = v));
    } else {
      converted = data;
    }
    const user = this.authService.getCurrentUser();
    const user_id = user?.id || 8;
    const absence = {
      id: id,
      user_id,
      date_start: converted.date_start,
      date_end: converted.date_end,
      motif: converted.motif || null,
      created_at: converted.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type_absence: converted.type_absence,
      document: {url: null},
      state: converted.state || "pending",
      admin_user_id: null
    };

    let promise: Promise<any>;

    if (isOnline) {
      console.log("🌐 En ligne → mise à jour via FormData");
      promise = this.sqlite.smartSave("absences", `user/agent_absence_update/${id}`, data, "update");
    } else {
      console.log("📴 Hors ligne → enregistrement local JSON (UPDATE)");
      promise = this.sqlite.smartSave("absences", `user/agent_absence_update/${id}`, absence, "update");
    }

    return from(promise);
  }*/

  getAbsencesFromapi(): Observable<any> {
    //return from(this.sqlite.smartFetch("absences", "user/absences"));

    return this.http.get<any>(`${this.newApiUrl}absences`);
  }
  sendAbsenceRequest(data: any): Observable<any> {
    /* let converted: any = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => (converted[k] = v));
    } else {
      converted = data;
    }

    const file: File = converted.document; // ton fichier binaire

    return from(file.arrayBuffer()).pipe(
      switchMap((buffer: ArrayBuffer) => {
        const uint8Array = new Uint8Array(buffer);

        const absence = {
          id: Date.now(),
          date_start: converted.date_start,
          date_end: converted.date_end,
          motif: null,
          type_absence: converted.type_absence,
          document: Array.from(uint8Array) // 👈 tableau de nombres
        };

        return this.http.post<any>(`${this.newApiUrl}absences`, data);
      })
    );*/
    return this.http.post<any>(`${this.newApiUrl}absences`, data);
  }

  /*sendAbsenceRequest(data: any): Observable<any> {
    const isOnline = false;
    let converted: any = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => (converted[k] = v));
    } else {
      converted = data;
    }
    const user = this.authService.getCurrentUser();
    const user_id = user?.id || 8;
    const absence = {
      id: Date.now(),
      user_id: user_id,
      date_start: converted.date_start,
      date_end: converted.date_end,
      motif: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type_absence: converted.type_absence,
      document: {url: null},
      state: "pending",
      admin_user_id: null
    };

    let promise: Promise<any>;
    if (isOnline) {
      // console.log("🌐 En ligne → enregistrement avec FormData");
      promise = this.sqlite.smartSave("absences", "user/absence", data, "create");
    } else {
      // console.log("📴 Hors ligne → enregistrement local JSON");
      promise = this.sqlite.smartSave("absences", "user/absence", absence, "create");
    }
    return from(promise);
  }*/
}
