import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {RequestProcessedPage} from "./request-processed.page";

const routes: Routes = [
  {
    path: "",
    component: RequestProcessedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestProcessedPageRoutingModule {}
