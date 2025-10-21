import {Component, Input, OnInit} from "@angular/core";
import {IonicModule, ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";

interface Prestation {
  id: number;
  name: string;
}

@Component({
  selector: "app-photo-report-modal",
  templateUrl: "./photo-report-modal.component.html",
  styleUrls: ["./photo-report-modal.component.scss"],
  imports: [IonicModule, ReactiveFormsModule, CommonModule]
})
export class PhotoReportModalComponent implements OnInit {
  @Input() option: string = "";
  @Input() prestations: Prestation[] = [];
  @Input() data: any;

  reportForm!: FormGroup;
  showAlert = false;
  alertMessages: string[] = [];
  isLoading = false;
  loadingMessage = "Chargement...";

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.reportForm = this.formBuilder.group({
      planning_type: [this.data.planning_type, Validators.required],
      type_report: ["prestation", Validators.required],
      include_photo_camion: [false],
      include_photo_constat: [false],
      include_dates: [false],
      template: ["1x1", Validators.required],
      report: ["ideo", Validators.required],
      dates: [this.data.planning_type == "regular" ? this.data.intervention_days : this.data.date, Validators.required],
      prestations_id: [this.data.prestation_id.toString(), Validators.required],
      intervention_id: [this.data.intervention_id, Validators.required],
      invoice_number: [""],
      message: [""],
      id: [this.data.planning_id]
    });
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
  }

  onPhotoTypeChange(event: any) {
    this.reportForm.patchValue({type_report: event.detail.value});
  }

  IncludesPhotosTruckChange(event: any) {
    this.reportForm.patchValue({include_photo_camion: event.detail.checked});
  }

  IncludesPhotosConstatChange(event: any) {
    this.reportForm.patchValue({include_photo_constat: event.detail.checked});
  }

  IncludesDatesChange(event: any) {
    this.reportForm.patchValue({include_dates: event.detail.checked});
  }

  onTemplateChange(event: any) {
    this.reportForm.patchValue({template: event.detail.value});
  }

  onReportTypeChange(event: any) {
    this.reportForm.patchValue({report: event.detail.value});
  }

  validateForm(): boolean {
    this.alertMessages = [];

    if (!this.reportForm.get("dates")?.value) {
      this.alertMessages.push("Les dates sont obligatoires");
    }

    this.showAlert = this.alertMessages.length > 0;
    return this.alertMessages.length === 0;
  }

  async generatePublicReport() {
    if (!this.validateForm()) return;

    this.isLoading = true;

    try {
      const formData = {
        ...this.reportForm.value
      };

      await this.loadingService.present(this.loadingMessage);

      this.missionService.generatePhotosReport(formData).subscribe(async (res: any) => {
        this.modalController.dismiss({
          action: "generatePublic",
          data: res,
          option: this.option
        });
        await this.loadingService.dimiss();
      });
    } catch (error) {
      this.alertMessages = ["Erreur lors de la génération du rapport public"];
      this.showAlert = true;
    } finally {
      this.isLoading = false;
    }
  }

  dismissModal() {
    this.modalController.dismiss({
      action: "cancel"
    });
  }

  dismissAlert() {
    this.showAlert = false;
    this.alertMessages = [];
  }
}
