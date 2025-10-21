import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {MaterialsRequestsSupervisorPageRoutingModule} from "./materials-requests-supervisor-routing.module";

import {MaterialsRequestsSupervisorPage} from "./materials-requests-supervisor.page";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MaterialsRequestsSupervisorPageRoutingModule, TranslateModule]
})
export class MaterialsRequestsSupervisorPageModule {}
