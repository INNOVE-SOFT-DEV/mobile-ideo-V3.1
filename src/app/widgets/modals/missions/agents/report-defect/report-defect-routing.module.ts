import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ReportDefectPage} from "./report-defect.page";

const routes: Routes = [
  {
    path: "",
    component: ReportDefectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportDefectPageRoutingModule {}
