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
  audioUrl: any =""
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
    const id = this.planning.team.find((member: any) => member.is_teamleader)?.pointing_internal[0]?.id;
    console.log(id);
    
    this.missionService.getMissionReturnAudio(id).subscribe(async (data: any) => {

      console.log(data);
      this.returnType = data.return_types
      this.important = data.important;
       if (data?.audio_url) {
          this.audioUrl = data.audio_url;
          await this.loadingService.dimiss();
          this.createWaves();
          this.waveSurfer?.load(data.audio_url.url);
        }
        await this.loadingService.dimiss();
      

    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  getAudioDurationWithFetch() {
    if (!this.audioUrl?.url) return;

    fetch(this.audioUrl.url)
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
    if (this.waveSurfer && this.audioUrl?.url) {
      this.waveSurfer.playPause();
    }
  }
}
