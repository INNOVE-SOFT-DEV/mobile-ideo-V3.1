import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, Subscription, switchMap, takeUntil} from "rxjs";
import {TicketService} from "src/app/pages/tickets/ticket.service";
import {AuthService} from "../../login/service/auth.service";
import {AfterViewInit, ElementRef} from "@angular/core";

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
    private taskmanagerService: TicketService,
    private authService: AuthService,
    private el: ElementRef
  ) {}
  tasks: any = [];
  data: any[] = [];
  boards: any = [];
  kanban: any = "superviseur mobile";
  task: any;
  task_from_bord: boolean = false;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    const email = this.authService.getCurrentUser()?.email;
    this.taskmanagerService.getAllTasksByKanban("superviseur mobile", email).subscribe((res: any) => {
      this.boards = res.kanban.boards;
      this.kanban = res.kanban;
      this.data = res.kanban.boards.flatMap((board: any) => board.tasks);
      this.tasks = res.kanban.boards.flatMap((board: any) => board.tasks).filter((task: any) => task.is_archived === false);
    });
    this.taskmanagerService.refresh_event
      .pipe(
        switchMap(() => {
          const email = this.authService.getCurrentUser()?.email;
          return this.taskmanagerService.getAllTasksByKanban(this.kanban.name, email);
        }),
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

  ngAfterViewInit() {
    setTimeout(() => {
      const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".custom-block"));

      blocks.forEach((block, index) => {
        setTimeout(() => {
          block.classList.add("animate__animated", "animate__fadeInUp");
          block.style.opacity = "1";
          block.style.transform = "translateY(0)";
          block.style.animationDuration = "500ms";
        }, index * 100);
      });
    }, 200);
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
