import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {PhotoReportPageRoutingModule} from "./photo-report-routing.module";

import {PhotoReportPage} from "./photo-report.page";
import {TranslateModule} from "@ngx-translate/core";
import {GlideComponent} from "../../../../widgets/glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PhotoReportPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [PhotoReportPage],
  providers: [DatePipe]
})
export class PhotoReportPageModule {}
