import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TicketInterface} from "src/app/interfaces/ticket/ticket-interface";
import {environment} from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class TicketsRepository implements TicketInterface {
  private apiUrl = `${environment.urlAPI}`;
  constructor(private http: HttpClient) {}

  deletePhoto(id: any, name: any, ex: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}taskmanager/delete_photo/${id}/${name}/${ex}`);
  }
  addPhoto(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}taskmanager/add_photo`, data);
  }
  deleteTask(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}taskmanager/delete_task/${id}`);
  }
  archiveTask(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}taskmanager/archive_task`, data);
  }
  getAllTasksByKanban(id: any, email: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}taskmanager/get_all_tasks_by_kanban/${id}/${email}`);
  }
  updateTask(data: any, id: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}taskmanager/update_task/${id}`, data);
  }
  creatTask(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}taskmanager/create_task`, data);
  }
  createTable(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}taskmanager/create_board`, data);
  }
  getTables(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}taskmanager/get_all_kanbans`);
  }
}
