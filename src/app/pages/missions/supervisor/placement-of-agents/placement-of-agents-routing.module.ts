import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {PlacementOfAgentsPage} from "./placement-of-agents.page";

const routes: Routes = [
  {
    path: "",
    component: PlacementOfAgentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementOfAgentsPageRoutingModule {}
