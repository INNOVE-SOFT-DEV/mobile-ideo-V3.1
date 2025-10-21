import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {RequestProcessedPageRoutingModule} from "./request-processed-routing.module";
import {TranslateModule} from "@ngx-translate/core";

import {RequestProcessedPage} from "./request-processed.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RequestProcessedPageRoutingModule, TranslateModule],
  declarations: [RequestProcessedPage]
})
export class RequestProcessedPageModule {}
