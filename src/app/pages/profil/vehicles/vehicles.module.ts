import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {VehiclesPageRoutingModule} from "./vehicles-routing.module";
import {CapitalizeFirstLetterPipe} from "src/app/pipes/capitalize-first-letter.pipe";

import {VehiclesPage} from "./vehicles.page";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VehiclesPageRoutingModule, TranslateModule, CapitalizeFirstLetterPipe],
  declarations: [VehiclesPage]
})
export class VehiclesPageModule {}
