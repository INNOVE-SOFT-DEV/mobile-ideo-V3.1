import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {ReportDefectPageRoutingModule} from "./report-defect-routing.module";
import {ReportDefectPage} from "./report-defect.page";
import {GlideComponent} from "../../../../glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReportDefectPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [ReportDefectPage],
  exports: [ReportDefectPage]
})
export class ReportDefectPageModule {}
