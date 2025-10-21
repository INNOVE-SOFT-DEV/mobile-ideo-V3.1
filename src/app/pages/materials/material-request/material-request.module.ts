import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MaterialRequestPageRoutingModule} from "./material-request-routing.module";
import {MaterialRequestPage} from "./material-request.page";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MaterialRequestPageRoutingModule, TranslateModule],
  declarations: [MaterialRequestPage]
})
export class MaterialRequestPageModule {}
