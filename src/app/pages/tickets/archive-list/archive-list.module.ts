import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {ArchiveListPageRoutingModule} from "./archive-list-routing.module";
import {ArchiveListPage} from "./archive-list.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ArchiveListPageRoutingModule, TranslateModule],
  declarations: [ArchiveListPage]
})
export class ArchiveListPageModule {}
