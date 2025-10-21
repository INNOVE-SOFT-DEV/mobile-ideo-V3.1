import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {DocumentsModalPageRoutingModule} from "./documents-modal-routing.module";
import {TranslateModule} from "@ngx-translate/core";

import {DocumentsModalPage} from "./documents-modal.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DocumentsModalPageRoutingModule, TranslateModule],
  declarations: [DocumentsModalPage],
  exports: [DocumentsModalPage]
})
export class DocumentsModalPageModule {}
