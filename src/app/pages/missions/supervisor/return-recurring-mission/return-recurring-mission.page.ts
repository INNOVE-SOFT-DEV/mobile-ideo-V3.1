import {Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewChecked} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import WaveSurfer from "wavesurfer.js";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-return-recurring-mission",
  templateUrl: "./return-recurring-mission.page.html",
  styleUrls: ["./return-recurring-mission.page.scss"],
  standalone: false
})
export class ReturnRecurringMissionPage implements OnInit, AfterViewChecked {
  selectedDate: string = new Date().toISOString();
  formattedDate: string = "";
  showPicker = false;
  isNotice: boolean = false;
  options = ["Initiale", "Appartement", "Décharge"];
  selectedOption = "Initiale";
  showDropdown = false;
  returns: any;
  display: any[] = [];
  notes: any[] = [];
  voices: any[] = [];
  waveSurfers: WaveSurfer[] = [];
  loadingMessage: string = "Chargement en cours...";
  @ViewChildren("waveformContainer") waveformContainers!: QueryList<ElementRef>;

  planning: any;
  isSliderOpen: boolean = false;
  initialIndexPhoto: number = 0;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private missionService: MissionService,
    private loadingService: LoadingControllerService,
    private translate: TranslateService,
    private el: ElementRef
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translate.get("Loading").toPromise();

    const data = JSON.parse(this.route.snapshot.paramMap.get("data")!) || {};
    this.planning = data;
    this.updateFormattedDate();
    await this.loadingService.present(this.loadingMessage);
    this.missionService.getMissionReturnAudio(this.planning.today_schedule.id).subscribe({
      next: async value => {
        this.returns = value;

        // this.display = this.returns.mission_return_declarations.filter(
        //   (declaration: any) => declaration.photo_type === "key_cache_initial_photo" && declaration.created_at.split("T")[0] == this.selectedDate.split("T")[0]
        // );

        // this.notes = this.returns.mission_returns.filter((declaration: any) => declaration.created_at.split("T")[0] == this.selectedDate.split("T")[0]);

        // this.voices = this.returns.mission_return_audios.filter((declaration: any) => declaration.created_at.split("T")[0] == this.selectedDate.split("T")[0]);

        this.clearWaveSurfers();

        await this.loadingService.dimiss();
      },
      error: async err => {
        await this.loadingService.dimiss();
        console.error(err);
      }
    });
  }
  openSlides(i: number) {
    this.initialIndexPhoto = i;
    this.isSliderOpen = true;
  }
  ngAfterViewChecked() {
    if (this.isNotice && this.waveSurfers.length < this.voices.length) {
      this.waveformContainers.forEach((container, i) => {
        if (!this.waveSurfers[i] && this.voices[i]?.file?.url) {
          const waveSurfer = WaveSurfer.create({
            container: container.nativeElement,
            waveColor: "#9b9b9b",
            progressColor: "#00a2e1",
            barWidth: 2,
            height: 60,
            normalize: true
          });

          waveSurfer.load(this.voices[i].file.url);

          this.waveSurfers[i] = waveSurfer;
        }
      });
    }
  }

  clearWaveSurfers() {
    this.waveSurfers.forEach(ws => ws?.destroy());
    this.waveSurfers = [];
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.updateFormattedDate();
    this.showPicker = false;
    this.filter(this.selectedOption);
    this.notes = this.returns.mission_returns.filter((declaration: any) => declaration.created_at.split("T")[0] == this.selectedDate.split("T")[0]);
    this.voices = this.returns.mission_return_audios.filter((declaration: any) => declaration.created_at.split("T")[0] == this.selectedDate.split("T")[0]);
    this.clearWaveSurfers();
  }

  updateFormattedDate() {
    const date = new Date(this.selectedDate);
    this.formattedDate = date.toLocaleDateString("fr-FR");
  }

  noticesOrPhotos(status: boolean) {
    this.isNotice = status;
    this.clearWaveSurfers();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.filter(option);
    this.showDropdown = false;
  }

  filter(opt: string) {
    switch (opt) {
      case "Initiale":
        this.display = this.returns.mission_return_declarations.filter(
          (declaration: any) => declaration.photo_type === "key_cache_initial_photo" && declaration.created_at.split("T")[0] == this.selectedDate.split("T")[0]
        );
        break;
      case "Appartement":
        this.display = this.returns.mission_return_declarations.filter(
          (declaration: any) => declaration.photo_type === "key_cache_apartment_num" && declaration.created_at.split("T")[0] == this.selectedDate.split("T")[0]
        );
        break;
      case "Décharge":
        this.display = this.returns.mission_return_declarations.filter(
          (declaration: any) => declaration.photo_type === "key_receipt" && declaration.created_at.split("T")[0] == this.selectedDate.split("T")[0]
        );
        break;
    }
  }

  goBack() {
    if (this.isSliderOpen) {
      this.isSliderOpen = false;
    } else {
      this.location.back();
    }
  }

  playRecordingAgain(index: number) {
    const ws = this.waveSurfers[index];
    if (ws) {
      ws.playPause();
    }
  }
  ionViewDidEnter() {
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
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  }
}
