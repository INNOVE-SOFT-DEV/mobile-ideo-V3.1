import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {SendReportPage} from "./send-report.page";

const routes: Routes = [
  {
    path: "",
    component: SendReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendReportPageRoutingModule {}
