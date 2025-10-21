import {Component, OnInit, OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {TicketService} from "src/app/pages/tickets/ticket.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {Subject, switchMap, takeUntil} from "rxjs";

interface Table {
  id: number;
  name: string;
}
@Component({
  selector: "app-ticket-management",
  templateUrl: "./ticket-management.page.html",
  styleUrls: ["./ticket-management.page.scss"],
  standalone: false
})
export class TicketManagementPage implements OnInit {
  user: any = JSON.parse(localStorage.getItem("user") || "{}");
  tables: Table[] = [];
  searchQuery: string = "";
  filteredTables: Table[] = [];
  private destroy$ = new Subject<void>();
  constructor(
    private location: Location,
    private alertCtrl: AlertController,
    private router: Router,
    private ticketService: TicketService,
    private loadingService: LoadingControllerService,
    private translationService: TranslateService
  ) {}

  async ngOnInit() {
    const message = await this.translationService.get("loading").toPromise();
    this.filteredTables = [...this.tables];
    this.ticketService.getTables().subscribe({
      next: async (res: any) => {
        this.tables = res.kanbans.map((el: any) => {
          return el;
        });
        this.filteredTables = [...this.tables];
        await this.loadingService.dimiss();
      },
      error: async err => {
        console.log(err);
        await this.loadingService.dimiss();
      }
    });

    this.ticketService.refresh_kanbans
      .pipe(
        switchMap(() => this.ticketService.getTables()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          this.tables = res.kanbans;
          this.filteredTables = [...this.tables];
        },
        error: err => console.error(err)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    if (query.trim() === "") {
      this.filteredTables = [...this.tables];
    } else {
      this.filteredTables = this.tables.filter(table => table.name.toLowerCase().includes(query));
    }
  }

  taskList(table: Table) {
    this.router.navigate(["/task-list", {data: JSON.stringify(table), kanban: table.id}]);
  }

  async addTable() {
    const alert = await this.alertCtrl.create({
      header: "Nouveau tableau",
      message: "Veuillez saisir le nom du tableau",
      inputs: [
        {
          name: "tableau",
          type: "text",
          placeholder: "Nom du tableau"
        }
      ],
      buttons: [
        {
          text: "Annuler",
          role: "cancel"
        },
        {
          text: "Ajouter",
          handler: data => {
            this.creatTable(data.tableau);
          }
        }
      ]
    });

    await alert.present();
  }

  creatTable(table: string) {
    this.ticketService
      .createTable({
        name: table,
        admin_user_email: this.user.email
      })
      .subscribe({
        next: res => {
          this.ticketService.getTables().subscribe({
            next: (res: any) => {
              this.tables = res.kanbans.map((el: any) => {
                return el;
              });
              this.filteredTables = [...this.tables];
            },
            error: err => {
              console.log(err);
            }
          });
        },
        error: err => {
          console.log(err);
        }
      });
  }

  goBack() {
    this.location.back();
  }
}
