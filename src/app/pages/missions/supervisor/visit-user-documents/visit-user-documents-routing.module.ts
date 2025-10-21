import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {VisitUserDocumentsPage} from "./visit-user-documents.page";

const routes: Routes = [
  {
    path: "",
    component: VisitUserDocumentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitUserDocumentsPageRoutingModule {}
