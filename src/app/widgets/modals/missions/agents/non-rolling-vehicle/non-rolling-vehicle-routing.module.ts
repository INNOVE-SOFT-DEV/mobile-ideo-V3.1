import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {NonRollingVehiclePage} from "./non-rolling-vehicle.page";

const routes: Routes = [
  {
    path: "",
    component: NonRollingVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonRollingVehiclePageRoutingModule {}
