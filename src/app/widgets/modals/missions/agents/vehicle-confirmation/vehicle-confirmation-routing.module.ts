import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {VehicleConfirmationPage} from "./vehicle-confirmation.page";

const routes: Routes = [
  {
    path: "",
    component: VehicleConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleConfirmationPageRoutingModule {}
