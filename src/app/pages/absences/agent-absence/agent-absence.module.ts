import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {AgentAbsencePageRoutingModule} from "./agent-absence-routing.module";

import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AgentAbsencePageRoutingModule, TranslateModule]
})
export class AgentAbsencePageModule {}
