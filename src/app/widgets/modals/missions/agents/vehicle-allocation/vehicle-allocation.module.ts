import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {VehicleAllocationPageRoutingModule} from "./vehicle-allocation-routing.module";
import {VehicleAllocationPage} from "./vehicle-allocation.page";
import {GlideComponent} from "../../../../glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VehicleAllocationPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [VehicleAllocationPage],
  exports: [VehicleAllocationPage]
})
export class VehicleAllocationPageModule {}
