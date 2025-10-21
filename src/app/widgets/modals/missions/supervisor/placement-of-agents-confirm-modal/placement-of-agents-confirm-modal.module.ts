import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {PlacementOfAgentsConfirmModalPageRoutingModule} from "./placement-of-agents-confirm-modal-routing.module";
import {PlacementOfAgentsConfirmModalPage} from "./placement-of-agents-confirm-modal.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlacementOfAgentsConfirmModalPageRoutingModule, TranslateModule],
  declarations: [PlacementOfAgentsConfirmModalPage],
  exports: [PlacementOfAgentsConfirmModalPage]
})
export class PlacementOfAgentsConfirmModalPageModule {}
