import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MaterialsPage} from "./materials.page";
import {ExploreContainerComponentModule} from "../explore-container/explore-container.module";
import {MaterialsPageRoutingModule} from "./materials-routing.module";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {MaterialsAgentComponent} from "../widgets/materials/materials-agent/materials-agent.component";
import {MaterialsSupervisorComponent} from "../widgets/materials/materials-supervisor/materials-supervisor.component";
import {AgentMaterialPage} from "../pages/materials/agent-material/agent-material.page";
import {MaterialsRequestsSupervisorPage} from "../pages/materials/materials-requests-supervisor/materials-requests-supervisor.page";
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ExploreContainerComponentModule, MaterialsPageRoutingModule, TranslateModule],
  declarations: [MaterialsPage, MaterialsAgentComponent, MaterialsSupervisorComponent, AgentMaterialPage, MaterialsRequestsSupervisorPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MaterialsPageModule {}
