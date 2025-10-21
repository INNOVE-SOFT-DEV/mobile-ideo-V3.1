import {IonicModule} from "@ionic/angular";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Tab1Page} from "./tab1.page";
import {ExploreContainerComponentModule} from "../explore-container/explore-container.module";
import {Tab1PageRoutingModule} from "./tab1-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {PunctualComponent} from "../widgets/intervention/punctual/punctual.component";
import {RegularComponent} from "../widgets/intervention/regular/regular.component";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ForfaitaireComponent} from "../widgets/intervention/forfaitaire/forfaitaire.component";
import {MainComponent} from "../widgets/supervisor/main/main.component";
import {ComponentsModule} from "../widgets/intervention/punctual/punctual.module";
import {CapitalizeFirstLetterPipe} from "../pipes/capitalize-first-letter.pipe";
@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, ExploreContainerComponentModule, Tab1PageRoutingModule, ComponentsModule, CapitalizeFirstLetterPipe],
  declarations: [Tab1Page, RegularComponent, ForfaitaireComponent, MainComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1PageModule {}
