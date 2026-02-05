import {Observable} from "rxjs";

export interface MaterialsInterface {
  getMyMaterials(): Observable<any>;
  getMaterials(): Observable<any>;
  getAllVehicules(): Observable<any>;
  getUserVehiculeReturns(id: any, date: any): Observable<any>;
  requireMaterials(ids: any): Observable<any>;
  allUserMaterials(state: string[]): Observable<any>;
  changeUserMaterialState(state: string, id: number): Observable<any>;
  addPhoto(formData: FormData, type: string): Observable<any>;
  getMaterialById(id: number): Observable<any>;
  destroyPhoto(type: string, id: number): Observable<any>;
  allUserMaterialsCount(state: string): Observable<any>;
  takeMaterialRequest(data: any, id: any): Observable<any>;
  takeMaterialRequestReturn(data: any, id: any): Observable<any>;
}
