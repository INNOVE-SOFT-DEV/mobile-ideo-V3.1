import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {InfoBoxMaterialPageRoutingModule} from "./info-box-material-routing.module";
import {InfoBoxMaterialPage} from "./info-box-material.page";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, InfoBoxMaterialPageRoutingModule, TranslateModule],
  declarations: [InfoBoxMaterialPage],
  exports: [InfoBoxMaterialPage]
})
export class InfoBoxMaterialPageModule {}
