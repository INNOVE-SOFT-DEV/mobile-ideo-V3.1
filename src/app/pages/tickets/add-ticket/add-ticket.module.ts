import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {AddTicketPageRoutingModule} from "./add-ticket-routing.module";
import {AddTicketPage} from "./add-ticket.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AddTicketPageRoutingModule, TranslateModule],
  declarations: [AddTicketPage]
})
export class AddTicketPageModule {}
