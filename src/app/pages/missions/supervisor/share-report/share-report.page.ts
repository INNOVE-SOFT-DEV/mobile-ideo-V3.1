import {Component, ElementRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ActionSheetController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {AppLauncher} from "@capacitor/app-launcher";
import {Browser} from "@capacitor/browser";
import {Network} from "@capacitor/network";
import {ModalController} from "@ionic/angular";
import {PhotoReportModalComponent} from "src/app/widgets/modals/photo-report-modal/photo-report-modal.component";
import {environment} from "src/environments/environment";
import {Clipboard} from "@capacitor/clipboard";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {EmailComposer} from "capacitor-email-composer";
import {trigger, style, animate, transition} from "@angular/animations";

@Component({
  animations: [
    trigger("fadeUp", [transition(":enter", [style({opacity: 0, transform: "translateY(15px)"}), animate("300ms ease-out", style({opacity: 1, transform: "translateY(0)"}))])])
  ],
  selector: "app-share-report",
  templateUrl: "./share-report.page.html",
  styleUrls: ["./share-report.page.scss"],
  standalone: false
})
export class ShareReportPage implements OnInit {
  data: any;
  contact: any;
  loadingMessage: string = "Loading...";
  isConnected: boolean = false;
  publicUrl: string = "";

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private translateService: TranslateService,
    private modalController: ModalController,
    private toastCtrl: ToastControllerService,
    private el: ElementRef
  ) {}

  async ngOnInit() {
    this.loadingMessage = await this.translateService.get("Loading").toPromise();
    this.route.params.subscribe(params => {
      if (params["data"]) {
        this.data = JSON.parse(params["data"]);
      }
      if (params["contacts"]) {
        this.contact = JSON.parse(params["contacts"]);
      }
    });

    Network.getStatus().then(status => {
      this.isConnected = status.connected;
    });

    Network.addListener("networkStatusChange", status => {
      this.isConnected = status.connected;
    });
  }

  async openPhotoReportModal(option: string) {
    const modal = await this.modalController.create({
      component: PhotoReportModalComponent,
      componentProps: {
        data: this.data,
        option: option
      },
      cssClass: "photo-report-modal"
    });

    modal.onDidDismiss().then(result => {
      if (result.data) {
        switch (result.data.action) {
          case "generatePublic":
            this.handleGeneratePublicReport(result.data.data, result.data.option);
            break;
          case "cancel":
            break;
        }
      }
    });

    return await modal.present();
  }

  async handleGeneratePublicReport(data: any, option: string) {
    this.publicUrl = `${environment.url_web}reports/client-report/${data.uniq_id}`;
    if (option == "share") {
      await this.chooseShareOption();
    } else {
      await Clipboard.write({
        string: this.publicUrl
      });
      await this.toastCtrl.presentToast("Lien copié au presse-papier", "success");
    }
  }

  async chooseShareOption() {
    const actionSheet = await this.actionSheetController.create({
      header: "Choisir option :",
      cssClass: "header_actionSheet",
      buttons: [
        {
          text: "Email",
          cssClass: "btn_actionSheet",
          icon: "mail-open-outline",
          handler: async () => {
            await this.shareReport("email");
          }
        },
        {
          text: "SMS",
          icon: "chatbox-ellipses-outline",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.shareReport("sms");
          }
        },
        {
          text: "Whatsapp",
          icon: "logo-whatsapp",
          cssClass: "btn_actionSheet",
          handler: async () => {
            await this.shareReport("whatsapp");
          }
        },
        {
          text: "Annuler",
          icon: "close-outline",
          role: "cancel",
          cssClass: "btn_actionSheet",
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  async openWhatsApp(phone: string, message: string) {
    const urlScheme = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    try {
      const canOpen = await AppLauncher.canOpenUrl({url: urlScheme});
      if (canOpen.value) {
        await AppLauncher.openUrl({url: urlScheme});
      } else {
        await Browser.open({url: webUrl});
      }
    } catch (err) {
      console.error("Error opening WhatsApp:", err);
      await Browser.open({url: webUrl});
    }
  }

  async openSMS(phone: string, body: string) {
    !phone.includes("+33") ? (phone = `+33${phone}`) : null;
    const url = `sms:${phone}?body=${encodeURIComponent(body)}`;
    try {
      const canOpen = await AppLauncher.canOpenUrl({url});
      if (canOpen.value) {
        await AppLauncher.openUrl({url});
      } else {
        console.warn("Cannot open SMS app");
      }
    } catch (err) {
      console.error("Error opening SMS app:", err);
    }
  }

  async openEmail(email: string, subject: string, body: string) {
    const logUrl = `${environment.url_web}/assets/img/logo-Ideo2.png`;
    try {
      EmailComposer.open({
        to: [email],
        subject: `Raport photos ${this.data.intervention_name}`,
        isHtml: true,
        body: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Mobile Blue Email</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      img {
        border: 0;
        display: block;
        max-width: 100%;
        height: auto;
      }
      @media screen and (max-width: 600px) {
        h1 {
          font-size: 24px !important;
        }
        p {
          font-size: 16px !important;
        }
        .button {
          padding: 14px 24px !important;
          font-size: 16px !important;
        }
      }
    </style>
  </head>
  
  <body style="margin: 0; padding: 0; background-color: #ddf5ff;">
    <center style="width: 100%; background-color: #ddf5ff;">
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 600px;">
        <!-- Header -->
        <tr>
          <td align="center" bgcolor="#ddf5ff" style="padding: 40px 10px;">
            <img src="${logUrl}" alt="Logo" width="200" height="200" style="display: block; margin: 0 auto;" />
          </td>
        </tr>
  
        <!-- Body -->
        <tr>
          <td bgcolor="#ffffff" style="padding: 30px 20px 40px 20px; text-align: left;">
            <p style="font-family: Arial, sans-serif; font-size: 18px; line-height: 1.6; color: #333;">
            Type de mission : ${this.data?.planning_type == "punctual" ? "Ponctuelle" : this.data?.planning_type == "regular" ? "Régulière" : "Forfaitaire"}
            <br><br>
            Mission : ${this.data?.intervention_name}
            <br><br>
            Date : ${this.data?.date || ""}
            <br><br>
            Prestation : ${this.data?.prestation || ""}
            <br><br>
            <a href="${body}" style="color: #007BFF; text-decoration: none;">Lien vers le rapport</a>
            </p>
            
          </td>
        </tr>
      </table>
    </center>
  </body>
  </html>
  `,
        attachments: [
          {
            type: "base64",
            path: "",
            name: ""
          }
        ]
      });
    } catch (error) {
      console.error(error);
    }
  }

  async shareReport(type: string) {
    if (!this.contact) {
      console.warn("No contact selected");
      return;
    }
    if (type === "email") {
      if (this.contact.email) {
        await this.openEmail(this.contact.email, "Rapport Photos", this.publicUrl);
      } else {
        console.warn("No email available for contact");
      }
    } else if (type === "sms") {
      if (this.contact.phone) {
        await this.openSMS(this.contact.phone, this.publicUrl);
      } else {
        console.warn("No phone number available for contact");
      }
    } else if (type === "whatsapp") {
      if (this.contact.phone) {
        await this.openWhatsApp(this.contact.phone, this.publicUrl);
      } else {
        console.warn("No phone number available for contact");
      }
    }
  }

  goBack() {
    this.location.back();
  }
}
