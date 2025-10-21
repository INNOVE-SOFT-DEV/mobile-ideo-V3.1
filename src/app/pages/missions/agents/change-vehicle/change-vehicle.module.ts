import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {ChangeVehiclePageRoutingModule} from "./change-vehicle-routing.module";
import {ChangeVehiclePage} from "./change-vehicle.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChangeVehiclePageRoutingModule, TranslateModule],
  declarations: [ChangeVehiclePage]
})
export class ChangeVehiclePageModule {}
