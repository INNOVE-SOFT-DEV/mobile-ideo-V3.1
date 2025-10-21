import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MissionReturnsPageRoutingModule} from "./mission-returns-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {MissionReturnsPage} from "./mission-returns.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MissionReturnsPageRoutingModule, TranslateModule],
  declarations: [MissionReturnsPage],
  exports: [MissionReturnsPage]
})
export class MissionReturnsPageModule {}
