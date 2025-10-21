import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {ChatRoomPageRoutingModule} from "./chat-room-routing.module";
import {ChatRoomPage} from "./chat-room.page";
import {GlideComponent} from "src/app/widgets/glide/glide.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatRoomPageRoutingModule, TranslateModule, GlideComponent],
  declarations: [ChatRoomPage]
})
export class ChatRoomPageModule {}
