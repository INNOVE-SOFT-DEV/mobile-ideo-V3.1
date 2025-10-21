import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {MissionReturnsPage} from "./mission-returns.page";

const routes: Routes = [
  {
    path: "",
    component: MissionReturnsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionReturnsPageRoutingModule {}
