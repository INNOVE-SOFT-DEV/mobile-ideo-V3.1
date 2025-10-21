import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {UnsuitableVehiclePage} from "./unsuitable-vehicle.page";

const routes: Routes = [
  {
    path: "",
    component: UnsuitableVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnsuitableVehiclePageRoutingModule {}
