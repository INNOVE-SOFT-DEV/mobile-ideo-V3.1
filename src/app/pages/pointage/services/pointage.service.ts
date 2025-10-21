import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class PointageService {
  private pointage: boolean = false;

  togglePointage(): boolean {
    this.pointage = !this.pointage;
    return this.pointage;
  }

  isPointed(): boolean {
    return this.pointage;
  }

  getConfirmationText(): string {
    return this.pointage ? "Confirmer le pointage (fin de mission)" : "Confirmer le pointage (début de mission)";
  }
}
