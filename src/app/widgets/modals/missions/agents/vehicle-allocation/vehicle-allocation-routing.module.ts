import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {VehicleAllocationPage} from "./vehicle-allocation.page";

const routes: Routes = [
  {
    path: "",
    component: VehicleAllocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleAllocationPageRoutingModule {}
