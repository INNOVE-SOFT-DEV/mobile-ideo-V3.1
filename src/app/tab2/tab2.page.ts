import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {AuthService} from "./../pages/login/service/auth.service";
import {User} from "../models/auth/user";
import {Router} from "@angular/router";
import {ChatService} from "./chatService/chat.service";
import {debounceTime} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
  standalone: false
})
export class Tab2Page implements OnInit {
  user: User | null = this.authService.getCurrentUser();
  isSuperVisor: boolean = false;
  searchControl = new FormControl();
  @ViewChild("search_input", {static: false}) search_input!: ElementRef;

  users: any[] = [];
  usersCached: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatService.users$.subscribe(users => {
      this.users = [...users];
      this.usersCached = [...users];
    });

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value: string) => {
      if (!value || value.trim() === "") {
        this.users = [...this.usersCached];
      } else {
        const search = value.toLowerCase();
        this.users = this.usersCached.filter(user => user.first_name.toLowerCase().includes(search) || user.last_name.toLowerCase().includes(search));
      }
    });
  }

  openChatRoom(user: any) {
    this.router.navigate(["/chat-room", {data: JSON.stringify(user), reads_ids: JSON.stringify(user.reads_ids)}]);
  }

  goToProfile() {
    this.router.navigate(["update"]);
  }

  trackByConversation(index: number, convo: any) {
    return convo.id;
  }
}
