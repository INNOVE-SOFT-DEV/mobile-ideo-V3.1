import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ChangeVehiclePage} from "./change-vehicle.page";

const routes: Routes = [
  {
    path: "",
    component: ChangeVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeVehiclePageRoutingModule {}
