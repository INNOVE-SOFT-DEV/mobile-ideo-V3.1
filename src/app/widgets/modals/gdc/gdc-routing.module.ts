import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {GdcPage} from "./gdc.page";

const routes: Routes = [
  {
    path: "",
    component: GdcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GdcPageRoutingModule {}
