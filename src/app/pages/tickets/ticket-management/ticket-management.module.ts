import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {TicketManagementPageRoutingModule} from "./ticket-management-routing.module";
import {TicketManagementPage} from "./ticket-management.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TicketManagementPageRoutingModule, TranslateModule],
  declarations: [TicketManagementPage]
})
export class TicketManagementPageModule {}
