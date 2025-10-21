import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {MissionReturnsSupervisorPage} from "./mission-returns-supervisor.page";

const routes: Routes = [
  {
    path: "",
    component: MissionReturnsSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionReturnsSupervisorPageRoutingModule {}
