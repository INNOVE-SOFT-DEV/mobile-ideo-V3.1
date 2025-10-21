import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {MenuMessionPageRoutingModule} from "./menu-mession-routing.module";
import {MenuMessionPage} from "./menu-mession.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MenuMessionPageRoutingModule, TranslateModule],
  declarations: [MenuMessionPage]
})
export class MenuMessionPageModule {}
