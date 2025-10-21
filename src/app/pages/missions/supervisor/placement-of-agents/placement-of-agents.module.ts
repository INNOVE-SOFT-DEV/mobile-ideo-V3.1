import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {PlacementOfAgentsPageRoutingModule} from "./placement-of-agents-routing.module";
import {PlacementOfAgentsPage} from "./placement-of-agents.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlacementOfAgentsPageRoutingModule, TranslateModule],
  declarations: [PlacementOfAgentsPage]
})
export class PlacementOfAgentsPageModule {}
