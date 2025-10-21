import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {MissionsPageRoutingModule} from "./missions-routing.module";
import {MissionsPage} from "./missions.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MissionsPageRoutingModule, TranslateModule],
  declarations: [MissionsPage]
})
export class MissionsPageModule {}
