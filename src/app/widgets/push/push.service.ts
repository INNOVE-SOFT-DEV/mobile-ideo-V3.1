import {Injectable} from "@angular/core";
// import {PushNotifications, Token, PushNotificationSchema, ActionPerformed} from "@capacitor/push-notifications";

@Injectable({
  providedIn: "root"
})
export class PushService {
  constructor() {}

  initPush() {
    // PushNotifications.requestPermissions().then(result => {
    //   if (result.receive === "granted") {
    //     PushNotifications.register();
    //   }
    // });

    // PushNotifications.addListener("registration", (token: Token) => {
    //   console.log("🔥 FCM Token:", token.value);
    // });

    // PushNotifications.addListener("registrationError", err => {
    //   console.error("Erreur FCM:", err);
    // });

    // PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
    //   console.log("📩 Notification reçue", notification);
    // });

    // PushNotifications.addListener("pushNotificationActionPerformed", (notification: ActionPerformed) => {
    //   console.log("👉 Notification cliquée", notification);
    // });
  }
}
