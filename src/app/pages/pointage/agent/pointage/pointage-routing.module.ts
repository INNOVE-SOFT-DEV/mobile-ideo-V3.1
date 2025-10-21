import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {PointagePage} from "./pointage.page";

const routes: Routes = [
  {
    path: "",
    component: PointagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointagePageRoutingModule {}
