import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "../../loading-controller/loading-controller.service";
import WaveSurfer from "wavesurfer.js";
import {ElementRef, ViewChild} from "@angular/core";
import {FeedbackModalPage} from "../feedback-modal/feedback-modal.page";
@Component({
  selector: "app-mission-returns-supervisor",
  templateUrl: "./mission-returns-supervisor.page.html",
  styleUrls: ["./mission-returns-supervisor.page.scss"],
  standalone: false
})
export class MissionReturnsSupervisorPage implements OnInit {
  @ViewChild("audioPlayer") audioPlayer!: ElementRef<HTMLAudioElement>;

  @Input() planning: any;
  regularAgentFilter = false;
  selectedRegularAgent: any = {id: null};
  returnType: any = "";
  important: boolean = true;
  vocal: boolean = true;
  audioUrl: any = "";
  recordedAudios: any[] = [];
  returnTime: any;
  waveSurfer?: WaveSurfer;
  //durationDisplay: any;
  loadingMessage: string = "";
  isPlaying = false;
  durationDisplay = "0:00";
  agent: any;
  parent_id: any;
  reply: any;

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
    this.missionService.getSupervisorAudioReport(this.planning.today_schedule.id).subscribe(async (data: any) => {
      console.log(data);
      this.returnTime = data.audio_report?.recorded_at.split("T")[1].split(".")[0].split(":").slice(0, 2).join(":") || "";
      console.log(this.returnTime);

      this.reply = data?.reply;
      this.returnType = data.audio_report?.return_types;
      this.important = data.audio_report?.important;
      this.parent_id = data.audio_report?.id;
      if (data.audio_report?.audio_url) {
        this.audioUrl = data.audio_report.audio_url;
        this.agent = this.planning.today_schedule.agents.find((a: any) => a.pointing_internal[0].id == data.audio_report.pointing_internal_id);
        await this.loadingService.dimiss();
        this.createWaves();
        this.waveSurfer?.load(data.audio_report.audio_url.url);
      }
      await this.loadingService.dimiss();
    });
  }

  async getId() {
    return this.planning.team.find((member: any) => member.is_teamleader)?.pointing_internal[0]?.id;
  }

  togglePlay() {
    const audio = this.audioPlayer.nativeElement;

    if (!audio) return;

    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    this.isPlaying = !this.isPlaying;

    // Quand la durée est chargée
    audio.onloadedmetadata = () => {
      this.durationDisplay = this.formatTime(audio.duration);
    };

    // Mise à jour du timer pendant la lecture
    audio.ontimeupdate = () => {
      this.durationDisplay = this.formatTime(audio.currentTime);
    };

    // Quand l’audio est fini
    audio.onended = () => {
      this.isPlaying = false;
    };
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
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
      waveColor: "white",
      progressColor: "gray",
      normalize: true,
      height: 52,
      barWidth: 3,
      barRadius: 3
    });
    this.waveSurfer.on("audioprocess", () => {
      if (this.waveSurfer) {
        const currentTime = this.waveSurfer.getCurrentTime();
        this.durationDisplay = this.formatDuration(currentTime);
      }
    });

    this.waveSurfer.on("finish", () => {
      this.isPlaying = false;
      this.getAudioDurationWithFetch();
    });
  }

  playRecordingAgain() {
    if (this.waveSurfer && this.audioUrl?.url) {
      this.isPlaying = true;
      this.waveSurfer.playPause();
    }
  }

  async openFeedbackModal() {
    // 1️⃣ Fermer la modal actuelle
    await this.modalController.dismiss();

    const modal = await this.modalController.create({
      component: FeedbackModalPage,
      cssClass: "feedback-modal",
      backdropDismiss: false,
      componentProps: {
        planning: this.planning,
        agent: this.agent,
        schedule: this.planning.today_schedule,
        parent_id: this.parent_id,
        reply: this.reply
      }
    });
    modal.onDidDismiss().then(data => {
      this.reply = data;
    });
    await modal.present();
  }
}
