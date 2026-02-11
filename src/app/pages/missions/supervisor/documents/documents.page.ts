import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {User} from "src/app/models/auth/user";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {AfterViewInit, ElementRef} from "@angular/core";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.page.html",
  styleUrls: ["./documents.page.scss"],
  standalone: false
})
export class DocumentsPage implements OnInit {
  users: User[] = [];
  list_filtered_users: User[] = [];
  loadingMessage: string = "";

  constructor(
    private location: Location,
    private authService: AuthService,
    private route: Router,
    private translateService: TranslateService,
    private loadingCtrl: LoadingControllerService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.getAllAgents();
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
  async getAllAgents() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    await this.loadingCtrl.present(this.loadingMessage);
    this.authService.getAllAgents().subscribe({
      next: async value => {
        this.users = value;
        this.list_filtered_users = value;
        await this.loadingCtrl.dimiss();
      },
      error: async err => {
        console.error(err);
        await this.loadingCtrl.dimiss();
      }
    });
  }

  filterUsers(event: any) {
    const searchTerm: string = event.target.value.trim().toLowerCase();
    if (searchTerm.length > 0) {
      this.list_filtered_users = this.users.filter((user: any) => user.first_name.toLowerCase().includes(searchTerm) || user.last_name.toLowerCase().includes(searchTerm));
    } else {
      this.list_filtered_users = this.users;
    }
  }
  visitDocuments(id: any) {
    this.route.navigate(["/visit-user-documents", {id}]);
  }

  goBack() {
    this.location.back();
  }
}
