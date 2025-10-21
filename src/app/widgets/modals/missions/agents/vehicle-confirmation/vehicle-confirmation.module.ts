import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {VehicleConfirmationPageRoutingModule} from "./vehicle-confirmation-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {VehicleConfirmationPage} from "./vehicle-confirmation.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VehicleConfirmationPageRoutingModule, TranslateModule],
  declarations: [VehicleConfirmationPage],
  exports: [VehicleConfirmationPage]
})
export class VehicleConfirmationPageModule {}
