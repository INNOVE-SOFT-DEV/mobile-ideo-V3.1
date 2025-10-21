import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

import {Location} from "@angular/common";
import {AbsenceService} from "src/app/tab3/service/absence/absence.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
@Component({
  selector: "app-absence-supervisor",
  templateUrl: "./absence-supervisor.page.html",
  styleUrls: ["./absence-supervisor.page.scss"],
  standalone: false
})
export class AbsenceSupervisorPage implements OnInit {
  count: number = 0;
  myCount: number = 0;
  sub: any;

  loadingMessage: string = "";
  constructor(
    private translateService: TranslateService,
    private location: Location,
    private absencesService: AbsenceService,
    private loadingCtrl: LoadingControllerService,
    private router: Router
  ) {}
  async ngOnInit() {
    this.sub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {
      if (this.router.url == "/tabs/tab3") {
        this.loadingMessage = await this.translateService.get("Loading").toPromise();
        await this.loadingCtrl.present(this.loadingMessage);

        this.absencesService.getPendingAbsencesCount().subscribe({
          next: async value => {
            this.count = value.count;
            await this.loadingCtrl.dimiss();
          },
          error: async err => {
            console.error(err);
            await this.loadingCtrl.dimiss();
          }
        });
        this.absencesService.getAbsencesFromapi().subscribe({
          next: async data => {
            this.myCount = data.pending.length;
            await this.loadingCtrl.dimiss();
          },
          error: async error => {
            console.error(error);
            await this.loadingCtrl.dimiss();
          }
        });
      }
    });
  }

  IonViewWillLeave() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  goToAbsenceRequest() {
    this.router.navigate(["absence-request"]);
  }
  goAbsenceRequestAgent() {
    this.router.navigate(["agent-absence"]);
  }

  goTorequestProcessed() {
    this.router.navigate(["request-processed"]);
  }
  goBack() {
    this.location.back();
  }

  goProfile() {
    this.router.navigate(["update"]);
  }
}
