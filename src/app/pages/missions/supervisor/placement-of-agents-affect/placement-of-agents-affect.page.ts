import {Component, ElementRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ModalController} from "@ionic/angular";
import {PlacementOfAgentsConfirmModalPage} from "src/app/widgets/modals/missions/supervisor/placement-of-agents-confirm-modal/placement-of-agents-confirm-modal.page";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";

@Component({
  selector: "app-placement-of-agents-affect",
  templateUrl: "./placement-of-agents-affect.page.html",
  styleUrls: ["./placement-of-agents-affect.page.scss"],
  standalone: false
})
export class PlacementOfAgentsAffectPage implements OnInit {
  selectedSite: string = "";
  data: any = {};
  agent: any = {};
  tommorrow: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];
  isAlertOpen = false;
  alertButtons = ["Fermer"];
  refreshEvent!: Subscription;

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  constructor(
    private location: Location,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private translationService: TranslateService,
    private missionService: MissionService,
    private toastController: ToastControllerService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.data = JSON.parse(params["data"]) || {};
    });
  }
  async placementOfAgentsConfirmModal() {
    if (!this.selectedSite) {
      console.error("No site selected for placement of agents.");
      await this.toastController.presentToast("Veuillez sélectionner un site pour l'affectation de l'agent.", "warning");

      return;
    }
    const isAlreadyAffected = this.data.plannings.find((planning: any) => planning.id === this.selectedSite).team.some((member: any) => member.id === this.data.agent.user.id);
    if (isAlreadyAffected) {
      this.setOpen(true);
      return;
    } else {
      const modal = await this.modalController.create({
        component: PlacementOfAgentsConfirmModalPage,
        componentProps: {
          data: this.data,
          selectedSite: this.selectedSite
        }
      });
      modal.onDidDismiss().then(data => {
        if (data.data == true) {
          this.data.agent.planning_punctuals++;
          this.data.plannings.find((planning: any) => planning.id === this.selectedSite).team.push(this.data.agent.user);
          this.location.back();
          this.missionService.refreshDispatchAgent.emit(true);
        }
      });
      return await modal.present();
    }
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
  goBack() {
    this.location.back();
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
}
