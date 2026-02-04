import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {MaterialsInterface} from "src/app/interfaces/materials/materials-interface";
import {MaterialsRepository} from "src/app/repositories/materials/materials-repository";

@Injectable({
  providedIn: "root"
})
export class MaterialsService implements MaterialsInterface {
  private _materials: any;

  constructor(private materialsRepo: MaterialsRepository) {}
  getUserVehiculeReturns(id: any, date: any): Observable<any> {
    return this.materialsRepo.getUserVehiculeReturns(id, date);
  }
  getAllVehicules(): Observable<any> {
    return this.materialsRepo.getAllVehicules();
  }
  takeMaterialRequest(data: any, id: any): Observable<any> {
    return this.materialsRepo.takeMaterialRequest(data, id);
  }
  takeMaterialRequestReturn(data: any, id: any): Observable<any> {
    return this.materialsRepo.takeMaterialRequestReturn(data, id);
  }
  changeUserMaterialState(state: string, id: number): Observable<any> {
    return this.materialsRepo.changeUserMaterialState(state, id);
  }
  allUserMaterialsCount(): Observable<any> {
    return this.materialsRepo.allUserMaterialsCount();
  }
  allUserMaterials(state: string[]): Observable<any> {
    return this.materialsRepo.allUserMaterials(state);
  }
  destroyPhoto(type: string, id: number): Observable<any> {
    return this.materialsRepo.destroyPhoto(type, id);
  }

  getMaterialById(id: number): Observable<any> {
    return this.materialsRepo.getMaterialById(id);
  }

  addPhoto(formData: FormData, type: string): Observable<any> {
    return this.materialsRepo.addPhoto(formData, type);
  }
  requireMaterials(ids: any): Observable<any> {
    return this.materialsRepo.requireMaterials(ids);
  }
  getMaterials(): Observable<any> {
    return this.materialsRepo.getMaterials();
  }

  getMyMaterials(): Observable<any> {
    return this.materialsRepo.getMyMaterials();
  }

  getMaterialNote(note: string, id: number) {
    const notes = note
      ?.split("/")
      ?.map((ch: string) => {
        if (ch.includes(`user_material_id:${id}`)) {
          const parts = ch.split(":");
          return {
            date: parts[0],
            text: parts[1].split("|")[0]
          };
        }
        return null;
      })
      .filter(item => item);
    return notes;
  }

  set materials(value: any) {
    this._materials = value;
  }

  get materials(): any {
    return this._materials;
  }
}
