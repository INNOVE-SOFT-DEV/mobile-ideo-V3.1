import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {PlacementOfAgentsAffectPage} from "./placement-of-agents-affect.page";

const routes: Routes = [
  {
    path: "",
    component: PlacementOfAgentsAffectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementOfAgentsAffectPageRoutingModule {}
