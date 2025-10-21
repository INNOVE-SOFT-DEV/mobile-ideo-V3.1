import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PunctualComponent} from "./punctual.component";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {CapitalizeFirstLetterPipe} from "../../../pipes/capitalize-first-letter.pipe";

@NgModule({
  declarations: [PunctualComponent],
  exports: [PunctualComponent],
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, CapitalizeFirstLetterPipe]
})
export class ComponentsModule {}
