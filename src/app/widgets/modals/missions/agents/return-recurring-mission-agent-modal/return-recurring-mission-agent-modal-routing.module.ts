import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ReturnRecurringMissionAgentModalPage} from "./return-recurring-mission-agent-modal.page";

const routes: Routes = [
  {
    path: "",
    component: ReturnRecurringMissionAgentModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnRecurringMissionAgentModalPageRoutingModule {}
