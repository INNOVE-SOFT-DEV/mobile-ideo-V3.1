import Foundation
import CoreLocation
import Network

final class BackgroundLocationService: NSObject, CLLocationManagerDelegate {

    // MARK: - Singleton
    static let shared = BackgroundLocationService()

    // MARK: - Private properties
    private let locationManager = CLLocationManager()
    private let monitor = NWPathMonitor()
    private let monitorQueue = DispatchQueue(label: "gps.network.monitor")
    private let syncQueue = DispatchQueue(label: "gps.sync.queue")

    private var isSyncRunning = false

    private let QUEUE_KEY = "unsent_locations"
    private let serverURL = URL(string: "https://apideo.webo.tn/missions/auto_sync_gps")!

    // MARK: - Init
    private override init() {
        super.init()
        setupLocationManager()
        startNetworkMonitor()
        attemptInitialSync()
    }

    // MARK: - Setup
    private func setupLocationManager() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = 5.0
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.pausesLocationUpdatesAutomatically = false
        locationManager.requestAlwaysAuthorization()
    }

    // MARK: - Start / Stop
    func startTracking() {
        let status = CLLocationManager.authorizationStatus()
        if status == .authorizedAlways || status == .authorizedWhenInUse {
            locationManager.startUpdatingLocation()
            debugPrint("[BG_LOC] Started tracking")
        } else {
            locationManager.requestAlwaysAuthorization()
            debugPrint("[BG_LOC] Requested authorization")
        }
    }

    func stopTracking() {
        locationManager.stopUpdatingLocation()
        debugPrint("[BG_LOC] Stopped tracking")
    }

    // MARK: - CLLocationManagerDelegate
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        for loc in locations {
            onNewLocation(loc)
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        debugPrint("[BG_LOC] Location error: \(error)")
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = CLLocationManager.authorizationStatus()
        debugPrint("[BG_LOC] Authorization changed: \(status.rawValue)")
        if status == .authorizedAlways || status == .authorizedWhenInUse {
            startTracking()
        }
    }

    // MARK: - New Location
    private func onNewLocation(_ loc: CLLocation) {
        let timestampMs = Int64(Date().timeIntervalSince1970 * 1000)
        let item: [String: Any] = [
            "id": timestampMs,
            "lat": loc.coordinate.latitude,
            "lng": loc.coordinate.longitude,
            "acc": loc.horizontalAccuracy,
            "time": timestampMs
        ]

        queueLocation(item)
        broadcastLocation(item)

        if isOnline() {
            syncQueue.async { [weak self] in
                self?.syncQueueNow()
            }
        }
    }

    // MARK: - Queue Storage
    private func queueLocation(_ item: [String: Any]) {
        syncQueue.async { [weak self] in
            guard let self = self else { return }
            var queue = self.loadQueue()
            queue.append(item)
            self.saveQueue(queue)
            self.debugPrint("[BG_LOC] Queued. Total: \(queue.count)")
        }
    }

    private func loadQueue() -> [[String: Any]] {
        guard let data = UserDefaults.standard.data(forKey: QUEUE_KEY),
              let json = try? JSONSerialization.jsonObject(with: data) else {
            return []
        }
        return json as? [[String: Any]] ?? []
    }

    private func saveQueue(_ queue: [[String: Any]]) {
        guard let data = try? JSONSerialization.data(withJSONObject: queue) else {
            debugPrint("[BG_LOC] Failed to serialize queue")
            return
        }
        UserDefaults.standard.set(data, forKey: QUEUE_KEY)
    }

    private func clearQueue(ids: [Int64]) {
        syncQueue.async { [weak self] in
            guard let self = self else { return }
            let set = Set(ids)
            let remaining = self.loadQueue().filter {
                let v = $0["id"]
                let id = (v as? NSNumber)?.int64Value ?? (v as? Int64) ?? Int64(v as? Int ?? 0)
                return !set.contains(id)
            }
            self.saveQueue(remaining)
            self.debugPrint("[BG_LOC] Cleared. Remaining: \(remaining.count)")
        }
    }

    // MARK: - Broadcast
    private func broadcastLocation(_ item: [String: Any]) {
        NotificationCenter.default.post(
            name: Notification.Name("LOCATION_UPDATE"),
            object: nil,
            userInfo: item
        )
    }

    // MARK: - Network Monitor
    private func startNetworkMonitor() {
        monitor.pathUpdateHandler = { [weak self] path in
            guard let self = self else { return }
            if path.status == .satisfied {
                self.debugPrint("[BG_LOC] Online")
                self.syncQueue.async { [weak self] in
                    self?.syncQueueNow()
                }
            } else {
                self.debugPrint("[BG_LOC] Offline")
            }
        }
        monitor.start(queue: monitorQueue)
    }

    private func isOnline() -> Bool {
        monitor.currentPath.status == .satisfied
    }

    // MARK: - Token
    private func getAccessToken() -> String? {
        let defaults = UserDefaults.standard
        return defaults.string(forKey: "CapacitorStorage.token") ?? defaults.string(forKey: "CapacitorStorage.token")
    }

    // MARK: - Upload
    private func uploadBatch(_ batch: [[String: Any]], completion: @escaping (Bool) -> Void) {
        guard !batch.isEmpty else { completion(true); return }
        guard let token = getAccessToken() else {
            debugPrint("[BG_LOC] Missing token")
            completion(false)
            return
        }

        var request = URLRequest(url: serverURL)
        request.httpMethod = "POST"
        request.timeoutInterval = 15
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: batch)
        } catch {
            debugPrint("[BG_LOC] JSON error: \(error)")
            completion(false)
            return
        }

        URLSession.shared.dataTask(with: request) { [weak self] _, response, error in
            guard let self = self else { return }
            if let error = error {
                self.debugPrint("[BG_LOC] Upload error: \(error)")
                completion(false)
                return
            }
            if let http = response as? HTTPURLResponse {
                self.debugPrint("[BG_LOC] HTTP \(http.statusCode)")
                completion(200..<300 ~= http.statusCode)
            } else {
                self.debugPrint("[BG_LOC] No response")
                completion(false)
            }
        }.resume()
    }

    // MARK: - Sync Logic
    private func syncQueueNow() {
        if isSyncRunning { return }
        isSyncRunning = true

        guard isOnline() else {
            debugPrint("[BG_LOC] Cancel sync (offline)")
            isSyncRunning = false
            return
        }

        let snapshot = loadQueue()
        guard !snapshot.isEmpty else {
            debugPrint("[BG_LOC] Queue empty")
            isSyncRunning = false
            return
        }

        uploadBatch(snapshot) { [weak self] success in
            guard let self = self else { return }
            if success {
                let ids = snapshot.compactMap {
                    ($0["id"] as? NSNumber)?.int64Value ??
                    ($0["id"] as? Int64) ??
                    Int64($0["id"] as? Int ?? 0)
                }
                self.clearQueue(ids: ids)
            } else {
                self.debugPrint("[BG_LOC] Upload failed")
            }
            self.isSyncRunning = false
        }
    }

    // MARK: - Initial sync
    private func attemptInitialSync() {
        if isOnline() {
            syncQueue.async { [weak self] in
                self?.syncQueueNow()
            }
        }
    }

    // MARK: - Debug
    private func debugPrint(_ msg: String) {
        #if DEBUG
        print(msg)
        #endif
    }
}
