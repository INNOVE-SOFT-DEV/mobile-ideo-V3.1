import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {PhotoReportPage} from "./photo-report.page";

const routes: Routes = [
  {
    path: "",
    component: PhotoReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotoReportPageRoutingModule {}
