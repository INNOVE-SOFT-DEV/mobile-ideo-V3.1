import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {MakeRequestPageRoutingModule} from "./make-request-routing.module";
import {MakeRequestPage} from "./make-request.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MakeRequestPageRoutingModule, TranslateModule],
  declarations: [MakeRequestPage],
  exports: [MakeRequestPage]
})
export class MakeRequestPageModule {}
