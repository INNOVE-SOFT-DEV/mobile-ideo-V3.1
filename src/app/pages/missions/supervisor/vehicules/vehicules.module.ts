import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {VehiculesPageRoutingModule} from "./vehicules-routing.module";
import {VehiculesPage} from "./vehicules.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VehiculesPageRoutingModule, TranslateModule],
  declarations: [VehiculesPage]
})
export class VehiculesPageModule {}
