import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {PointagePageRoutingModule} from "./pointage-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {PointagePage} from "./pointage.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PointagePageRoutingModule, TranslateModule],
  declarations: [PointagePage]
})
export class PointagePageModule {}
