import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ReturnRecurringMissionAgentPage} from "./return-recurring-mission-agent.page";

const routes: Routes = [
  {
    path: "",
    component: ReturnRecurringMissionAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnRecurringMissionAgentPageRoutingModule {}
