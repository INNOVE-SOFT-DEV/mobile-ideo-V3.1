package com.ideogroupev3.app.location;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.location.Location;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.location.*;

import org.json.JSONArray;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class BackgroundLocationService extends Service {

    public static final String TAG = "BG_LOC_SERVICE";
    public static final String ACTION_LOCATION = "com.ideogroupev3.app.LOCATION_UPDATE";
    private static final String ACTION_PROCESS_UPDATES = "com.ideogroupev3.app.PROCESS_UPDATES";

    private static final String PREFS_NAME = "BG_LOC_PREFS";
    private static final String QUEUE_KEY = "unsent_locations";

    private static final int LOCATION_NOTIFICATION_ID = 1001;

    private FusedLocationProviderClient fusedClient;
    private PendingIntent locationPendingIntent;

    private final AtomicBoolean syncRunning = new AtomicBoolean(false);
    private final Object queueLock = new Object();

    private BroadcastReceiver networkReceiver;

    private final ExecutorService syncExecutor = Executors.newSingleThreadExecutor();
    private ScheduledExecutorService periodicSyncExecutor;

    private SharedPreferences prefs;

    @Override
    public void onCreate() {
        super.onCreate();

        // 1️⃣ Immediately call startForeground with a minimal notification
        createNotificationChannelIfNeeded();
        Notification notification = new NotificationCompat.Builder(this, "location")
                .setContentTitle("Location Tracking")
                .setContentText("Initializing location service...")
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .build();

        // Use the correct foreground service type for Android 14+ (API 34+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(LOCATION_NOTIFICATION_ID, notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(LOCATION_NOTIFICATION_ID, notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
        } else {
            startForeground(LOCATION_NOTIFICATION_ID, notification);
        }

        // 2️⃣ Now initialize everything else
        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        fusedClient = LocationServices.getFusedLocationProviderClient(this);

        // 3️⃣ Check permissions and start location updates
        if (hasLocationPermission()) {
            requestLocationUpdates();
            registerNetworkReceiver();
            startPeriodicSync();
            Log.d(TAG, "BackgroundLocationService started successfully with location permissions");
        } else {
            Log.w(TAG, "Service started but location permissions not granted - waiting for permissions");
            updateLocationNotificationNoPerm();
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_PROCESS_UPDATES.equals(intent.getAction())) {
            LocationResult result = LocationResult.extractResult(intent);
            if (result != null) {
                for (Location location : result.getLocations()) {
                    onNewLocation(location);
                }
            }
        }
        return START_STICKY;
    }

    // ---------------------------------------------
    // LOCATION
    // ---------------------------------------------

    private void requestLocationUpdates() {
        if (!hasLocationPermission()) {
            Log.w(TAG, "Location permission missing, cannot start location updates");
            promptEnableLocationPermission();
            return; // Don't stop service, just don't track location
        }

        try {
            LocationRequest request = new LocationRequest.Builder(
                    Priority.PRIORITY_HIGH_ACCURACY,
                    300_000 // 5 minutes
            )
                    .setMinUpdateIntervalMillis(300_000)
                    .setMaxUpdateDelayMillis(300_000)
                    .setWaitForAccurateLocation(false)
                    .setMinUpdateDistanceMeters(30)
                    .build();

            fusedClient.requestLocationUpdates(request, getLocationPendingIntent());
            Log.d(TAG, "Location updates requested successfully");
        } catch (SecurityException e) {
            Log.e(TAG, "SecurityException while requesting location", e);
        }
    }

    private boolean hasLocationPermission() {
        boolean hasFineLocation = ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        boolean hasCoarseLocation = ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;

        // Just check basic location permissions (fine OR coarse)
        // Background location is optional - service will work in foreground mode without it
        return hasFineLocation || hasCoarseLocation;
    }

    private void promptEnableLocationPermission() {
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        Notification notification = new NotificationCompat.Builder(this, "location")
                .setContentTitle("Permission Required")
                .setContentText("Please enable location permission to continue tracking.")
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setOngoing(false)
                .build();
        if (nm != null) nm.notify(LOCATION_NOTIFICATION_ID + 2, notification);
    }

    private PendingIntent getLocationPendingIntent() {
        if (locationPendingIntent != null) return locationPendingIntent;

        Intent intent = new Intent(this, BackgroundLocationService.class);
        intent.setAction(ACTION_PROCESS_UPDATES);

        locationPendingIntent = PendingIntent.getService(
                this, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
        );
        return locationPendingIntent;
    }

    private void onNewLocation(Location loc) {
        try {
            JSONObject point = buildLocationObject(loc);

            queueLocation(point);
            broadcastLocation(point);
            updateLocationNotification(point);

            if (isOnline()) {
                syncExecutor.submit(this::syncQueue);
            }

            Log.d(TAG, "Location recorded: " + point.toString());

        } catch (Exception e) {
            Log.e(TAG, "onNewLocation error", e);
        }
    }

    private JSONObject buildLocationObject(Location loc) {
        JSONObject item = new JSONObject();
        try {
            item.put("latitude", loc.getLatitude());
            item.put("longitude", loc.getLongitude());

            SimpleDateFormat sdf = new SimpleDateFormat(
                    "yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US
            );
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            item.put("recorded_at", sdf.format(new Date(loc.getTime())));
        } catch (Exception ignored) {}
        return item;
    }

    private void broadcastLocation(JSONObject point) {
        try {
            Intent intent = new Intent(ACTION_LOCATION);
            intent.putExtra("data", point.toString());
            sendBroadcast(intent);
        } catch (Exception e) {
            Log.e(TAG, "broadcastLocation failed", e);
        }
    }

    // ---------------------------------------------
    // OFFLINE QUEUE
    // ---------------------------------------------

    private void queueLocation(JSONObject item) {
        synchronized (queueLock) {
            try {
                JSONArray queue = new JSONArray(prefs.getString(QUEUE_KEY, "[]"));
                queue.put(item);
                prefs.edit().putString(QUEUE_KEY, queue.toString()).apply();
            } catch (Exception e) {
                Log.e(TAG, "queueLocation failed", e);
            }
        }
    }

    private void syncQueue() {
        if (!syncRunning.compareAndSet(false, true)) return;

        try {
            JSONArray queue;
            synchronized (queueLock) {
                if (!isOnline()) return;
                queue = new JSONArray(prefs.getString(QUEUE_KEY, "[]"));
                if (queue.length() == 0) return;
            }

            if (uploadBatch(queue)) {
                synchronized (queueLock) {
                    prefs.edit().putString(QUEUE_KEY, "[]").apply();
                }
                Log.d(TAG, "Queue synced successfully, " + queue.length() + " locations uploaded");
            }

        } catch (Exception e) {
            Log.e(TAG, "syncQueue error", e);
        } finally {
            syncRunning.set(false);
        }
    }

    // ---------------------------------------------
    // NETWORK
    // ---------------------------------------------

    private boolean uploadBatch(JSONArray batch) {
        String token = getAccessToken();
        if (token == null || batch.length() == 0) return false;

        try {
            JSONObject body = new JSONObject();
            body.put("points", batch);

            java.net.URL url = new java.net.URL(
                    "https://ideo.webo.tn/api/v1/pointing_internals/auto_point"
            );
            java.net.HttpURLConnection conn =
                    (java.net.HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            try (java.io.OutputStream os = conn.getOutputStream()) {
                os.write(body.toString().getBytes(StandardCharsets.UTF_8));
            }

            int code = conn.getResponseCode();
            return code >= 200 && code < 300;

        } catch (Exception e) {
            Log.e(TAG, "uploadBatch failed", e);
            return false;
        }
    }

    private boolean isOnline() {
        ConnectivityManager cm =
                (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;

        Network net = cm.getActiveNetwork();
        if (net == null) return false;

        NetworkCapabilities caps = cm.getNetworkCapabilities(net);
        return caps != null &&
                (caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
                        || caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR));
    }

    private String getAccessToken() {
        SharedPreferences cap =
                getSharedPreferences("CapacitorStorage", MODE_PRIVATE);
        return cap.getString("access_token", null);
    }

    // ---------------------------------------------
    // PERIODIC SYNC
    // ---------------------------------------------

    private void startPeriodicSync() {
        periodicSyncExecutor = Executors.newSingleThreadScheduledExecutor();
        periodicSyncExecutor.scheduleAtFixedRate(() -> {
            if (isOnline()) {
                syncExecutor.submit(this::syncQueue);
            }
        }, 1, 1, TimeUnit.MINUTES);
    }

    // ---------------------------------------------
    // NOTIFICATIONS
    // ---------------------------------------------

    private void updateLocationNotification(JSONObject point) {
        try {
            String text =
                    "Lat: " + point.getDouble("latitude") +
                            "\nLng: " + point.getDouble("longitude") +
                            "\nAt: " + point.getString("recorded_at");

            Notification notification = new NotificationCompat.Builder(this, "location")
                    .setContentTitle("Location recorded")
                    .setContentText("Lat: " + point.getDouble("latitude")
                            + ", Lng: " + point.getDouble("longitude"))
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(text))
                    .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                    .setOngoing(true)
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .build();

            NotificationManager nm =
                    (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                nm.notify(LOCATION_NOTIFICATION_ID, notification);
            }

        } catch (Exception e) {
            Log.e(TAG, "updateLocationNotification failed", e);
        }
    }

    private void createNotificationChannelIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "location",
                    "Location Tracking",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Tracks your location in the background");
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) {
                nm.createNotificationChannel(channel);
            }
        }
    }

    private void updateLocationNotificationNoPerm() {
        try {
            Notification notification = new NotificationCompat.Builder(this, "location")
                    .setContentTitle("Location Service")
                    .setContentText("Waiting for location permissions")
                    .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                    .setOngoing(true)
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .build();

            NotificationManager nm =
                    (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                nm.notify(LOCATION_NOTIFICATION_ID, notification);
            }
        } catch (Exception e) {
            Log.e(TAG, "updateLocationNotificationNoPerm failed", e);
        }
    }

    // ---------------------------------------------
    // NETWORK RECEIVER
    // ---------------------------------------------

    private void registerNetworkReceiver() {
        networkReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context c, Intent i) {
                if (isOnline()) {
                    syncExecutor.submit(BackgroundLocationService.this::syncQueue);
                }
            }
        };
        registerReceiver(
                networkReceiver,
                new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION)
        );
    }

    @Override
    public void onDestroy() {
        if (fusedClient != null && locationPendingIntent != null) {
            fusedClient.removeLocationUpdates(locationPendingIntent);
        }
        if (networkReceiver != null) {
            try {
                unregisterReceiver(networkReceiver);
            } catch (Exception e) {
                Log.e(TAG, "Error unregistering network receiver", e);
            }
        }
        if (periodicSyncExecutor != null) periodicSyncExecutor.shutdownNow();
        syncExecutor.shutdownNow();

        Log.d(TAG, "BackgroundLocationService destroyed");
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}