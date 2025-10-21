import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {AgentTrackingPageRoutingModule} from "./agent-tracking-routing.module";
import {AgentTrackingPage} from "./agent-tracking.page";
import {AgentSheetComponent} from "src/app/widgets/modals/agent-sheet/agent-sheet.component";
import {CamionSheetComponent} from "src/app/widgets/modals/camion-sheet/camion-sheet.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AgentTrackingPageRoutingModule, TranslateModule],
  declarations: [AgentTrackingPage, AgentSheetComponent, CamionSheetComponent]
})
export class AgentTrackingPageModule {}
