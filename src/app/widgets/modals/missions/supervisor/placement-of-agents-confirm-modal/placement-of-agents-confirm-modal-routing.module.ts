import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {PlacementOfAgentsConfirmModalPage} from "./placement-of-agents-confirm-modal.page";

const routes: Routes = [
  {
    path: "",
    component: PlacementOfAgentsConfirmModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacementOfAgentsConfirmModalPageRoutingModule {}
