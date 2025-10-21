import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {SeeVehiculeByPlanningPage} from "./see-vehicule-by-planning.page";

const routes: Routes = [
  {
    path: "",
    component: SeeVehiculeByPlanningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeeVehiculeByPlanningPageRoutingModule {}
