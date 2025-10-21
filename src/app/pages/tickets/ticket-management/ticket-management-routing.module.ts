import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {TicketManagementPage} from "./ticket-management.page";

const routes: Routes = [
  {
    path: "",
    component: TicketManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketManagementPageRoutingModule {}
