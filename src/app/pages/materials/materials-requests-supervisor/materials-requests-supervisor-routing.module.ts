import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {MaterialsRequestsSupervisorPage} from "./materials-requests-supervisor.page";

const routes: Routes = [
  {
    path: "",
    component: MaterialsRequestsSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialsRequestsSupervisorPageRoutingModule {}
