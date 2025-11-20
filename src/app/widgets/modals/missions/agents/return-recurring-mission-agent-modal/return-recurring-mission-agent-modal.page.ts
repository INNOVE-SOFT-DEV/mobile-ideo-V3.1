import {Component, OnInit} from "@angular/core";
import {ModalController, AlertController, NavParams, ActionSheetController} from "@ionic/angular";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {PhotosService} from "src/app/widgets/photos/photos.service";
import {MissionService} from "src/app/tab1/service/intervention/mission/mission.service";
import {LoadingControllerService} from "src/app/widgets/loading-controller/loading-controller.service";
import {TranslateService} from "@ngx-translate/core";
import {v4 as uuidv4} from "uuid";


@Component({
  selector: "app-return-recurring-mission-agent-modal",
  templateUrl: "./return-recurring-mission-agent-modal.page.html",
  styleUrls: ["./return-recurring-mission-agent-modal.page.scss"],
  standalone: false
})
export class ReturnRecurringMissionAgentModalPage implements OnInit {
  planning: any;
  images: any = {
    key_cache_initial_photo: [

    ],
    key_cache_apartment_num: [],
    key_receipt: []
  };
  isSliderOpen: boolean = false;
  sliderPhotos: any[] = [];
  initialIndexPhoto: number = 0;
  internal_id: any
  uuid = uuidv4();

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private navParams: NavParams,
    private photosService: PhotosService,
    private actionSheetController: ActionSheetController,
    private missionService: MissionService,
    private loadingController: LoadingControllerService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
      this.planning = this.navParams.get("data");
      this.internal_id = this.navParams.get("internal_id");
    // if (!localStorage.getItem(`return_mission_declaration_photos_${this.planning.date}`))
    //   localStorage.setItem(
    //     `return_mission_declaration_photos_${this.planning.date}`,
    //     JSON.stringify({
    //       key_cache_initial_photo: [],
    //       key_cache_apartment_num: [],
    //       key_receipt: []
    //     })
    //   );
// this.addPhotoMaterial()
    // this.images = JSON.parse(localStorage.getItem(`return_mission_declaration_photos_${this.planning.date}`)!);
  }

  addSinglePhotoSlot() {
    this.images.key_cache_apartment_num.push({id: this.generateId(), photo: {}});
  }

  addPhotoMaterial() {
    // if(this.images["key_cache_initial_photo"].length >= 1 ) {
    //   console.log(this.images['key_cache_initial_photo'][0]);
      
    // }

    console.log(this.images);
    

    // debugger
    
    this.images["key_cache_initial_photo"].push([
      {id: this.generateId(), photo: {} },
      {id: this.generateId(), photo: {}},
      {id: this.generateId(), photo: {}}
    ]);
    
    console.log(this.images['key_cache_initial_photo'][0]);    // debugger;

  }
  addPhotoGroupKeyDelivery() {
    this.images.key_receipt.push([
      {id: this.generateId(), photo: {}},
      {id: this.generateId(), photo: {}},
      {id: this.generateId(), photo: {}}
    ]);
  }

  generateUuid() {
    this.uuid = uuidv4();
  }
  
  async takePicture(type: string, i: number, j: number) {
    try {
      const actionSheet = await this.actionSheetController.create({
        header: "Choisir option :",
        cssClass: "header_actionSheet",
        buttons: [
          {
            text: "Camera",
            cssClass: "btn_actionSheet",
            handler: async () => {
              await this.photosService.takePictureOption("Camera", 40);
              await this.saveNewPhoto(type, this.photosService.lastImage, i, j);
            }
          },
          {
            text: "Galerie",
            cssClass: "btn_actionSheet",
            handler: async () => {
              await this.photosService.takePictureOption("Galerie", 40);
              await this.saveNewPhoto(type, this.photosService.lastImage, i, j);
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
    } catch (error) {
      console.error("Erreur lors de la prise de photo :", error);
    }
  }
  async saveNewPhoto(type: string, photo: any, i: number, j: number) {
    const base64_image = `data:${photo.format};base64,${photo.base64String}`;
    // let uploadData = new FormData();
    // let fileName = new Date().getTime() + ".jpeg";
    // uploadData.append("photo", blob, fileName);
    // uploadData.append("planning_regular_id", this.planning.id);
    // uploadData.append("photo_type", type);
    // const loadingMessage = await this.translateService.get("loading.uploading_photo").toPromise();
    // await this.loadingController.present(loadingMessage);

    // this.missionService.createMissionReturn(uploadData).subscribe({
    //   next: async data => {
    //     switch (data["photo_type"]) {
    //       case "key_cache_initial_photo":
    //         this.images["key_cache_initial_photo"][i][j] = data;
    //         break;
    //       case "key_cache_apartment_num":
    //         this.images["key_cache_apartment_num"][i] = data;
    //         break;
    //       case "key_receipt":
    //         this.images["key_receipt"][i][j] = data;
    //         break;
    //     }
    //     localStorage.setItem(`return_mission_declaration_photos_${this.planning.date}`, JSON.stringify(this.images));
    //     await this.loadingController.dimiss();
    //   },
    //   error: async err => {
    //     await this.loadingController.dimiss();
    //     console.error(err);
    //   }
    // });

    const payload = {
      photo: [
        {
          photo_type: type,
          client_uuid: uuidv4(),
          image_base64: base64_image
        }
      ]
    };


    this.missionService.createReportPhoto(payload, this.internal_id).subscribe({
      next: async data => {
        console.log(data);
        
        
        switch (data[0]["photo_type"]) {
          case "key_cache_initial_photo":

            this.images["key_cache_initial_photo"][i][j] = data[0]
            console.log(i,j);
            
             console.log(this.images['key_cache_initial_photo'][i][j]);
            debugger

            break;
          case "key_cache_apartment_num":
            this.images["key_cache_apartment_num"][i] = data[0];
            break;
          case "key_receipt":
            this.images["key_receipt"][i][j] = data[0];
            break;
        }
        localStorage.setItem(`return_mission_declaration_photos_${this.planning.date}`, JSON.stringify(this.images));        
      },
      error: async err => {
        console.error(err);
      }
    });
  }

  openSlider(type: string, i: number, j: number) {
    this.sliderPhotos = [];
    this.initialIndexPhoto = i * 3 + j;
    if (type === "key_cache_initial_photo") {
      this.sliderPhotos = this.images[type].flat();
      this.initialIndexPhoto = i * 3 + j;
    } else if (type === "key_cache_apartment_num") {
      this.sliderPhotos = this.images[type];
      this.initialIndexPhoto = i;
    } else if (type === "key_receipt") {
      this.sliderPhotos = this.images[type].flat();
      this.initialIndexPhoto = i * 3 + j;
    }
    this.isSliderOpen = true;
  }

  async openConfirmRemovePhotoModal(event: any, type: string, id: any, i: any, j: number) {
    const alert = await this.alertController.create({
      header: "Supprimer la photo ?",
      message: "Voulez-vous vraiment supprimer cette photo ?",
      buttons: [
        {
          text: "Annuler",
          role: "cancel"
        },
        {
          text: "Supprimer",
          handler: async () => {
            await this.loadingController.present();

            switch (type) {
              case "key_cache_initial_photo":
                /*this.missionService.deletePhoto(id, "regular_declaration").subscribe({
                  next: async value => {
                    this.clearGroupSlot("key_cache_initial_photo", i, j);
                    this.persistImages();
                    await this.loadingController.dimiss();
                  },
                  error: async err => {
                    await this.loadingController.dimiss();
                    console.error(err);
                  }
                });*/
                break;

              case "key_cache_apartment_num":
                /*  this.missionService.deletePhoto(id, "regular_declaration").subscribe({
                  next: async value => {
                    this.clearSingleSlot("key_cache_apartment_num", i);
                    this.persistImages();
                    await this.loadingController.dimiss();
                  },
                  error: async err => {
                    await this.loadingController.dimiss();
                    console.error(err);
                  }
                });*/
                break;

              case "key_receipt":
                /*this.missionService.deletePhoto(id, "regular_declaration").subscribe({
                  next: async value => {
                    this.clearGroupSlot("key_receipt", i, j);
                    this.persistImages();
                    await this.loadingController.dimiss();
                  },
                  error: async err => {
                    await this.loadingController.dimiss();
                    console.error(err);
                  }
                });*/
                break;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private generateId() {
    return Math.floor(Math.random() * 10000000);
  }

  dismiss() {
    if (this.isSliderOpen) {
      this.isSliderOpen = false;
    } else {
      this.modalController.dismiss();
    }
  }

  private clearGroupSlot(type: string, i: number, j: number) {
    const group = this.images[type][i];
    group[j] = {id: this.generateId(), photo: {}};
    const allEmpty = group.every((item: any) => !item.photo.url);
    if (this.images[type].length > 1 && allEmpty) {
      this.images[type].splice(i, 1);
    }
    this.images[type] = [...this.images[type]];
  }

  private clearSingleSlot(type: string, i: number) {
    this.images[type][i] = {id: this.generateId(), photo: {}};
    const slot = this.images[type][i];
    if (this.images[type].length > 1 && !slot.photo.url) {
      this.images[type].splice(i, 1);
    }
    this.images[type] = [...this.images[type]];
  }

  private persistImages() {
    localStorage.setItem(`return_mission_declaration_photos_${this.planning.date}`, JSON.stringify(this.images));
  }
}
