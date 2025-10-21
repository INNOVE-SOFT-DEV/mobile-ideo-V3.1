import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {DocumentsModalPage} from "./documents-modal.page";

const routes: Routes = [
  {
    path: "",
    component: DocumentsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsModalPageRoutingModule {}
