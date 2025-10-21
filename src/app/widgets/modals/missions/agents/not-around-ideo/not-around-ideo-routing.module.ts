import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {NotAroundIdeoPage} from "./not-around-ideo.page";

const routes: Routes = [
  {
    path: "",
    component: NotAroundIdeoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotAroundIdeoPageRoutingModule {}
