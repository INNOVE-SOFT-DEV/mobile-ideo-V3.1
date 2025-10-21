import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {GetVehiculePageRoutingModule} from "./get-vehicule-routing.module";

import {GetVehiculePage} from "./get-vehicule.page";
import {TranslateModule} from "@ngx-translate/core";
import {GlideComponent} from "../../../../glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, GetVehiculePageRoutingModule, TranslateModule, GlideComponent],
  declarations: [GetVehiculePage]
})
export class GetVehiculePageModule {}
