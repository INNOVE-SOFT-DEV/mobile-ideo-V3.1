import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {VehicleDrivingDetailsPage} from "./vehicle-driving-details.page";

const routes: Routes = [
  {
    path: "",
    component: VehicleDrivingDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleDrivingDetailsPageRoutingModule {}
