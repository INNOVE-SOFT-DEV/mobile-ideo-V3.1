import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {AgentAbsencePage} from "./agent-absence.page";

const routes: Routes = [
  {
    path: "",
    component: AgentAbsencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentAbsencePageRoutingModule {}
