import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {MakeRequestPage} from "./make-request.page";

const routes: Routes = [
  {
    path: "",
    component: MakeRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MakeRequestPageRoutingModule {}
