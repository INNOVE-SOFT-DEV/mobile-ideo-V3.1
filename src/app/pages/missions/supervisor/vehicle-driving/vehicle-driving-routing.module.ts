import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {VehicleDrivingPage} from "./vehicle-driving.page";

const routes: Routes = [
  {
    path: "",
    component: VehicleDrivingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleDrivingPageRoutingModule {}
