import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";

import {UpdateProfilePageRoutingModule} from "./update-profile-routing.module";

import {UpdateProfilePage} from "./update-profile.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, UpdateProfilePageRoutingModule, TranslateModule],
  declarations: [UpdateProfilePage],
  exports: [UpdateProfilePage]
})
export class UpdateProfilePageModule {}
