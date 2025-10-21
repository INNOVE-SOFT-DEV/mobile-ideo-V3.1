import {Component} from "@angular/core";
import {ChatService} from "../tab2/chatService/chat.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
  standalone: false
})
export class TabsPage {
  reads: number = 0;
  updateReads!: Subscription;
  constructor(private chatService: ChatService) {
    this.chatService.getUsers().subscribe(res => {
      this.chatService.users$.subscribe(users => {
        this.reads = 0;
        users.forEach(u => (this.reads += u.reads_count));
      });
    });
    this.updateReads = this.chatService.updateReads.subscribe(res => {
      this.chatService.getUsers().subscribe(res => {
        this.chatService.usersSubject.next(res);
      });
    });
  }
}
