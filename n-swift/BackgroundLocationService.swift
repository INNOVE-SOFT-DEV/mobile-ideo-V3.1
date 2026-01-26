import Foundation
import CoreLocation
import Network
import UIKit

final class BackgroundLocationService: NSObject, CLLocationManagerDelegate {

    // MARK: - Singleton
    static let shared = BackgroundLocationService()

    // MARK: - Private properties
    private let locationManager = CLLocationManager()
    private let monitor = NWPathMonitor()
    private let monitorQueue = DispatchQueue(label: "gps.network.monitor")
    private let syncQueue = DispatchQueue(label: "gps.sync.queue")
    private var timer: Timer?

    private var isSyncRunning = false
    private let QUEUE_KEY = "unsent_locations"
    private let serverURL = URL(string: "https://ideo.webo.tn/api/v1/pointing_internals/auto_point")!
    private let alwaysRequestedKey = "bg_loc.always_requested"

    // Failsafe region
    private let REGION_ID = "DYNAMIC_GEOFENCE"
    private let REGION_RADIUS: CLLocationDistance = 120

    // MARK: - Init
    private override init() {
        super.init()
        setupLocationManager()
        startNetworkMonitor()
        clearAllRegions()
        startSyncTimer()
        attemptInitialSync()
    }

    // MARK: - Setup
    private func setupLocationManager() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation
        locationManager.distanceFilter = 1
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.pausesLocationUpdatesAutomatically = false
       // locationManager.showsBackgroundLocationIndicator = true
        locationManager.activityType = .otherNavigation
        locationManager.requestAlwaysAuthorization()
    }

    // MARK: - Start / Stop
    func startTracking() {
        let status: CLAuthorizationStatus
        if #available(iOS 14.0, *) {
            status = locationManager.authorizationStatus
        } else {
            status = CLLocationManager.authorizationStatus()
        }

        switch status {
        case .notDetermined:
            locationManager.requestWhenInUseAuthorization()
            debugPrint("[BG_LOC] Requested When-In-Use authorization")
        case .authorizedWhenInUse:
            requestAlwaysIfNeeded()
            locationManager.startUpdatingLocation()
            debugPrint("[BG_LOC] Started foreground tracking (WhenInUse)")
        case .authorizedAlways:
            locationManager.startUpdatingLocation()
            locationManager.startMonitoringSignificantLocationChanges()
            debugPrint("[BG_LOC] Started background-capable tracking (Always)")
        case .denied, .restricted:
            presentSettingsAlert(
                title: "Location Access Needed",
                message: "To track your location in the background, enable \"Always\" in Settings > Privacy & Security > Location Services."
            )
            debugPrint("[BG_LOC] Authorization denied or restricted")
        @unknown default:
            break
        }

        handleAccuracyAuthorization()
    }

    func stopTracking() {
        locationManager.stopUpdatingLocation()
        locationManager.stopMonitoringSignificantLocationChanges()
        timer?.invalidate()
        debugPrint("[BG_LOC] Stopped tracking")
    }

    // MARK: - Clear All Regions
    private func clearAllRegions() {
        for region in locationManager.monitoredRegions {
            locationManager.stopMonitoring(for: region)
        }
        debugPrint("[GEOFENCE] Cleared all regions")
    }

    // MARK: - CLLocationManagerDelegate
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard !locations.isEmpty else { return }
        for loc in locations { onNewLocation(loc) }
        if locationManager.monitoredRegions.isEmpty {
            createRegion(from: locations.last!)
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        debugPrint("[BG_LOC] Location error: \(error)")
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        startTracking()
    }

    func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
        debugPrint("[GEOFENCE] Exited region")
        manager.stopMonitoring(for: region)
        manager.requestLocation()
        let timestamp = ISO8601DateFormatter().string(from: Date())
        broadcastLocation(["event": "EXIT_GEOFENCE", "recorded_at": timestamp])
    }

    // MARK: - Geofence
    private func createRegion(from location: CLLocation) {
        guard CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self) else { return }
        let region = CLCircularRegion(center: location.coordinate, radius: REGION_RADIUS, identifier: REGION_ID)
        region.notifyOnEntry = false
        region.notifyOnExit = true
        locationManager.startMonitoring(for: region)
        debugPrint("[GEOFENCE] Region created at \(location.coordinate)")
    }

    // MARK: - New Location Handling
    private func onNewLocation(_ loc: CLLocation) {
        let recordedAt = ISO8601DateFormatter().string(from: Date())
        let item: [String: Any] = [
            "latitude": loc.coordinate.latitude,
            "longitude": loc.coordinate.longitude,
            "recorded_at": recordedAt
        ]
        queueLocation(item)
        broadcastLocation(item)
    }

    // MARK: - Queue Logic
    private func queueLocation(_ item: [String: Any]) {
        syncQueue.async {
            var queue = self.loadQueue()
            if !queue.contains(where: {
                ($0["latitude"] as? Double) == (item["latitude"] as? Double) &&
                ($0["longitude"] as? Double) == (item["longitude"] as? Double) &&
                ($0["recorded_at"] as? String) == (item["recorded_at"] as? String)
            }) {
                queue.append(item)
                self.saveQueue(queue)
                self.debugPrint("[BG_LOC] Queued \(queue.count) items")
            } else {
                self.debugPrint("[BG_LOC] Duplicate location skipped")
            }
        }
    }

    private func loadQueue() -> [[String: Any]] {
        guard let data = UserDefaults.standard.data(forKey: QUEUE_KEY),
              let json = try? JSONSerialization.jsonObject(with: data) else { return [] }
        return json as? [[String: Any]] ?? []
    }

    private func saveQueue(_ queue: [[String: Any]]) {
        guard let data = try? JSONSerialization.data(withJSONObject: queue) else { return }
        UserDefaults.standard.set(data, forKey: QUEUE_KEY)
    }

    private func clearQueue() {
        saveQueue([])
        debugPrint("[BG_LOC] Queue cleared")
    }

    // MARK: - Broadcast
    private func broadcastLocation(_ item: [String: Any]) {
        NotificationCenter.default.post(name: Notification.Name("LOCATION_UPDATE"), object: nil, userInfo: item)
    }

    // MARK: - Network
    private func startNetworkMonitor() {
        monitor.pathUpdateHandler = { [weak self] path in
            guard let self = self else { return }
            if path.status == .satisfied {
                self.syncQueue.async { self.syncQueueNow() }
            }
        }
        monitor.start(queue: monitorQueue)
    }

    private func isOnline() -> Bool {
        monitor.currentPath.status == .satisfied
    }

    // MARK: - Upload / Sync
    private func getAccessToken() -> String? {
        UserDefaults.standard.string(forKey: "CapacitorStorage.access_token")
    }

    private func uploadBatch(_ batch: [[String: Any]], completion: @escaping (Bool) -> Void) {
        guard !batch.isEmpty, let token = getAccessToken() else { completion(false); return }

        let body: [String: Any] = ["points": batch]
        guard let httpBody = try? JSONSerialization.data(withJSONObject: body) else {
            debugPrint("[BG_LOC] Failed to encode body")
            completion(false)
            return
        }

        var request = URLRequest(url: serverURL)
        request.httpMethod = "POST"
        request.timeoutInterval = 15
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.httpBody = httpBody

        debugPrint("[BG_LOC] Uploading batch: \(String(data: httpBody, encoding: .utf8) ?? "")")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                self.debugPrint("[BG_LOC] Upload error: \(error)")
                completion(false)
                return
            }
            if let http = response as? HTTPURLResponse {
                let responseBody = data.flatMap { String(data: $0, encoding: .utf8) } ?? ""
                self.debugPrint("[BG_LOC] Upload response code: \(http.statusCode)")
                self.debugPrint("[BG_LOC] Response body: \(responseBody)")
                completion(200..<300 ~= http.statusCode)
                return
            }
            completion(false)
        }.resume()
    }

    private func syncQueueNow() {
        if isSyncRunning { return }
        isSyncRunning = true
        defer { isSyncRunning = false }

        guard isOnline() else {
            debugPrint("[BG_LOC] Sync skipped, offline")
            return
        }

        let snapshot = loadQueue()
        guard !snapshot.isEmpty else {
            debugPrint("[BG_LOC] Sync skipped, queue empty")
            return
        }

        debugPrint("[BG_LOC] Timer triggered, syncing queue")
        uploadBatch(snapshot) { success in
            self.debugPrint("[BG_LOC] Sync finished, success: \(success)")
            if success { self.clearQueue() }
        }
    }

    private func attemptInitialSync() {
        if isOnline() { syncQueue.async { self.syncQueueNow() } }
    }

    // MARK: - Timer
    private func startSyncTimer() {
        DispatchQueue.main.async {
            self.timer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { _ in
                self.syncQueue.async { self.syncQueueNow() }
            }
            self.debugPrint("[BG_LOC] 1-minute sync timer started")
        }
    }

    // MARK: - Authorization Helpers
    private func requestAlwaysIfNeeded() {
        let alreadyRequested = UserDefaults.standard.bool(forKey: alwaysRequestedKey)
        guard !alreadyRequested else { return }
        UserDefaults.standard.set(true, forKey: alwaysRequestedKey)
        locationManager.requestAlwaysAuthorization()
    }

    private func handleAccuracyAuthorization() {
        if #available(iOS 14.0, *) {
            if locationManager.accuracyAuthorization == .reducedAccuracy {
                locationManager.requestTemporaryFullAccuracyAuthorization(withPurposeKey: "PreciseLocation") { [weak self] error in
                    if let error = error {
                        self?.debugPrint("[BG_LOC] Full accuracy request error: \(error)")
                    } else {
                        self?.debugPrint("[BG_LOC] Requested temporary full accuracy")
                    }
                }
            }
        }
    }

    // MARK: - UI Helpers
    private func presentSettingsAlert(title: String, message: String) {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
            alert.addAction(UIAlertAction(title: "Open Settings", style: .default, handler: { _ in
                if let url = URL(string: UIApplication.openSettingsURLString) {
                    UIApplication.shared.open(url)
                }
            }))
            self.topMostViewController()?.present(alert, animated: true)
        }
    }

    private func topMostViewController() -> UIViewController? {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = scene.windows.first(where: { $0.isKeyWindow }),
              var top = window.rootViewController else { return nil }
        while let presented = top.presentedViewController {
            top = presented
        }
        return top
    }

    // MARK: - Debug
    private func debugPrint(_ msg: String) {
        #if DEBUG
        print(msg)
        #endif
    }
}
