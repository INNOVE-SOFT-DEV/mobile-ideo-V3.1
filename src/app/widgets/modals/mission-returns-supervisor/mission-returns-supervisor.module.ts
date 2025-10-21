import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {MissionReturnsSupervisorPageRoutingModule} from "./mission-returns-supervisor-routing.module";

import {MissionReturnsSupervisorPage} from "./mission-returns-supervisor.page";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MissionReturnsSupervisorPageRoutingModule, TranslateModule],
  declarations: [MissionReturnsSupervisorPage]
})
export class MissionReturnsSupervisorPageModule {}
