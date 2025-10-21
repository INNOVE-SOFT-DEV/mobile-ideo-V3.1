import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

import {IonicModule} from "@ionic/angular";

import {UpdatePageRoutingModule} from "./update-routing.module";

import {UpdatePage} from "./update.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, UpdatePageRoutingModule],
  declarations: [UpdatePage]
})
export class UpdatePageModule {}
