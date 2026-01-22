import {Observable} from "rxjs";
import {AuthResponse, User} from "src/app/models/auth/user";
export interface AuthInterface {
  login(payload: any): Observable<AuthResponse>;
  updateProfile(user: any, userId: any): Observable<User>;
  uploadUserDocument(doc: FormData): Observable<User>;
  getVehicleHistiory(date?: string): Observable<any>;
  updateProfilePicture(data: any): Observable<any>;
  getAllAgents(): Observable<any>;
  getUserById(id: any): Observable<any>;
  logOut(): Observable<any>;
}
