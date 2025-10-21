import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {SupervisorPlanningsPage} from "./supervisor-plannings.page";

const routes: Routes = [
  {
    path: "",
    component: SupervisorPlanningsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorPlanningsPageRoutingModule {}
