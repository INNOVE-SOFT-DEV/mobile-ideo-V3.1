import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {RegularPerAgentPageRoutingModule} from "./regular-per-agent-routing.module";

import {RegularPerAgentPage} from "./regular-per-agent.page";
import {PointingStatusIndicatorsComponent} from "../pointing-status-indicators/pointing-status-indicators.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RegularPerAgentPageRoutingModule, PointingStatusIndicatorsComponent, TranslateModule],
  declarations: [RegularPerAgentPage]
})
export class RegularPerAgentPageModule {}
