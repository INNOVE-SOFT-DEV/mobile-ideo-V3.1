import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../pages/login/service/auth.service";
@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated() && state.url === "/login") {
      this.router.navigate(["/tabs"]);
      return false;
    }
    if (!this.authService.isAuthenticated() && state.url !== "/login") {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }
}
