import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmAbsentPageRoutingModule } from './confirm-absent-routing.module';

import { ConfirmAbsentPage } from './confirm-absent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmAbsentPageRoutingModule
  ],
  declarations: [ConfirmAbsentPage]
})
export class ConfirmAbsentPageModule {}
