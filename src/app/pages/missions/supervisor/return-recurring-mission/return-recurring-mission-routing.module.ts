import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ReturnRecurringMissionPage} from "./return-recurring-mission.page";

const routes: Routes = [
  {
    path: "",
    component: ReturnRecurringMissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnRecurringMissionPageRoutingModule {}
