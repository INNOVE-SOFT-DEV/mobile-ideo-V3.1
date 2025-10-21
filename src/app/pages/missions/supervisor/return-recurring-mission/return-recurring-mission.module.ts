import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {ReturnRecurringMissionPageRoutingModule} from "./return-recurring-mission-routing.module";
import {ReturnRecurringMissionPage} from "./return-recurring-mission.page";
import {GlideComponent} from "src/app/widgets/glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReturnRecurringMissionPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [ReturnRecurringMissionPage]
})
export class ReturnRecurringMissionPageModule {}
