import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {ShareReportPageRoutingModule} from "./share-report-routing.module";
import {ShareReportPage} from "./share-report.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ShareReportPageRoutingModule, TranslateModule],
  declarations: [ShareReportPage]
})
export class ShareReportPageModule {}
