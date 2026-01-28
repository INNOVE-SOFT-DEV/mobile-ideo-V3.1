import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { AuthService } from "../../login/service/auth.service";
import { User } from "src/app/models/auth/user";
import { ModalController } from "@ionic/angular";
import { UpdateProfilePage } from "src/app/widgets/modals/update-profile/update-profile.page";
import { Router } from "@angular/router";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
  keyframes
} from "@angular/animations";

@Component({
  selector: "app-update",
  templateUrl: "./update.page.html",
  styleUrls: ["./update.page.scss"],
  standalone: false,
  animations: [
    // Header slide in from top with fade
    trigger("headerAnim", [
      transition(":enter", [
        style({ transform: "translateY(-100px)", opacity: 0 }),
        animate(
          "500ms ease-out",
          style({ transform: "translateY(0)", opacity: 1 })
        )
      ])
    ]),

    // Avatar entrance with rotation and spring effect
    trigger("avatarAnim", [
      transition(":enter", [
        style({ transform: "scale(0) rotate(-180deg)", opacity: 0 }),
        animate(
          "600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          style({ transform: "scale(1) rotate(0deg)", opacity: 1 })
        )
      ])
    ]),

    // Greeting text fade in
    trigger("greetingAnim", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate(
          "400ms 200ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        )
      ])
    ]),

    // Buttons fade in and scale
    trigger("buttonAnim", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.8)" }),
        animate(
          "400ms 300ms ease-out",
          style({ opacity: 1, transform: "scale(1)" })
        )
      ])
    ]),

    // Cards entrance with stagger and 3D effect
    trigger("cardsAnim", [
      transition(":enter", [
        query(
          "ion-card",
          [
            style({
              opacity: 0,
              transform: "translateX(-50px) rotateY(-15deg)"
            }),
            stagger(150, [
              animate(
                "500ms ease-out",
                style({ opacity: 1, transform: "translateX(0) rotateY(0deg)" })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ]),

    // Profile section fade in
    trigger("profileTitleAnim", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("400ms 600ms ease-out", style({ opacity: 1 }))
      ])
    ]),

    // Profile card slide up
    trigger("profileCardAnim", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(50px)" }),
        animate(
          "500ms 700ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        )
      ])
    ]),

    // Profile items stagger
    trigger("profileItemsAnim", [
      transition(":enter", [
        query(
          "ion-item",
          [
            style({ opacity: 0, transform: "translateX(-20px)" }),
            stagger(100, [
              animate(
                "400ms ease-out",
                style({ opacity: 1, transform: "translateX(0)" })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ]),

    // Update button entrance
    trigger("updateButtonAnim", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.8)" }),
        animate(
          "400ms 800ms ease-out",
          style({ opacity: 1, transform: "scale(1)" })
        )
      ])
    ])
  ]
})
export class UpdatePage implements OnInit {
  user: User | null = this.authService.getCurrentUser();
  notificationCount = 3;

  constructor(
    private location: Location,
    private authService: AuthService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.user = this.authService.getCurrentUser();
  }

  goBack() {
    this.location.back();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: UpdateProfilePage,
      cssClass: "update-profile-modal",
      animated: true,
      showBackdrop: true,
      backdropDismiss: true
    });
    
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.user = result.data;
      }
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