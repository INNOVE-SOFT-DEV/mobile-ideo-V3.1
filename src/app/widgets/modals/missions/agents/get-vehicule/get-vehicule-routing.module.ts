import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {GetVehiculePage} from "./get-vehicule.page";

const routes: Routes = [
  {
    path: "",
    component: GetVehiculePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetVehiculePageRoutingModule {}
