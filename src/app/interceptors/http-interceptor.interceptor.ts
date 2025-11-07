import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, finalize, Observable, throwError} from "rxjs";
import {LoadingControllerService} from "../widgets/loading-controller/loading-controller.service";
@Injectable()
export class httpInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingControllerService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    const tokenV3 = localStorage.getItem("token-v3");
    let val = request.url.includes("/api/v1/") ? `Bearer ${tokenV3}` : token;


   
    if(!request.url.includes("login")) {
      if (request.body instanceof FormData) {
        request = request.clone({
          setHeaders: {
            "Authorization": `${val}`,
                "ngrok-skip-browser-warning": "true"

          }
        });
      } else {
        request = request.clone({
          setHeaders: {
            "Content-Type": "application/json",
            "Authorization": `${val}`,
            "ngrok-skip-browser-warning": "true"

          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("HTTP Error:", error);
        return throwError(() => error);
      }),
      finalize(async () => {
        // await this.loadingService.dimiss();
      })
    );
  }
}
