import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import WaveSurfer from "wavesurfer.js";

@Component({
  selector: "app-mission-returns-supervisor",
  templateUrl: "./mission-returns-supervisor.page.html",
  styleUrls: ["./mission-returns-supervisor.page.scss"],
  standalone: false
})
export class MissionReturnsSupervisorPage implements OnInit {
  @Input() planning: any;
  regularAgentFilter = false;
  selectedRegularAgent: any = {id: null};
  returnType: any = "";
  important: boolean = true;
  vocal: boolean = true;
  audioUrl: any;
  recordedAudios: any[] = [];
  returnTime: any;
  waveSurfer?: WaveSurfer;
  durationDisplay: any;
  loadingMessage: string = "";

  constructor(
    private modalController: ModalController,
    private missionService: MissionService,
    private translateService: TranslateService,
    private loadingService: LoadingControllerService
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("loading").toPromise();

    await this.loadingService.present(this.loadingMessage);
    // this.missionService.getMissionReturnAudio(this.planning.id, this.planning.type).subscribe(async (data: any) => {
    //   if (data.length > 0) {
    //     this.returnType = data[0].return_type;
    //     if (data[0].return_time != null) {
    //       this.returnTime = data[0]?.return_time?.split(":")[0] + ":" + data[0]?.return_time?.split(":")[1];
    //     } else {
    //       // this.returnTime = data[0]?.cre
    //       let time = data[0]?.created_at?.split(":")[0] + ":" + data[0]?.created_at?.split(":")[1];

    //       this.returnTime = time.split("T")[1];
    //     }
    //     this.important = data[0].important;
    //     this.audioUrl = data[0].file.url;
    //     this.recordedAudios = data;
    //     this.createWaves();
    //     this.waveSurfer?.load(data[0].file.url);
    //     await this.loadingService.dimiss();
    //   } else {
    //     this.missionService.getMissionReturn(this.planning.id, this.planning.type).subscribe(async (data01: any) => {
    //       if (data01.length > 0) {
    //         this.returnType = data01[0].return_type;
    //         this.returnTime = data01[0]?.return_time.split(":")[0] + ":" + data01[0]?.return_time.split(":")[1];
    //         this.important = data01[0].important;
    //       }

    //       await this.loadingService.dimiss();
    //     });
    //   }
    // });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  getAudioDurationWithFetch() {
    if (!this.audioUrl) return;

    fetch(this.audioUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        return audioContext.decodeAudioData(arrayBuffer);
      })
      .then(decodedData => {
        const duration = decodedData.duration;
        this.durationDisplay = this.formatDuration(duration);
      })
      .catch(err => {
        console.error("Error decoding audio:", err);
        this.durationDisplay = "Unknown";
      });
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  }

  createWaves() {
    this.waveSurfer?.destroy();
    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple"
    });

    this.waveSurfer.on("audioprocess", () => {
      if (this.waveSurfer) {
        const currentTime = this.waveSurfer.getCurrentTime();
        this.durationDisplay = this.formatDuration(currentTime);
      }
    });

    this.waveSurfer.on("finish", () => {
      this.getAudioDurationWithFetch();
    });
  }

  playRecordingAgain() {
    if (this.waveSurfer && this.recordedAudios[0].file.url) {
      this.waveSurfer.playPause();
    }
  }
}
