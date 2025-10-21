import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TicketInterface} from "src/app/interfaces/ticket/ticket-interface";
import {TicketsRepository} from "src/app/repositories/ticket/tickets-repository";

@Injectable({
  providedIn: "root"
})
export class TicketService implements TicketInterface {
  refresh_event = new EventEmitter<any>();
  refresh_kanbans = new EventEmitter<any>();

  constructor(private ticketRepo: TicketsRepository) {}
  deletePhoto(id: any, name: any, ex: any): Observable<any> {
    return this.ticketRepo.deletePhoto(id, name, ex);
  }
  addPhoto(data: any): Observable<any> {
    return this.ticketRepo.addPhoto(data);
  }
  deleteTask(id: any): Observable<any> {
    return this.ticketRepo.deleteTask(id);
  }
  archiveTask(data: any): Observable<any> {
    return this.ticketRepo.archiveTask(data);
  }
  getAllTasksByKanban(id: any): Observable<any> {
    return this.ticketRepo.getAllTasksByKanban(id);
  }
  updateTask(data: any, id: any): Observable<any> {
    return this.ticketRepo.updateTask(data, id);
  }
  creatTask(data: any): Observable<any> {
    return this.ticketRepo.creatTask(data);
  }
  createTable(data: any): Observable<any> {
    return this.ticketRepo.createTable(data);
  }
  getTables(): Observable<any> {
    return this.ticketRepo.getTables();
  }
}
