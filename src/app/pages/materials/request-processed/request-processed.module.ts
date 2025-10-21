import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RequestProcessedPageRoutingModule} from "./request-processed-routing.module";
import {RequestProcessedPage} from "./request-processed.page";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RequestProcessedPageRoutingModule, TranslateModule],
  declarations: [RequestProcessedPage]
})
export class RequestProcessedPageModule {}
