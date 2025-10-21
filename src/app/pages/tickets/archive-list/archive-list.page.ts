import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {TicketService} from "src/app/pages/tickets/ticket.service";
import {ActivatedRoute} from "@angular/router";
@Component({
  selector: "app-archive-list",
  templateUrl: "./archive-list.page.html",
  styleUrls: ["./archive-list.page.scss"],
  standalone: false
})
export class ArchiveListPage implements OnInit {
  data: any;
  tasks: any[] = [];
  constructor(
    private location: Location,
    private taskmanagerService: TicketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.data = JSON.parse(params["data"]);
      this.tasks = this.data.filter((task: any) => task.is_archived === true);
    });
  }

  goBack() {
    this.taskmanagerService.refresh_event.emit();
    this.location.back();
  }

  deleteTicket(task: any) {
    this.taskmanagerService.deleteTask(task.id).subscribe(res => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    });
  }

  restoreTicket(task: any) {
    const formData = new FormData();
    formData.append("archive", "0");
    formData.append("id", task.id);
    this.taskmanagerService.archiveTask(formData).subscribe(res => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    });
  }
}
