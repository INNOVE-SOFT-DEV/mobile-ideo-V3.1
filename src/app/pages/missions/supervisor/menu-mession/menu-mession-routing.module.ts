import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {MenuMessionPage} from "./menu-mession.page";

const routes: Routes = [
  {
    path: "",
    component: MenuMessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuMessionPageRoutingModule {}
