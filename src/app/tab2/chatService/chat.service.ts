import {EventEmitter, Injectable} from "@angular/core";
import {Observable, BehaviorSubject, filter} from "rxjs";
import {ChatInterface} from "src/app/interfaces/chat/chat-interface";
import {environment} from "src/environments/environment";
import * as ActionCable from "actioncable";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {ChatRepository} from "src/app/repositories/chat/chat-repository";
import {Router} from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ChatService implements ChatInterface {
  cable: any;
  channel: any;
  current_user = this.authService.getCurrentUser();
  updateStatus = new EventEmitter<any>();
  newMessage = new EventEmitter<any>();
  updateReads = new EventEmitter<any>();
  currentUserReadsSubject = new BehaviorSubject<number>(0);
  currentUserReads$ = this.currentUserReadsSubject.asObservable();

  usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();
  private lastOnlineIds: string[] = [];

  constructor(
    private authService: AuthService,
    private chatRepository: ChatRepository,
    private router: Router
  ) {
    this.current_user = this.authService.getCurrentUser();
    this.cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    this.channel = this.cable.subscriptions.create(
      {channel: "ChatChannel", userId: this.current_user?.id},
      {
        received: (data: any) => {
          if (data.message) {
            this.newMessage.emit(data.message);
            const formData = new FormData();
            formData.append("message_id", data.message.id.toString());
            formData.append("room_id", data.message.room_id.toString());
            formData.append("sender_id", data.message.sender_id.toString());
            this.checkReadsAt(formData).subscribe();
            this.loadUsers();
            const users = [...this.usersSubject.value];
            const index = users.findIndex(u => u.room_id === data.message.room_id);
            if (index > -1) {
              const [user] = users.splice(index, 1);
              user?.reads_count ? (user.reads_count += 1) : null;
              user?.reads_ids?.push(data.message.id);
              users.unshift(user);
            }
            this.usersSubject.next(users);
          }
          if (data.online_user_ids) {
            this.lastOnlineIds = data.online_user_ids;
            this.updateOnlineStatuses();
            this.updateStatus.emit(data.online_user_ids);
          }
          if (data?.type == "ping_user") {
            const currentUrl = this.router.url;
            const dataParam = currentUrl.split(";").find(part => part.startsWith("data="));
            let body: any = {
              message_id: data.message_id,
              user_id: data.recipient_id,
              room_id: data.room_id
            };

            if (dataParam) {
              const encoded = dataParam.replace("data=", "");
              const decoded = decodeURIComponent(encoded);
              const dataObject = JSON.parse(decoded);
              if (dataObject.room_id == data.room_id) {
                body.reads_at = new Date().toISOString();
              }
            }

            this.channel.perform("ping_response", body);
          }
        },
        connected: () => {},
        disconnected: () => {}
      }
    );

    this.loadUsers();
  }

  attachments(data: FormData): Observable<any> {
    return this.chatRepository.attachments(data);
  }

  room(sender_id: number, recipient_id: number): Observable<any> {
    return this.chatRepository.room(sender_id, recipient_id);
  }

  getUsers(): Observable<any[]> {
    return this.chatRepository.getUsers();
  }

  loadUsers(): void {
    this.getUsers().subscribe(users => {
      const updated = users.map(u => ({
        ...u,
        online: this.lastOnlineIds.includes(u.id.toString())
      }));
      this.usersSubject.next(updated);
    });
  }

  updateOnlineStatuses(): void {
    const updatedUsers = this.usersSubject.value.map(user => ({
      ...user,
      online: this.lastOnlineIds.includes(user.id.toString())
    }));
    this.usersSubject.next(updatedUsers);
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const createdDate = new Date(dateString);
    const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    const intervals = [
      {label: "année", seconds: 31536000},
      {label: "mois", seconds: 2592000},
      {label: "jour", seconds: 86400},
      {label: "heure", seconds: 3600},
      {label: "minute", seconds: 60},
      {label: "seconde", seconds: 1}
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        if (interval.label === "mois") {
          return count === 1 ? `il y a 1 ${interval.label} ` : `il y a ${count} ${interval.label}`;
        } else {
          return count === 1 ? `il y a 1 ${interval.label}` : `il y a ${count} ${interval.label}s`;
        }
      }
    }

    return "à l'instant";
  }

  loadMoreMessages(room_id: any, last_message_id: any): Observable<any> {
    return this.chatRepository.loadMoreMessages(room_id, last_message_id);
  }

  checkReadsAt(data: any): Observable<any> {
    return this.chatRepository.checkReadsAt(data);
  }

  updateReadsAt(data: any): Observable<any> {
    return this.chatRepository.updateReadsAt(data);
  }
}
