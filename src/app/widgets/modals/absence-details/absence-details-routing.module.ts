import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {AbsenceDetailsPage} from "./absence-details.page";

const routes: Routes = [
  {
    path: "",
    component: AbsenceDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbsenceDetailsPageRoutingModule {}
