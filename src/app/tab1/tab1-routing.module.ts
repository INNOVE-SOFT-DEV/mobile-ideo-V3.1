import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {Tab1Page} from "./tab1.page";
import {DetailsPage} from "../pages/plannings/details/details.page";
const routes: Routes = [
  {
    path: "",
    component: Tab1Page
  },
  {
    path: "details",
    component: DetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
