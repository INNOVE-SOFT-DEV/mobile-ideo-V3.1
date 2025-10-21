import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MaterialRequestPageRoutingModule} from "./material-request-routing.module";
import {MaterialRequestPage} from "./material-request.page";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MaterialRequestPageRoutingModule, TranslateModule, ReactiveFormsModule],
  declarations: [MaterialRequestPage],
  exports: [MaterialRequestPage]
})
export class MaterialRequestPageModule {}
