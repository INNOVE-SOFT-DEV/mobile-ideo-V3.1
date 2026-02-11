import {Component, ElementRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "src/app/pages/login/service/auth.service";
import {User} from "src/app/models/auth/user";
import {DocumentsModalPage} from "src/app/widgets/modals/documents-modal/documents-modal.page";
import {ModalController} from "@ionic/angular";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {Share} from "@capacitor/share";

@Component({
  selector: "app-visit-user-documents",
  templateUrl: "./visit-user-documents.page.html",
  styleUrls: ["./visit-user-documents.page.scss"],
  standalone: false
})
export class VisitUserDocumentsPage implements OnInit {
  user: User | null = null;
  loadingMessage: string = "";
  btp: any;
  rib: any;
  driving_license: any;
  cin: any;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private authServie: AuthService,
    private modalController: ModalController,
    private loadingCtrl: LoadingControllerService,
    private translateService: TranslateService,
    private el: ElementRef
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.route.paramMap.subscribe(params => {
      this.authServie.getUserById(params.get("id")).subscribe({
        next: async value => {
          this.user = value;
          await this.loadingCtrl.dimiss();
        },
        error: async err => {
          console.error(err);
          await this.loadingCtrl.dimiss();
        }
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const blocks: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll(".anumation-block"));

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

  async displayDocument(url: string, type: string) {
    const modal = await this.modalController.create({
      component: DocumentsModalPage,
      cssClass: "update-profile-modal",
      animated: true,
      showBackdrop: true,
      componentProps: {url, type}
    });
    return await modal.present();
  }

  async share() {
    if (this.rib == true || this.driving_license == true || this.btp == true || this.cin == true) {
      this.shareBy();
    }
  }

  async shareBy() {
    var urlsToShare: string = "Consultez ces liens :\n";
    if (this.cin == true) {
      urlsToShare = urlsToShare + "\nCin : " + this.user?.cin.url;
    }
    if (this.btp == true) {
      urlsToShare = urlsToShare + "\nBTP : " + this.user?.btp.url;
    }
    if (this.rib == true) {
      urlsToShare = urlsToShare + "\nRib : " + this.user?.rib.url;
    }
    if (this.driving_license == true) {
      urlsToShare = urlsToShare + "\nPermis de conduire : " + this.user?.driving_license.url;
    }
    await Share.share({
      title: "Documents de l'agent",
      text: urlsToShare,
      dialogTitle: "Partager Via :"
    });
  }

  goBack() {
    this.location.back();
  }
}
