import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {PointagesPage} from "./pointages.page";

const routes: Routes = [
  {
    path: "",
    component: PointagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointagesPageRoutingModule {}
