import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {MaterialsInterface} from "src/app/interfaces/materials/materials-interface";
import {environment} from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class MaterialsRepository implements MaterialsInterface {
  private apiUrl = `${environment.urlAPI}`;
  constructor(private http: HttpClient) {}
  getUserVehiculeReturns(id: any, date: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}interventions/get_user_vehicule_returns/${id}/${date}`);
  }

  getAllVehicules(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/get_all_vehicules`);
  }
  takeMaterialRequest(note: string, id: number, state: string, materialId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}user/user_take_material`, {note, state, id, materialId});
  }

  changeUserMaterialState(state: string, id: Number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}user/change_user_material_state`, {state, id});
  }

  allUserMaterials(state: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}materials/all_user_materials`, {status: state});
  }

  allUserMaterialsCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}materials/all_user_materials_count`);
  }

  destroyPhoto(type: string, id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}user/materials/${type}/${id}`);
  }
  getMaterialById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/material/${id}`);
  }
  addPhoto(formData: FormData, type: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}user/materials/${type}/v2`, formData);
  }
  requireMaterials(ids: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}user/materials/require/v2`, ids);
  }
  getMaterials(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}materials/v2`);
  }
  getMyMaterials() {
    return this.http.get<any>(`${this.apiUrl}user/materials/v2`);
  }
}
