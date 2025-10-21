import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {AbsenceRequestPageRoutingModule} from "./absence-request-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {AbsenceRequestPage} from "./absence-request.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AbsenceRequestPageRoutingModule, TranslateModule],
  declarations: [AbsenceRequestPage]
})
export class AbsenceRequestPageModule {}
