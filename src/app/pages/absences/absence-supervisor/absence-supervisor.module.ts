import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {AbsenceSupervisorPageRoutingModule} from "./absence-supervisor-routing.module";

import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AbsenceSupervisorPageRoutingModule, TranslateModule]
})
export class AbsenceSupervisorPageModule {}
