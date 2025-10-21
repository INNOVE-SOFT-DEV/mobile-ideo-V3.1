import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {SeeVehiculeByPlanningPageRoutingModule} from "./see-vehicule-by-planning-routing.module";

import {SeeVehiculeByPlanningPage} from "./see-vehicule-by-planning.page";
import {TranslateModule} from "@ngx-translate/core";
import {GlideComponent} from "src/app/widgets/glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SeeVehiculeByPlanningPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [SeeVehiculeByPlanningPage]
})
export class SeeVehiculeByPlanningPageModule {}
