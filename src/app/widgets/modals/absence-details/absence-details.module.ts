import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {AbsenceDetailsPageRoutingModule} from "./absence-details-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {AbsenceDetailsPage} from "./absence-details.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AbsenceDetailsPageRoutingModule, TranslateModule],
  declarations: [AbsenceDetailsPage],
  exports: [AbsenceDetailsPage]
})
export class AbsenceDetailsPageModule {}
