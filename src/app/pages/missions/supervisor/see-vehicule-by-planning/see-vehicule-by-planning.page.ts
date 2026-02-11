import {Component, ElementRef, OnInit, QueryList, ViewChildren} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {Location} from "@angular/common";
import {environment} from "src/environments/environment";
import WaveSurfer from "wavesurfer.js";

@Component({
  selector: "app-see-vehicule-by-planning",
  templateUrl: "./see-vehicule-by-planning.page.html",
  styleUrls: ["./see-vehicule-by-planning.page.scss"],
  standalone: false
})
export class SeeVehiculeByPlanningPage implements OnInit {
  sliderPhotos: any[] = [];
  initialIndexPhoto: number = 0;
  voices: any[] = [];
  notes: any[] = [];
  waveSurfers: WaveSurfer[] = [];
  @ViewChildren("waveformContainer") waveformContainers!: QueryList<ElementRef>;

  getRaisonIcon(raison: string): string {
    switch (raison) {
      case "has_issue":
        return "assets/img/has_issue.png";
      case "not_functional":
        return "assets/img/nonroulant.png";
      case "get_vehicule":
        return "assets/img/Atrribution.png";
      case "not_adapted":
        return "assets/img/nonadapter.png";
      case "first":
        return "assets/img/first.png";
      default:
        return "assets/img/default.png";
    }
  }
  returns: any[] = [];
  openSliderModal(item: any, title: any) {
    this.notes = [];
    let photos = item.photo.filter((photo: any) => photo.type == title);
    photos = photos.map((photo: any) => {
      return {
        photo: {
          url: `${environment.urlAPI}/uploads/mission_return_vehicule/photo/${photo.file_name}`
        }
      };
    });
    this.sliderPhotos = photos || [];

    let voices = item.file.filter((voice: any) => voice.type == title);
    voices = voices.map((voice: any) => {
      return {
        voice: {
          url: `${environment.urlAPI}uploads/mission_return_vehicule/audio/${voice.file_name}`
        }
      };
    });
    this.voices = voices || [];

    if (title == "has_issue" || title == "not_functional") {
      let notes = item.material.notes.split("/").filter((note: any) => note.includes(item.id) && note.includes(title));
      notes = notes.map((n: string) => n.split("|")[0]);
      this.notes = [...new Set(notes)];
    }

    this.initialIndexPhoto = 0;
    this.sliderOpen = true;

    this.waveSurfers = [];
  }

  laodingMessage: string = "";
  planning: any;
  sliderOpen: any;
  data: any;

  constructor(
    private loadingService: LoadingControllerService,
    private missionService: MissionService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private location: Location,
    private el: ElementRef
  ) {}

  async ngOnInit() {
    this.laodingMessage = await this.translateService.get("Loading").toPromise();
    const data = JSON.parse(this.route.snapshot.paramMap.get("data")!) || {};
    this.planning = data;
    await this.getReturns();
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

  async getReturns() {
    await this.loadingService.present(this.laodingMessage);
    this.missionService.getVehiculeReturnByPlanning(this.planning.id, this.planning.type).subscribe(
      async returns => {
        await this.loadingService.dimiss();
        this.returns = returns;
      },
      async error => {
        await this.loadingService.dimiss();
        console.error(error);
      }
    );
  }

  goBack() {
    if (this.sliderOpen) {
      this.sliderOpen = false;
    } else {
      this.location.back();
    }
  }

  ngAfterViewChecked() {
    if (this.sliderOpen && this.waveSurfers.length < this.voices.length) {
      this.waveformContainers.forEach((container, i) => {
        if (!this.waveSurfers[i]) {
          const waveSurfer = WaveSurfer.create({
            container: container.nativeElement,
            waveColor: "#9b9b9b",
            progressColor: "black",
            barWidth: 2,
            height: 60,
            normalize: true
          });

          waveSurfer.load(this.voices[i].voice.url);
          this.waveSurfers[i] = waveSurfer;
        }
      });
    }
  }

  playRecordingAgain(index: number) {
    const ws = this.waveSurfers[index];
    if (ws) {
      ws.playPause();
    }
  }
}
