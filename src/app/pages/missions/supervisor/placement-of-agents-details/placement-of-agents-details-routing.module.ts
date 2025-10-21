import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {PlacementOfAgentsDetailsPage} from "./placement-of-agents-details.page";

const routes: Routes = [
  {
    path: "",
    component: PlacementOfAgentsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementOfAgentsDetailsPageRoutingModule {}
