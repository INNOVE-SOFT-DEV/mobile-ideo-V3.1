import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ChatInterface} from "src/app/interfaces/chat/chat-interface";
import {environment} from "src/environments/environment";

@Injectable({providedIn: "root"})
export class ChatRepository implements ChatInterface {
  constructor(private httpClient: HttpClient) {}
  voice(data: FormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.urlAPI}chat/voice`, data);
  }

  images(data: FormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.urlAPI}chat/images`, data);
  }

  file(data: FormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.urlAPI}chat/file`, data);
  }

  room(sender_id: number, recipient_id: number): Observable<any> {
    return this.httpClient.get<any>(`${environment.urlAPI}chat/room/${sender_id}/${recipient_id}`);
  }

  getUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${environment.urlAPI}/chat/users`);
  }

  loadMoreMessages(room_id: number, last_message_id: any): Observable<any> {
    return this.httpClient.get<any>(`${environment.urlAPI}chat/load_more_messages/${room_id}/${last_message_id}`);
  }

  setReadsAt(formData: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.urlAPI}chat/set_reads_at`, formData);
  }

  checkReadsAt(data: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.urlAPI}chat/check_reads_at`, data);
  }

  updateReadsAt(data: any): Observable<any> {
    return this.httpClient.patch<any>(`${environment.urlAPI}chat/update_reads_at`, {ids: data, reads_at: new Date().toISOString()});
  }
}
