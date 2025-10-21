import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {SendReportPageRoutingModule} from "./send-report-routing.module";
import {SendReportPage} from "./send-report.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SendReportPageRoutingModule, TranslateModule],
  declarations: [SendReportPage]
})
export class SendReportPageModule {}
