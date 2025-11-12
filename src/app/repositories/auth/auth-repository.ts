import {AuthInterface} from "src/app/interfaces/auth/auth-interface";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, switchMap, tap} from "rxjs";
import {environment} from "src/environments/environment";
import {AuthResponse, User} from "src/app/models/auth/user";

@Injectable({
  providedIn: "root"
})
export class AuthRepository implements AuthInterface {
  private apiUrl = `${environment.urlAPI}`;

  constructor(private http: HttpClient) {}
  logOut(): Observable<any> {
    return this.http.get<any>(`${environment.newApiUrl}logout`);
  }

  getUserById(id: any): Observable<any> {
    this.http.get<any>(`${environment.newApiUrl}users/${7}`).subscribe(
      res => {
        // console.log("Get User response:", res);
      },
      error => {
        console.error("Get User error:", error);
      }
    );
    return this.http.get<any>(`${this.apiUrl}user/get_user_by_id/${id}`);
  }

  getAllAgents(): Observable<any> {
    this.http.get<any>(`${environment.newApiUrl}users`).subscribe(
      res => {
        console.log("Get User response:", res);
      },
      error => {
        console.error("Get User error:", error);
      }
    );
    return this.http.get<any>(`${this.apiUrl}user/all_agents`);
  }

  updateProfilePicture(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}user/update_profile_picture`, data);
  }
  getVehicleHistiory(date?: string): Observable<any> {
    const month = date ? date : "";
    return this.http.get<any>(`${this.apiUrl}interventions/get_current_month_return_vehicule/${month}`);
  }

  uploadUserDocument(doc: FormData): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}user`, doc);
  }

  updateProfile(data: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}user/update_user_data`, data);
  }
  login(payload: any): Observable<AuthResponse> {
    const acessAagent = {email: "c@c.com", password: "123456"};
    const acessSupervisor = {email: "faidi@mail.com", password: "123456"};

    return this.http.post<AuthResponse>(`${environment.newApiUrl}login`, payload).pipe(
      tap(res => {
        console.log("Login response:", res);
        localStorage.setItem("token-v3", res.token);
        localStorage.setItem("user-v3", JSON.stringify(res.user));
      }),
      switchMap(res => {
        console.log(res.user);
        if (res?.user?.role === "supervisor") {
          return this.http.post<AuthResponse>(`${this.apiUrl}auth/login`, acessSupervisor);
        } else {
          return this.http.post<AuthResponse>(`${this.apiUrl}auth/login`, acessAagent);
        }
      })
    );
  }
}
