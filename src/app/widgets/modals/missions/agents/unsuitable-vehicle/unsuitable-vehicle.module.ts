import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {UnsuitableVehiclePageRoutingModule} from "./unsuitable-vehicle-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {UnsuitableVehiclePage} from "./unsuitable-vehicle.page";
import {GlideComponent} from "../../../../glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, UnsuitableVehiclePageRoutingModule, GlideComponent],
  declarations: [UnsuitableVehiclePage],
  exports: [UnsuitableVehiclePage]
})
export class UnsuitableVehiclePageModule {}
