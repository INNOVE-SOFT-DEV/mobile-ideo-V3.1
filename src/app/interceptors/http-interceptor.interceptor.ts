import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, EMPTY, finalize, Observable, tap, throwError} from "rxjs";
import {LoadingControllerService} from "../widgets/loading-controller/loading-controller.service";
@Injectable()
export class httpInterceptor implements HttpInterceptor {
  api: any = {};
  constructor(private loadingService: LoadingControllerService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    const tokenV3 = localStorage.getItem("token-v3");
    let val = request.url.includes("/api/v1/") ? `Bearer ${tokenV3}` : token;

    if (!request.url.includes("login")) {
      if (request.body instanceof FormData) {
        request = request.clone({
          setHeaders: {
            Authorization: `${val}`,
            "ngrok-skip-browser-warning": "true"
          }
        });
      } else {
        request = request.clone({
          setHeaders: {
            "Content-Type": "application/json",
            Authorization: `${val}`,
            "ngrok-skip-browser-warning": "true"
          }
        });
      }
    }

    if (request.url.includes("chat") || request.url.includes("apideo")) {
      console.warn("HTTP request blocked by interceptor:", request.url);
      this.loadingService.dimiss();
      return EMPTY; // stops execution, no request sent
    }

    if (request.url.includes("/api/v1/")) {
      this.api.url = request.url;
      this.api.method = request.method;
      if (request.body) this.api.body = request.body;
      this.api.headers = {};
      for (const key of request.headers.keys()) {
        this.api.headers[key] = request.headers.get(key);
      }
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response && request.url.includes("/api/v1/")) {
          this.api.response = {
            status: event.status,
            body: event.body
          };

          // console.table(this.api);
        }
      }),

      catchError((error: HttpErrorResponse) => {
        console.error("HTTP Error:", JSON.stringify(error, null, 2), error);
        return throwError(() => error);
      }),
      finalize(async () => {
        // await this.loadingService.dimiss();
      })
    );
  }
}
