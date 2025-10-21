import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {SupervisorPlanningsPageRoutingModule} from "./supervisor-plannings-routing.module";

import {SupervisorPlanningsPage} from "./supervisor-plannings.page";
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "src/app/widgets/intervention/punctual/punctual.module";
import {CapitalizeFirstLetterPipe} from "../../../../pipes/capitalize-first-letter.pipe";
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SupervisorPlanningsPageRoutingModule, TranslateModule, ComponentsModule, CapitalizeFirstLetterPipe],
  declarations: [SupervisorPlanningsPage]
})
export class SupervisorPlanningsPageModule {}
