import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmAbsentPage } from './confirm-absent.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmAbsentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmAbsentPageRoutingModule {}
