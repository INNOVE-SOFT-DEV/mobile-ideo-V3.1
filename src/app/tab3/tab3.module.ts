import {IonicModule} from "@ionic/angular";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Tab3Page} from "./tab3.page";
import {ExploreContainerComponentModule} from "../explore-container/explore-container.module";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {Tab3PageRoutingModule} from "./tab3-routing.module";
import {AbsenceSupervisorPage} from "../pages/absences/absence-supervisor/absence-supervisor.page";
import {AgentAbsencePage} from "../pages/absences/agent-absence/agent-absence.page";

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ExploreContainerComponentModule, Tab3PageRoutingModule, TranslateModule],
  declarations: [Tab3Page, AbsenceSupervisorPage, AgentAbsencePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})
export class Tab3PageModule {}
