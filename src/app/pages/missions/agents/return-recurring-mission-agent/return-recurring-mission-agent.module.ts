import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {ReturnRecurringMissionAgentPageRoutingModule} from "./return-recurring-mission-agent-routing.module";
import {ReturnRecurringMissionAgentPage} from "./return-recurring-mission-agent.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReturnRecurringMissionAgentPageRoutingModule, TranslateModule],
  declarations: [ReturnRecurringMissionAgentPage]
})
export class ReturnRecurringMissionAgentPageModule {}
