import {Observable} from "rxjs";

export interface TicketInterface {
  getTables(): Observable<any>;
  createTable(data: any): Observable<any>;
  creatTask(data: any): Observable<any>;
  updateTask(data: any, id: any): Observable<any>;
  getAllTasksByKanban(id: any , email: any): Observable<any>;
  deleteTask(id: any): Observable<any>;
  archiveTask(data: any): Observable<any>;
  deletePhoto(id: any, name: any, ex: any): Observable<any>;
  addPhoto(data: any): Observable<any>;
}
