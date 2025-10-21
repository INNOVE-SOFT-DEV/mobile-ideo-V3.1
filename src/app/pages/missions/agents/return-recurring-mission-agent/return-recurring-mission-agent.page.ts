import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import WaveSurfer from "wavesurfer.js";
import {Subscription} from "rxjs";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import {ReturnRecurringMissionAgentModalPage} from "src/app/widgets/modals/missions/agents/return-recurring-mission-agent-modal/return-recurring-mission-agent-modal.page";
import {ModalController} from "@ionic/angular";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";

@Component({
  selector: "app-return-recurring-mission-agent",
  templateUrl: "./return-recurring-mission-agent.page.html",
  styleUrls: ["./return-recurring-mission-agent.page.scss"],
  standalone: false
})
export class ReturnRecurringMissionAgentPage implements OnInit {
  planning: any;
  note: string = "";
  isRecording: boolean = false;
  recording: boolean = false;
  waveSurfer?: WaveSurfer;
  private durationSub?: Subscription;
  durationDisplay: string = "";
  blobUrl?: string;
  audioRecording?: File;
  noteCache: string = "";
  returnTime: any;
  loadingMessage: string | undefined;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private audioRecorderService: AudioRecorderService,
    private modalController: ModalController,
    private missionService: MissionService,
    private loadingService: LoadingControllerService
  ) {}

  ngOnInit() {
    const data = JSON.parse(this.route.snapshot.paramMap.get("data")!) || {};

    this.planning = data;
    this.getReturns();
  }

  async getReturns() {
    await this.loadingService.present(this.loadingMessage);
    this.missionService.getMissionReturnAudio(this.planning.id, "regular").subscribe({
      next: async value => {
        if (value.length > 0) {
          this.returnTime = value[0].return_time;
          this.blobUrl = value[0].file.url;
          await this.loadingService.dimiss();
          this.createWaves();
          this.waveSurfer?.load(value[0].file.url);
        } else {
          this.missionService.getMissionReturn(this.planning.id, "regular").subscribe({
            next: async value => {
              if (value.length > 0) {
                this.returnTime = value[0].return_time;
                this.note = value[0].note;
                this.noteCache = value[0].note;
              }

              await this.loadingService.dimiss();
            },
            error: async err => {
              await this.loadingService.dimiss();
              console.error(err);
            }
          });
        }
      },
      error: async err => {
        await this.loadingService.dimiss();
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.durationSub?.unsubscribe();
    this.waveSurfer?.destroy();
  }

  async startRecording() {
    this.recording = true;
    this.isRecording = true;
    this.durationDisplay = "";
    this.waveSurfer?.destroy();
    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple"
    });
    await this.audioRecorderService.startRecording();
    this.durationSub = this.audioRecorderService.durationDisplay$.subscribe(value => {
      this.durationDisplay = value;
    });
  }

  async stopRecording() {
    this.recording = false;
    const audioBlob = await this.audioRecorderService.stopRecording();
    this.audioRecording = new File([audioBlob], this.audioRecorderService.fileName, {type: "audio/mp3"});
    this.blobUrl = URL.createObjectURL(audioBlob);
    this.waveSurfer?.load(this.blobUrl);
  }

  playRecordingAgain() {
    if (this.waveSurfer && this.blobUrl) {
      this.waveSurfer.playPause();
    }
  }

  async makeDeclaration() {
    const uploadData = new FormData();
    uploadData.append("planning_regular_id", this.planning.id);
    uploadData.append("date", new Date() + "");
    uploadData.append(
      "return_time",
      new Date()
        .toLocaleString("fr-FR", {
          timeZone: "Europe/Paris"
        })
        .split(" ")[1] + ""
    );
    if (this.audioRecording) {
      let fileName = new Date().getTime() + ".wav";
      const blob = new Blob([this.audioRecording], {type: "audio/wav"});
      uploadData.append("file", blob, fileName);
      this.missionService.createMissionReturn(uploadData).subscribe({
        next: async value => {
          this.audioRecording = undefined;
        },
        error: async err => {
          console.error(err);
        }
      });
    }
    if (this.note != this.noteCache) {
      uploadData.append("note", this.note);
      await this.loadingService.present("Enregistrement de la déclaration...");
      this.missionService.createMissionReturn(uploadData).subscribe({
        next: async value => {
          this.noteCache = value.note;
          await this.loadingService.dimiss();
        },
        error: async err => {
          await this.loadingService.dimiss();
          console.error(err);
        }
      });
    }
  }

  createWaves() {
    this.waveSurfer?.destroy();
    this.waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
      normalize: true
    });
  }

  async goToReturnRecurringMissionAgentModal() {
    await this.makeDeclaration();
    const modal = await this.modalController.create({
      component: ReturnRecurringMissionAgentModalPage,
      cssClass: "materials-modal",
      componentProps: {data: this.planning}
    });
    return await modal.present();
  }

  goBack() {
    this.location.back();
  }
}
