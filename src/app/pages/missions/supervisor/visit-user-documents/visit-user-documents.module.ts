import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {VisitUserDocumentsPageRoutingModule} from "./visit-user-documents-routing.module";
import {VisitUserDocumentsPage} from "./visit-user-documents.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, VisitUserDocumentsPageRoutingModule, TranslateModule],
  declarations: [VisitUserDocumentsPage]
})
export class VisitUserDocumentsPageModule {}
