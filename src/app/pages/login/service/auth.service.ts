import {Injectable} from "@angular/core";
import {AuthRepository} from "src/app/repositories/auth/auth-repository";
import {AuthInterface} from "src/app/interfaces/auth/auth-interface";
import {Observable, tap} from "rxjs";
import {AuthResponse, User} from "src/app/models/auth/user";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: "root"
})
export class AuthService implements AuthInterface {
  private currentUser: User | null = null;

  constructor(private authRepo: AuthRepository) {
    const navType = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navType?.type === "reload") {
      this.currentUser = this.getCurrentUser();
    }
  }
  logOut(): Observable<any> {
    throw new Error("Method not implemented.");
  }
  getUserById(id: any): Observable<any> {
    return this.authRepo.getUserById(id).pipe(
      tap(response => {
        return response;
      })
    );
  }
  getAllAgents(): Observable<any> {
    return this.authRepo.getAllAgents().pipe(
      tap(response => {
        return response;
      })
    );
  }
  updateProfilePicture(data: any): Observable<any> {
    return this.authRepo.updateProfilePicture(data).pipe(
      tap(response => {
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          this.currentUser = response.user;
        }
        return response;
      })
    );
  }

  getVehicleHistiory(date?: string): Observable<any> {
    return this.authRepo.getVehicleHistiory(date).pipe(
      tap(response => {
        return response;
      })
    );
  }

  uploadUserDocument(doc: FormData): Observable<User> {
    return this.authRepo.uploadUserDocument(doc).pipe(
      tap(response => {
        return response;
      })
    );
  }


  updateProfile(data: any): Observable<User> {
    return this.authRepo.updateProfile(data).pipe(
      tap((response: any) => {
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          this.currentUser = response.user;
        }
      })
    );
  }

  login(payload: any): Observable<AuthResponse> {
    return this.authRepo.login(payload).pipe(
      tap(response => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        Preferences.set({
          key:'user',
          value:JSON.stringify(response.user)
        });
        this.currentUser = response.user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.authRepo.logOut().subscribe(() => {
      console.log("Logged out from server");
    }, (error) => {
      console.error("Logout error:", error);
    });
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const userData = localStorage.getItem("user");
      this.currentUser = userData ? JSON.parse(userData) : null;
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  isSuperVisor(): boolean {
    return this.currentUser?.role == "supervisor";
  }
  
}
