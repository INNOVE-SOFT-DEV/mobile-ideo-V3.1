import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {PlacementOfAgentsAffectPageRoutingModule} from "./placement-of-agents-affect-routing.module";
import {PlacementOfAgentsAffectPage} from "./placement-of-agents-affect.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlacementOfAgentsAffectPageRoutingModule, TranslateModule],
  declarations: [PlacementOfAgentsAffectPage]
})
export class PlacementOfAgentsAffectPageModule {}
