import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {NotAroundIdeoPageRoutingModule} from "./not-around-ideo-routing.module";

import {NotAroundIdeoPage} from "./not-around-ideo.page";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, NotAroundIdeoPageRoutingModule, TranslateModule],
  declarations: [NotAroundIdeoPage]
})
export class NotAroundIdeoPageModule {}
