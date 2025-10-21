import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {MaterialsAgentPage} from "./materials-agent.page";

const routes: Routes = [
  {
    path: "",
    component: MaterialsAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialsAgentPageRoutingModule {}
