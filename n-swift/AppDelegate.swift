import UIKit
import Capacitor
import BackgroundTasks

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {

        // Init background location singleton
        _ = BackgroundLocationService.shared

        // Start GPS tracking on launch
        BackgroundLocationService.shared.startTracking()

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // app is about to go inactive (call, lock screen, etc)
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Ensure tracking continues in background
        BackgroundLocationService.shared.startTracking()
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Restart GPS when app enters foreground
        BackgroundLocationService.shared.startTracking()
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // app is active again, ensure GPS is still running
        BackgroundLocationService.shared.startTracking()
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // STOP tracking instead of restarting
        BackgroundLocationService.shared.stopTracking()
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(application,
                                                          continue: userActivity,
                                                          restorationHandler: restorationHandler)
    }
}
