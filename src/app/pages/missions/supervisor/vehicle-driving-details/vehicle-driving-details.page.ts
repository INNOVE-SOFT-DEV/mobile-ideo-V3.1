import {Component, OnInit, AfterViewChecked, ViewChildren, QueryList, ElementRef} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {environment} from "src/environments/environment";
import WaveSurfer from "wavesurfer.js";

@Component({
  selector: "app-vehicle-driving-details",
  templateUrl: "./vehicle-driving-details.page.html",
  styleUrls: ["./vehicle-driving-details.page.scss"],
  standalone: false
})
export class VehicleDrivingDetailsPage implements OnInit, AfterViewChecked {
  name: string = "";
  id: any;
  image: any;
  data: any;
  sliderOpen: boolean = false;
  sliderPhotos: any[] = [];
  initialIndexPhoto: number = 0;
  voices: any[] = [];
  notes: any[] = [];
  waveSurfers: WaveSurfer[] = [];

  @ViewChildren("waveformContainer") waveformContainers!: QueryList<ElementRef>;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.data = JSON.parse(this.route.snapshot.paramMap.get("data")!) || {};
    this.id = this.route.snapshot.paramMap.get("id");
    this.image = decodeURIComponent(this.route.snapshot.paramMap.get("image") || "");
    this.name = this.route.snapshot.paramMap.get("name") || "";
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
      let notes = item.notes.split("/").filter((note: any) => note.includes(item.id) && note.includes(title));
      notes = notes.map((n: string) => n.split("|")[0]);
      this.notes = [...new Set(notes)];
    }

    this.initialIndexPhoto = 0;
    this.sliderOpen = true;

    this.waveSurfers = [];
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

  goBack() {
    if (this.sliderOpen) {
      this.sliderOpen = false;
    } else {
      this.location.back();
    }
  }
}
