import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ReportsPhotosPage} from "./reports-photos.page";

const routes: Routes = [
  {
    path: "",
    component: ReportsPhotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsPhotosPageRoutingModule {}
