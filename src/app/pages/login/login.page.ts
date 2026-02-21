import {Component, OnInit} from "@angular/core";
import {AuthService} from "./service/auth.service";
import {Router} from "@angular/router";
import {ToastControllerService} from "src/app/widgets/toast-controller/toast-controller.service";
import {Device} from "@capacitor/device";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: false
})
export class LoginPage implements OnInit {
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  email: string = "";
  password: string = "";
  loading: boolean = false;

  deviceInfo: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastControllerService
  ) {}

  async ngOnInit() {
    try {
      const info = await Device.getInfo();
      const id = await Device.getId();
   

      this.deviceInfo = {
        device_id: id.identifier,
        platform: info.platform,
        model: info.model,
        operating_system: info.operatingSystem,
        os_version: info.osVersion,
        manufacturer: info.manufacturer,
        is_virtual: info.isVirtual,
        web_view_version: info.webViewVersion || ""
      };
    } catch (error) {
      console.error("Failed to get device info", error);
      this.deviceInfo = {};
    }
  }

  onSubmit() {
    this.loading = true;

    const payload = {
      email: this.email,
      password: this.password,
      ...this.deviceInfo
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.router.navigate(["/tabs/tab1"]);
        this.loading = false;
      },
      error: async error => {
        console.error(error);
        await this.toastController.presentToast(error.error?.error || "Erreur inconnue", "danger");
        this.loading = false;
      }
    });
  }
}
