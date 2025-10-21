import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {PointagesPageRoutingModule} from "./pointages-routing.module";
import {PointagesPage} from "./pointages.page";
import {PointingStatusIndicatorsComponent} from "../pointing-status-indicators/pointing-status-indicators.component";
import {CapitalizeFirstLetterPipe} from "../../../../pipes/capitalize-first-letter.pipe";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PointagesPageRoutingModule, TranslateModule, PointingStatusIndicatorsComponent, CapitalizeFirstLetterPipe],
  declarations: [PointagesPage]
})
export class PointagesPageModule {}
