import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MaterialsAgentPageRoutingModule} from "./materials-agent-routing.module";
import {MaterialsAgentPage} from "./materials-agent.page";
import {TranslateModule} from "@ngx-translate/core";
import {GlideComponent} from "../../glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MaterialsAgentPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [MaterialsAgentPage],
  exports: [MaterialsAgentPage]
})
export class MaterialsAgentPageModule {}
