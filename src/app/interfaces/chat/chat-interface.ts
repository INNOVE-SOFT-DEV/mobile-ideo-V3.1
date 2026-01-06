import {Observable} from "rxjs";

export interface ChatInterface {
  getUsers(): Observable<any[]>;
  room(sender_id: number, recipient_id: number): Observable<any>;
  attachments(data: FormData): Observable<any>;
  loadMoreMessages(room_id: any, last_message_id: any): Observable<any>;
  checkReadsAt(data: any): Observable<any>;
  updateReadsAt(data: any): Observable<any>;
}
