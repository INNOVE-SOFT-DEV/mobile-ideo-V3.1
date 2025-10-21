import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {AbsenceRequestPage} from "./absence-request.page";

const routes: Routes = [
  {
    path: "",
    component: AbsenceRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbsenceRequestPageRoutingModule {}
