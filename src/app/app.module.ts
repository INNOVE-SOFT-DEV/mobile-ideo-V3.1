import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouteReuseStrategy} from "@angular/router";
import {HttpClientModule, HttpClient} from "@angular/common/http";
import {IonicModule, IonicRouteStrategy} from "@ionic/angular";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {httpInterceptor} from "./interceptors/http-interceptor.interceptor";
import {FormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {IonicStorageModule} from "@ionic/storage-angular";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation/ngx";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, BackgroundGeolocation, {provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true}, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
