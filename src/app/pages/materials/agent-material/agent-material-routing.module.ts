import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {AgentMaterialPage} from "./agent-material.page";

const routes: Routes = [
  {
    path: "",
    component: AgentMaterialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentMaterialPageRoutingModule {}
