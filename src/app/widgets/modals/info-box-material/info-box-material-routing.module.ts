import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {InfoBoxMaterialPage} from "./info-box-material.page";

const routes: Routes = [
  {
    path: "",
    component: InfoBoxMaterialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoBoxMaterialPageRoutingModule {}
