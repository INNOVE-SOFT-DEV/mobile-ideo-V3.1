import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../login/service/auth.service";
import {ChatService} from "src/app/tab2/chatService/chat.service";
import {IonContent, RefresherCustomEvent, Platform} from "@ionic/angular";
import {AudioRecorderService} from "src/app/widgets/recorder/audio-recorder.service";
import {PhotosService} from "src/app/widgets/photos/photos.service";
import {PdfTakerService} from "src/app/widgets/pdf-taker/pdf-taker.service";
import {Browser} from "@capacitor/browser";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";

@Component({
  selector: "app-chat-room",
  templateUrl: "./chat-room.page.html",
  styleUrls: ["./chat-room.page.scss"],
  standalone: false
})
export class ChatRoomPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild("messageInput", {static: false}) messageInput!: ElementRef;

  message: string = "";
  user: any;
  current_user: any = this.AuthService.getCurrentUser();
  roomId: string = "";
  messages: any[] = [];
  recording: boolean = false;
  isRecording: boolean = false;
  durationDisplay: string = "";
  waveSurfer: any;
  audioRecorderService: any;
  durationSub: any;
  audioBlob: any;
  audioRecording!: File;
  blobUrl: string = "";
  isTyping: boolean = false;
  showFab = false;
  images: any[] = [];
  isSliderOpen: boolean = false;
  sliderPhotos: any[] = [];
  initialIndexPhoto: number = 0;
  showReplyInput = false;
  replyingToMessage: any = null;
  pressTimer: any;
  isIos: boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private chatService: ChatService,
    private AudioRecorder: AudioRecorderService,
    private photoService: PhotosService,
    private pdfTaker: PdfTakerService,
    private loadingService: LoadingControllerService,
    private platform: Platform
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(this.route.snapshot.paramMap.get("data")!);
    this.isIos = this.platform.is("ios");
    if (this.user?.reads_ids?.length > 0) {
      this.chatService.updateReadsAt(this.user.reads_ids).subscribe((res: any) => {
        const users = [...this.chatService.usersSubject.value];
        const index = users.findIndex(u => u.room_id === this.user.room_id);
        if (index > -1) {
          const [user] = users.splice(index, 1);
          user?.reads_count ? (user.reads_count = 0) : null;
          user?.reads_ids ? (user.reads_ids = []) : null;
          users.unshift(user);
        }
        this.chatService.usersSubject.next(users);
      });
    }
    await this.loadingService.present("Chargement des messages");
    this.chatService.room(this.current_user.id, this.user.id).subscribe(async res => {
      this.roomId = res.room_id;
      this.messages = res.messages.map((msg: any) => ({
        ...msg,
        timeAgo: this.chatService.getTimeAgo(msg.created_at)
      }));
      console.log(this.messages);
      
      await this.loadingService.dimiss();
      this.scrollToBottomSmoothly();
    });
    this.chatService.newMessage.subscribe((message: any) => {
      if (message.room_id === this.roomId) {
        message.timeAgo = this.chatService.getTimeAgo(message.created_at);
        this.messages.push(message);
        this.scrollToBottomSmoothly();
      }
    });
  }
  async scrollToBottomSmoothly() {
    await new Promise(resolve => setTimeout(resolve, 300));

    const scrollElement = await this.content.getScrollElement();
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;

    if (scrollHeight > clientHeight) {
      const distance = scrollHeight - clientHeight;

      let scrollDuration = 300;
      if (distance > 1500) scrollDuration = 500;
      if (distance > 3000) scrollDuration = 700;

      this.content.scrollToPoint(0, scrollHeight, scrollDuration);
    }
  }

  goBack() {
    this.chatService.loadUsers();
    if (this.isSliderOpen) {
      this.isSliderOpen = false;
      this.scrollToBottomSmoothly();
    } else this.location.back();
  }

  sendMessage() {
    if (this.message.trim() === "") return;

    let toReplayID: any = null;
    if (this.replyingToMessage) {
      toReplayID = this.replyingToMessage.id;
    }

    let newMessage: any = {
      sender_id: this.current_user.id,
      content: this.message,
      room_id: this.roomId,
      created_at: new Date().toISOString(),
      timeAgo: "à l'instant",
      message_type: "text",
      recipient_id: this.user.id,
      replied_to: toReplayID
    };
    this.message = "";
    this.chatService.channel.perform("send_message", newMessage);
    if (this.showReplyInput) {
      this.showReplyInput = false;
      this.replyingToMessage = null;
    }
  }

  async startRecording() {
    this.recording = true;
    this.isRecording = true;
    this.durationDisplay = "";

    await this.AudioRecorder.startRecording();
    this.durationSub = this.AudioRecorder.durationDisplay$.subscribe((value: any) => {
      this.durationDisplay = value;
    });
  }
  async stopRecording() {
    this.recording = false;
    const audioBlob = await this.AudioRecorder.stopRecording();
    this.audioBlob = audioBlob;
    this.audioRecording = new File([audioBlob], this.AudioRecorder.fileName, {type: "audio/mp3"});
    const formData = new FormData();
    formData.append("sender_id", this.current_user.id);
    formData.append("room_id", this.roomId);
    formData.append("voice", this.audioBlob, Date.now() + ".mp3");
    formData.append("message_type", "voice");
    formData.append("recipient_id", this.user.id);
    let toReplayID: any = null;
    if (this.replyingToMessage) {
      toReplayID = this.replyingToMessage.id;
      formData.append("replied_to", toReplayID);
    }
    await this.loadingService.present("Envoi de votre vocal");
    this.chatService.attachments(formData).subscribe(async res => {
      this.chatService;
      if (this.showReplyInput) {
        this.showReplyInput = false;
        this.replyingToMessage = null;
      }
      await this.loadingService.dimiss();
    });
  }

  onFocus() {
    this.isTyping = true;
  }

  onBlur() {
    this.isTyping = false;
  }

  toggleFab() {
    this.showFab = !this.showFab;
  }

  openDocument() {
    this.pdfTaker.selectPdf().then(async file => {
      if (file) {
        const formData = new FormData();
        formData.append("sender_id", this.current_user.id);
        formData.append("room_id", this.roomId);
        formData.append("document", file, file.name.split(".")[0] + `.${file.name.split(".")[1]}`);
        formData.append("recipient_id", this.user.id);
        formData.append("message_type", "document");

        let toReplayID: any = null;
        if (this.replyingToMessage) {
          toReplayID = this.replyingToMessage.id;
          formData.append("replied_to", toReplayID);
        }
        await this.loadingService.present("Envoi de votre document");
        this.chatService.attachments(formData).subscribe(async res => {
          this.showFab = false;
          this.hideReplyInput();
          await this.loadingService.dimiss();
          this.scrollToBottomSmoothly();
        });
      }
    });
  }

  hideReplyInput() {
    if (this.showReplyInput) {
      this.showReplyInput = false;
      this.replyingToMessage = null;
    }
  }

  async openGallery() {
    await this.photoService.pickImages();
    const formData = this.prepareImagesFormData();
    for (let i = 0; i < this.photoService.multipleImages.length; i++) {
      const photo = this.photoService.multipleImages[i];
      const response = await fetch(photo.webPath);
      console.log(response);

      const blob = await response.blob();
      formData.append("images[]", blob, `image_${Date.now()}_${i}.${photo.format}`);
    }
    let toReplayID: any = null;
    if (this.replyingToMessage) {
      toReplayID = this.replyingToMessage.id;
      formData.append("replied_to", toReplayID);
    }
    await this.loadingService.present("Envoi de vos images");
    this.chatService.attachments(formData).subscribe(async res => {
      this.photoService.multipleImages = [];
      this.showFab = false;
      this.hideReplyInput();
      await this.loadingService.dimiss();

      this.scrollToBottomSmoothly();
    });
  }
  async openCamera() {
    await this.photoService.takePictureOption("Camera", 40);
    const blob = this.photoService.base64ToBlob(this.photoService.lastImage.base64String);
    this.images.push(blob);
    const formData = this.prepareImagesFormData();
    let toReplayID: any = null;
    if (this.replyingToMessage) {
      toReplayID = this.replyingToMessage.id;
      formData.append("replied_to", toReplayID);
    }
    await this.loadingService.present("Envoi de votre image");
    this.chatService.attachments(formData).subscribe(async res => {
      this.images = [];
      this.showFab = false;
      this.hideReplyInput();
      await this.loadingService.dimiss();
      this.scrollToBottomSmoothly();
    });
  }

  prepareImagesFormData(): FormData {
    const formData = new FormData();
    formData.append("sender_id", this.current_user.id);
    formData.append("room_id", this.roomId);
    this.images.forEach((image: Blob, index: number) => {
      formData.append("images[]", image, Date.now() + index + ".jpeg");
    });
    formData.append("recipient_id", this.user.id);
    formData.append("message_type", "image");
    return formData;
  }

  openImageSlider(images: any[]) {
    this.isSliderOpen = true;
    this.initialIndexPhoto = 0;
    this.sliderPhotos = images;
  }

  openDoc(doc: string) {
    Browser.open({url: doc});
  }

  onPressStart(message: any) {
    this.pressTimer = setTimeout(() => {
      this.replyingToMessage = message;
      this.showReplyInput = true;
    }, 500);
  }

  onPressEnd() {
    clearTimeout(this.pressTimer);
  }

  cancelReply() {
    this.showReplyInput = false;
    this.replyingToMessage = null;
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.chatService.loadMoreMessages(this.roomId, this.messages[0].id).subscribe(res => {
      this.messages = [
        ...res.messages.map((msg: any) => ({
          ...msg,
          timeAgo: this.chatService.getTimeAgo(msg.created_at)
        })),
        ...this.messages
      ];
      event.target.complete();
    });
  }
  closeFab() {
    this.showFab = false;
  }
}
