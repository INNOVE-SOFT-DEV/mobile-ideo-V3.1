import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {RegularPerAgentPage} from "./regular-per-agent.page";

const routes: Routes = [
  {
    path: "",
    component: RegularPerAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegularPerAgentPageRoutingModule {}
