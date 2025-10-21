import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {AgentTrackingPage} from "./agent-tracking.page";

const routes: Routes = [
  {
    path: "",
    component: AgentTrackingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentTrackingPageRoutingModule {}
