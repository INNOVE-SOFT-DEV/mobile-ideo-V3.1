import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {NonRollingVehiclePageRoutingModule} from "./non-rolling-vehicle-routing.module";
import {NonRollingVehiclePage} from "./non-rolling-vehicle.page";
import {GlideComponent} from "../../../../glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, NonRollingVehiclePageRoutingModule, TranslateModule, GlideComponent],
  declarations: [NonRollingVehiclePage],
  exports: [NonRollingVehiclePage]
})
export class NonRollingVehiclePageModule {}
