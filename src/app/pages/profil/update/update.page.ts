import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {AuthService} from "../../login/service/auth.service";
import {User} from "src/app/models/auth/user";
import {ModalController} from "@ionic/angular";
import {UpdateProfilePage} from "src/app/widgets/modals/update-profile/update-profile.page";
import {Router} from "@angular/router";

@Component({
  selector: "app-update",
  templateUrl: "./update.page.html",
  styleUrls: ["./update.page.scss"],
  standalone: false
})
export class UpdatePage implements OnInit {
  user: User | null = this.authService.getCurrentUser();
  constructor(
    private location: Location,
    private authService: AuthService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}
  goBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    this.user = this.authService.getCurrentUser();
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: UpdateProfilePage,
      cssClass: "update-profile-modal",
      animated: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then(result => {
      this.user = result.data;
    });
    return await modal.present();
  }

  goDocuments() {
    this.router.navigate(["documents"]);
  }

  goVehicles() {
    this.router.navigate(["vehicles"]);
  }

  logout() {
    this.authService.logout();
    this.location.back();
  }
}
