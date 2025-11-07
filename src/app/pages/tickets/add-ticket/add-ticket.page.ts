import {Component, OnInit, HostListener} from "@angular/core";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import {Subscription} from "rxjs";
import WaveSurfer from "wavesurfer.js";
import {PhotosService} from "src/app/widgets/photos/photos.service";
import {ActionSheetController, AlertController, ToastController} from "@ionic/angular";
import {Location} from "@angular/common";
import {TicketService} from "src/app/pages/tickets/ticket.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-add-ticket",
  templateUrl: "./add-ticket.page.html",
  styleUrls: ["./add-ticket.page.scss"],
  standalone: false
})
export class AddTicketPage implements OnInit {
  type: any = "";
  id: any;
  title: string = "";
  note: string = "";
  priority: string = "high";
  attachmentBlocks: any[] = [{type: "empty"}];
  isRecording: boolean = false;
  currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  recording: boolean = false;
  waveSurfer?: WaveSurfer;
  private durationSub?: Subscription;
  durationDisplay: string = "";
  blobUrl?: string;
  audioRecording?: File;
  returnTime: any;
  isMenuOpen = false;
  selectedTableau: string = "";
  isNewTableau: boolean = false;
  customTableau: string = "";
  adminUsers: any[] = [];
  assignedUser: any = {};
  date: string = "";
  selectedAlert: string | null = null;
  alertBeforeDueDate: boolean = false;
  publicAccess: boolean = false;
  selectedOption: any = null;
  kanbans: any[] = [];
  boards: any[] = [];
  selectedBoard: any = "";
  audioBlob: Blob | undefined;
  update: any = false;
  task: any;
  planning: any;
  kanban: any;
  task_from_bord: boolean = false;
  kanbanId: any;
  ticketOptions = [
    {img: "assets/img/icon-1-1.png", label: "1"},
    {img: "assets/img/icon-1-2.png", label: "2"},
    {img: "assets/img/icon-1-3.png", label: "3"},
    {img: "assets/img/icon-1-4.png", label: "4"}
  ];

  constructor(
    private location: Location,
    private audioRecorderService: AudioRecorderService,
    private photosService: PhotosService,
    private actionSheetController: ActionSheetController,
    private TaskManagerService: TicketService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get("type");
    this.id = this.route.snapshot.paramMap.get("id");
    this.update = this.route.snapshot.paramMap.get("update");
    this.planning = JSON.parse(this.route.snapshot.paramMap.get("data")!);
    this.task = JSON.parse(this.route.snapshot.paramMap.get("task")!);
    this.task_from_bord = this.route.snapshot.paramMap.get("task_from_bord") === "true";
    this.kanban = this.route.snapshot.paramMap.get("kanban");
    
    // this.selectedTableau = this.kanban ? JSON.parse(this.kanban).name : null;
    // console.log(JSON.parse(this.kanban));
    
    this.boards = JSON.parse(this.kanban).boards || '[]'

    
    if (this.kanban) {
      // console.log(this.boards);
      
      this.boards =
        this.boards.length > 0
          ? this.boards
          : [
              {status: "à faire", id: "1"},
              {status: "en cours", id: "2"},
              {status: "terminé", id: "3"}
            ];
      this.selectedTableau = JSON.parse(this.kanban).id
      
      this.selectedBoard = this.boards[0]?.id;
    }
    this.TaskManagerService.getTables().subscribe((res: any) => {
      this.kanbans = res?.kanbans || [];
      this.adminUsers = res?.admin_users || [];
      this.assignedUser = this.currentUser.email;
      if (this.update === "true" && this.task) {
        this.title = this.task?.title || "";
        this.note = this.task?.description || "";
        this.priority = this.task?.priority || "high";
        this.selectedOption = this.ticketOptions.find(option => option.label === this.task?.task_type?.[0]);
        this.date = this.task?.deadline || null;
        this.alertBeforeDueDate = this.task?.alert_before_due_date === "1";
        if (this.task?.alert_timing) {
          this.alertBeforeDueDate = true;
          this.selectedAlert = this.task.alert_timing;
        }
        this.publicAccess = this.task?.private_access === false;
        this.selectedTableau = this.task?.board?.kanbans_id || null;
        this.selectedBoard = this.task?.board_id || null;
        this.boards = this.kanbans.find((kanban: any) => kanban.id === this.selectedTableau)?.boards || [];
        let assigned = this.adminUsers.find((user: any) => user.id === this.task?.admin_user_id);
        this.assignedUser = assigned ? assigned.email : this.currentUser?.email;
        if (this.task?.audio_file?.url) {
          this.blobUrl = this.task.audio_file.url;
          this.waveSurfer?.destroy();
          this.waveSurfer = WaveSurfer.create({
            container: "#waveform",
            waveColor: "violet",
            progressColor: "purple"
          });
          if (this.blobUrl) this.waveSurfer?.load(this.blobUrl);
        }
        if (this.task?.image_files?.length > 0) {
          this.attachmentBlocks = this.task.image_files.map((img: any) => ({
            type: "filled",
            image: img.url,
            dataUrl: img.url
          }));
          this.attachmentBlocks.push({type: "empty"});
        }
      }
    });
  }

  onKanbanChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === "other") {
      this.isNewTableau = true;
      this.boards = [
        {status: "à faire", id: "x"},
        {status: "en cours", id: "y"},
        {status: "terminé", id: "z"}
      ];
      this.selectedBoard = this.boards[0].id;
    } else {
      this.isNewTableau = false;
      this.boards = this.kanbans.find(kanban => kanban.id == selectedValue)?.boards || [
        {status: "à faire", id: "1"},
        {status: "en cours", id: "2"},
        {status: "terminé", id: "3"}
      ];
      this.selectedBoard = this.boards[0]?.id;
    }
  }

  selectOption(option: any) {
    this.selectedOption = option;
  }

  toggleMenu(event: Event) {
    this.isMenuOpen = !this.isMenuOpen;
    event.stopPropagation();
  }

  private async showConfirm(message: string, action: string) {
    const alert = await this.alertCtrl.create({
      header: "Confirmation",
      message,
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: () => false
        },
        {
          text: "Confirmer",
          handler: () => true
        }
      ]
    });

    await alert.present();
    const {role} = await alert.onDidDismiss();
    return role !== "cancel";
  }

  Archive(action: string) {
    this.isMenuOpen = false;
    let message = "";
    if (action == "archive") {
      message = "Êtes-vous sûr de vouloir archiver ce ticket ?";
    } else {
      message = "Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action est irréversible.";
    }
    this.showConfirm(message, action).then(async (res: any) => {
      if (res) {
        if (action == "archive") {
          const formData = new FormData();
          formData.append("archive", "1");
          formData.append("id", this.task.id);
          this.TaskManagerService.archiveTask(formData).subscribe(
            (res: any) => {
              this.toaster("Task archived successfully", "success");
              this.goBack();
            },
            (error: any) => {
              console.error("Error archiving task:", error);
              this.toaster("Failed to archive task", "error");
            }
          );
        } else {
          this.TaskManagerService.deleteTask(this.task.id).subscribe(
            (res: any) => {
              this.toaster("Task deleted successfully", "success");
              this.goBack();
            },
            (error: any) => {
              this.toaster("Failed to delete task", "error");
            }
          );
        }
      }
    });
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest(".submenu") && !target.closest("ion-button")) {
      this.isMenuOpen = false;
    }
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
    this.audioBlob = audioBlob;
    this.audioRecording = new File([audioBlob], this.audioRecorderService.fileName, {type: "audio/mp3"});
    this.blobUrl = URL.createObjectURL(audioBlob);
    this.waveSurfer?.load(this.blobUrl);
  }
  playRecordingAgain() {
    if (this.waveSurfer && this.blobUrl) {
      this.waveSurfer.playPause();
    }
  }
  deleteAttachment(index: number) {
    if (this.update == "true") {
      const extention = this.attachmentBlocks[index].image.split("/")[this.attachmentBlocks[index].image.split("/").length - 1].split(".")[1];
      this.TaskManagerService.deletePhoto(
        this.task.id,
        this.attachmentBlocks[index].image.split("/")[this.attachmentBlocks[index].image.split("/").length - 1],
        extention
      ).subscribe(
        (res: any) => {
          this.attachmentBlocks.splice(index, 1);
        },
        (error: any) => {
          console.error("Error deleting photo:", error);
        }
      );
    } else {
      this.attachmentBlocks.splice(index, 1);
    }
  }
  addAttachment() {
    this.attachmentBlocks.push({type: "empty"});
  }
  async onBlockClick(index: number) {
    await this.takePicture(index);
  }
  async takePicture(i: number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Choisir option :",
      cssClass: "header_actionSheet",
      buttons: [
        {
          text: "Camera",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Camera", 40);
            const photo = this.photosService.lastImage;
            if (photo && photo.base64String) {
              const imagePath = "data:image/jpeg;base64," + photo.base64String;
              const imageBlob = this.photosService.dataURLtoBlob(imagePath);
              if (this.update == "true") {
                this.savePicToServer(i, imageBlob);
              } else {
                this.fillAttachment(i, imagePath, imageBlob);
              }
            }
          }
        },
        {
          text: "Galerie",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.photosService.takePictureOption("Galerie", 40);
            const photo = this.photosService.lastImage;
            if (photo && photo.base64String) {
              const imagePath = "data:image/jpeg;base64," + photo.base64String;
              const imageBlob = this.photosService.dataURLtoBlob(imagePath);
              if (this.update == "true") {
                this.savePicToServer(i, imageBlob);
              } else {
                this.fillAttachment(i, imagePath, imageBlob);
              }
            }
          }
        },
        {
          text: "Annuler",
          cssClass: "btn_actionSheet",
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  fillAttachment(i: number, path: string, dataUrl: any) {
    this.attachmentBlocks[i] = {
      type: "filled",
      image: path,
      dataUrl: dataUrl
    };
    if (i === this.attachmentBlocks.length - 1) {
      this.addAttachment();
    }
  }

  savePicToServer(i: number, imageBlob: any) {
    const formData = new FormData();
    formData.append("image", imageBlob, Date.now() + ".jpeg");
    formData.append("task_id", this.task.id);
    this.TaskManagerService.addPhoto(formData).subscribe((res: any) => {
      this.fillAttachment(i, res.url, imageBlob);
    });
  }

  saveTicket() {
    if (!this.title || this.title.trim() === "") {
      this.toaster("Title is required", "error");
      return;
    }
    if (!this.selectedOption) {
      this.toaster("Option must be selected", "error");
      return;
    }
    if (this.isNewTableau && (!this.customTableau || this.customTableau.trim() === "")) {
      this.toaster("Custom tableau name is required for new tableau", "error");
      return;
    }
    if (this.alertBeforeDueDate && (!this.selectedAlert || this.selectedAlert.trim() === "")) {
      this.toaster("Alert time must be set if alert before due date is enabled", "error");
      return;
    }
    if (!this.selectedBoard) {
      this.toaster("Board must be selected", "error");
      return;
    }
    const formData = new FormData();
    formData.append("public_access", this.publicAccess ? "1" : "0");
    formData.append("option", this.selectedOption.label);
    formData.append("board_id", this.selectedBoard ? this.selectedBoard : "");
    formData.append("assigned_user", this.assignedUser ? this.assignedUser : "");
    formData.append("due_date", this.date ? this.date : "");
    formData.append("alert_before_due_date", this.alertBeforeDueDate ? "1" : "0");
    formData.append("alert_time", this.selectedAlert ? this.selectedAlert : "");
    formData.append("is_new_tableau", this.isNewTableau ? "1" : "0");
    formData.append("custom_tableau", this.isNewTableau ? this.customTableau : "");
    formData.append("title", this.title);
    formData.append("note", this.note ? this.note : "");
    formData.append("priority", this.priority);
    if (this.planning) {
      if (this.planning.planning_punctual_id) formData.append("planning", "punctual");
      else if (this.planning.forfaitaire_item_id) formData.append("planning", "forfaitaire");
      else formData.append("planning", "regular");
      formData.append("id", this.planning.id);
    }
    if (this.audioBlob) formData.append("audio_file", this.audioBlob, Date.now() + ".mp3");
    let images: any = this.attachmentBlocks.map(block => block.dataUrl);
    images = images.filter((img: any) => typeof img === "object" && img instanceof Blob);
    if (images.length > 0) {
      images.forEach((image: Blob, index: number) => {
        formData.append("images[]", image, Date.now() + index + ".jpeg");
      });
    }
    if (this.update == "true" && this.task) {
      this.TaskManagerService.updateTask(formData, this.task.id).subscribe(
        (res: any) => {
          this.TaskManagerService.getTables().subscribe((res: any) => {
            this.kanbans = res.kanbans;
            this.adminUsers = res.admin_users;
            this.assignedUser = this.currentUser.email;
            this.toaster("Task updated successfully", "success");
            this.goBack();
          });
        },
        (error: any) => {
          console.error("Error updating task:", error);
          this.toaster("Failed to update task", "error");
        }
      );
    } else {
      this.TaskManagerService.creatTask(formData).subscribe(
        (res: any) => {
          this.TaskManagerService.getTables().subscribe((res: any) => {
            this.kanbans = res.kanbans;
            this.adminUsers = res.admin_users;
            this.assignedUser = this.currentUser.email;
            this.toaster("Task created successfully", "success");
            this.goBack();
          });
        },
        (error: any) => {
          console.error("Error creating task:", error);
          this.toaster("Failed to create task", "error");
        }
      );
    }
  }

  async toaster(message: string, status: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: status == "success" ? "success" : "danger"
    });
    toast.present();
  }
  goBack() {
    this.TaskManagerService.refresh_event.emit();
    this.location.back();
  }

  call(contact: any) {
    if (contact.phone) {
      window.open(`tel:${contact.phone}`, "_system");
    }
  }

  email(contact: any) {
    if (contact.email) {
      window.open(`mailto:${contact.email}`, "_system");
    }
  }
}
