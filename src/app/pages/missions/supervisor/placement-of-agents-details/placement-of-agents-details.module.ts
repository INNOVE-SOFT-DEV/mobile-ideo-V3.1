import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {PlacementOfAgentsDetailsPageRoutingModule} from "./placement-of-agents-details-routing.module";
import {PlacementOfAgentsDetailsPage} from "./placement-of-agents-details.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlacementOfAgentsDetailsPageRoutingModule, TranslateModule],
  declarations: [PlacementOfAgentsDetailsPage]
})
export class PlacementOfAgentsDetailsPageModule {}
