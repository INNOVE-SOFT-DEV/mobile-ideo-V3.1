import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {VehicleDrivingPageRoutingModule} from "./vehicle-driving-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {VehicleDrivingPage} from "./vehicle-driving.page";
import {CapitalizeFirstLetterPipe} from "src/app/pipes/capitalize-first-letter.pipe";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VehicleDrivingPageRoutingModule, TranslateModule, CapitalizeFirstLetterPipe],
  declarations: [VehicleDrivingPage]
})
export class VehicleDrivingPageModule {}
