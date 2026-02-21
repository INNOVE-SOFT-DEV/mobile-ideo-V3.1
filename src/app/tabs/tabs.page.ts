import {Component} from "@angular/core";
import {ChatService} from "../tab2/chatService/chat.service";
import {Subscription} from "rxjs";
import {trigger, transition, style, animate, state, keyframes} from "@angular/animations";
import {IonRouterOutlet} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
  standalone: false,
  animations: [
    // Animation for tab initialization
    trigger("tabLoadAnimation", [
      transition(":enter", [
        style({opacity: 0, transform: "translateY(20px) scale(0.95)"}),
        animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)", style({opacity: 1, transform: "translateY(0) scale(1)"}))
      ])
    ]),
    // Animation for tab button clicks
    trigger("tabClickAnimation", [
      state(
        "normal",
        style({
          transform: "scale(1)"
        })
      ),
      state(
        "clicked",
        style({
          transform: "scale(1.2)"
        })
      ),
      transition("normal => clicked", [animate("150ms ease-out", keyframes([style({transform: "scale(1.2)", offset: 0.5}), style({transform: "scale(1)", offset: 1})]))])
    ])
  ]
})
export class TabsPage {
  reads: number = 0;
  updateReads!: Subscription;
  clickedTab: string = "";

  constructor(
    private chatService: ChatService,
    private outlet: IonRouterOutlet,
    private router: Router
  ) {
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

  animateTab(tab: string) {
    //  this.resetStack()
    this.clickedTab = tab;
    this.router.navigate(
      ["/tabs", tab],
      {replaceUrl: true} // clears navigation history
    );

    setTimeout(() => (this.clickedTab = ""), 200);
  }

  resetStack() {
    this.outlet.pop();
  }
}
