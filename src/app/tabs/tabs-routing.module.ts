import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TabsPage} from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        loadChildren: () => import("../tab1/tab1.module").then(m => m.Tab1PageModule)
      },
      {
        path: "tab2",
        loadChildren: () => import("../tab2/tab2.module").then(m => m.Tab2PageModule)
      },
      {
        path: "tab3",
        loadChildren: () => import("../tab3/tab3.module").then(m => m.Tab3PageModule)
      },
      {
        path: "materials",
        loadChildren: () => import("../materials/materials.module").then(m => m.MaterialsPageModule)
      },
      {
        path: "",
        redirectTo: "/tabs/tab1",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class TabsPageRoutingModule {}
