import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {ReturnRecurringMissionAgentModalPageRoutingModule} from "./return-recurring-mission-agent-modal-routing.module";
import {ReturnRecurringMissionAgentModalPage} from "./return-recurring-mission-agent-modal.page";
import {GlideComponent} from "src/app/widgets/glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReturnRecurringMissionAgentModalPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [ReturnRecurringMissionAgentModalPage],
  exports: [ReturnRecurringMissionAgentModalPage]
})
export class ReturnRecurringMissionAgentModalPageModule {}
