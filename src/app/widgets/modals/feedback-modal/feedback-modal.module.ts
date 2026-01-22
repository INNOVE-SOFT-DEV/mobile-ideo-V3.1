import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

import {IonicModule} from "@ionic/angular";

import {FeedbackModalPageRoutingModule} from "./feedback-modal-routing.module";

import {FeedbackModalPage} from "./feedback-modal.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, FeedbackModalPageRoutingModule, TranslateModule],
  declarations: [FeedbackModalPage]
})
export class FeedbackModalPageModule {}
