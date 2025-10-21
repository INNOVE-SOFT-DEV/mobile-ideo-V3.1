import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ArchiveListPage} from "./archive-list.page";

const routes: Routes = [
  {
    path: "",
    component: ArchiveListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveListPageRoutingModule {}
