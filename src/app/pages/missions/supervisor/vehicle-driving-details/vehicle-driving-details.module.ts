import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {VehicleDrivingDetailsPageRoutingModule} from "./vehicle-driving-details-routing.module";
import {VehicleDrivingDetailsPage} from "./vehicle-driving-details.page";
import {GlideComponent} from "../../../../widgets/glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VehicleDrivingDetailsPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [VehicleDrivingDetailsPage]
})
export class VehicleDrivingDetailsPageModule {}
