import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {GdcPageRoutingModule} from "./gdc-routing.module";

import {GdcPage} from "./gdc.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, GdcPageRoutingModule],
  declarations: [GdcPage]
})
export class GdcPageModule {}
