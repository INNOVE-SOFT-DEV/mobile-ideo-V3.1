import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, Subscription, switchMap, takeUntil} from "rxjs";
import {TicketService} from "src/app/pages/tickets/ticket.service";
@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.page.html",
  styleUrls: ["./task-list.page.scss"],
  standalone: false
})
export class TaskListPage implements OnInit, OnDestroy {
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private taskmanagerService: TicketService
  ) {}
  tasks: any = [];
  data: any[] = [];
  boards: any = [];
  kanban: any = "superviseur mobile";
  task: any;
  task_from_bord: boolean = false;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.taskmanagerService.getAllTasksByKanban("superviseur mobile").subscribe((res: any) => {
      this.boards = res.kanban.boards;
      this.kanban = res.kanban;
      this.data = res.kanban.boards.flatMap((board: any) => board.tasks);
      this.tasks = res.kanban.boards.flatMap((board: any) => board.tasks).filter((task: any) => task.is_archived === false);
    });
    this.taskmanagerService.refresh_event
      .pipe(
        switchMap(() => this.taskmanagerService.getAllTasksByKanban(this.kanban.name)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          this.boards = res.kanban.boards;
          this.data = res.kanban.boards.flatMap((board: any) => board.tasks);
          this.tasks = res.kanban.boards.flatMap((board: any) => board.tasks).filter((task: any) => task.is_archived === false);
        },
        error: err => console.error(err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  archiveList() {
    this.router.navigate(["/archive-list", {data: JSON.stringify(this.data)}]);
  }
  addTicket(task: any) {
    this.router.navigate(["/add-ticket", {update: true, task: JSON.stringify(task)}]);
  }
  goBack() {
    this.taskmanagerService.refresh_kanbans.emit();
    this.location.back();
  }

  createNewTicket() {
    this.router.navigate(["/add-ticket", {update: false, task_from_bord: true, boards: JSON.stringify(this.boards), kanban: JSON.stringify(this.kanban)}]);
  }
}
