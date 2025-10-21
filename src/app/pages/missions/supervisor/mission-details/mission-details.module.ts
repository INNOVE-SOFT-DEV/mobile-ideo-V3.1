import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {MissionDetailsPageRoutingModule} from "./mission-details-routing.module";
import {MissionDetailsPage} from "./mission-details.page";
import {CapitalizeFirstLetterPipe} from "src/app/pipes/capitalize-first-letter.pipe";
import {PointingStatusIndicatorsComponent} from "../pointing-status-indicators/pointing-status-indicators.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MissionDetailsPageRoutingModule,
    TranslateModule,
    CapitalizeFirstLetterPipe,
    PointingStatusIndicatorsComponent,
    ReactiveFormsModule
  ],
  declarations: [MissionDetailsPage]
})
export class MissionDetailsPageModule {}
