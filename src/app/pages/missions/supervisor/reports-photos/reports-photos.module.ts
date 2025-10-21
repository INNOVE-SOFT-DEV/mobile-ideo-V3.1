import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {ReportsPhotosPageRoutingModule} from "./reports-photos-routing.module";
import {ReportsPhotosPage} from "./reports-photos.page";
import {GlideComponent} from "../../../../widgets/glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReportsPhotosPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [ReportsPhotosPage]
})
export class ReportsPhotosPageModule {}
