package com.ideogroupev3.app.location;

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
import android.location.Location;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

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

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
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

    // ------------------------------------------------------------------------

    @Override
    public void onCreate() {
        super.onCreate();

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        fusedClient = LocationServices.getFusedLocationProviderClient(this);

        createNotificationChannelIfNeeded();
        startForeground(LOCATION_NOTIFICATION_ID, createNotification("Waiting for location..."));

        requestLocationUpdates();
        registerNetworkReceiver();
        startPeriodicSync();

        Log.d(TAG, "BackgroundLocationService started");
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

    // ------------------------------------------------------------------------
    // LOCATION
    // ------------------------------------------------------------------------

    private void requestLocationUpdates() {
        try {
            LocationRequest request = new LocationRequest.Builder(
                    Priority.PRIORITY_HIGH_ACCURACY,
                    60000 // 1 minute
            )
                    .setMinUpdateIntervalMillis(60000)
                    .setMaxUpdateDelayMillis(60000)
                    .setWaitForAccurateLocation(false)
                    .build();

            fusedClient.requestLocationUpdates(request, getLocationPendingIntent());
        } catch (SecurityException e) {
            Log.e(TAG, "Missing location permission", e);
            stopSelf();
        }
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
    private void broadcastLocation(JSONObject point) {
        try {
            Intent intent = new Intent(ACTION_LOCATION);
            intent.putExtra("data", point.toString());
            sendBroadcast(intent);

            Log.d(TAG, "Location broadcasted");
        } catch (Exception e) {
            Log.e(TAG, "broadcastLocation failed", e);
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

    // ------------------------------------------------------------------------
    // OFFLINE QUEUE
    // ------------------------------------------------------------------------

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
}


private void saveQueueToFile(JSONArray queue) {
    try {
        String filename = "queue.json";
        String data = queue.toString();
        File file = new File(getFilesDir(), filename);
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(data.getBytes(StandardCharsets.UTF_8));
        }
        Log.i(TAG, "Queue file written to " + file.getAbsolutePath());
    } catch (Exception e) {
        Log.e(TAG, "Failed to save queue", e);
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
                    Log.d(TAG, "Queue synced and cleared");
                }
            }

        } catch (Exception e) {
            Log.e(TAG, "syncQueue error", e);
        } finally {
            syncRunning.set(false);
        }
    }

    // ------------------------------------------------------------------------
    // NETWORK
    // ------------------------------------------------------------------------

    private boolean uploadBatch(JSONArray batch) {
        String token = getAccessToken();
        if (token == null || batch.length() == 0) return false;

        try {
            JSONObject body = new JSONObject();
            body.put("points", batch);

            Log.d(TAG, "Uploading payload: " + body.toString());

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
            Log.d(TAG, "Upload response code: " + code);

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

    // ------------------------------------------------------------------------
    // PERIODIC SYNC (EVERY MINUTE)
    // ------------------------------------------------------------------------

    private void startPeriodicSync() {
        periodicSyncExecutor = Executors.newSingleThreadScheduledExecutor();
        periodicSyncExecutor.scheduleAtFixedRate(() -> {
            if (isOnline()) {
                Log.d(TAG, "Periodic sync triggered");
                syncExecutor.submit(this::syncQueue);
            }
        }, 1, 1, TimeUnit.MINUTES);
    }

    // ------------------------------------------------------------------------
    // NOTIFICATIONS
    // ------------------------------------------------------------------------

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
            nm.notify(LOCATION_NOTIFICATION_ID, notification);

        } catch (Exception e) {
            Log.e(TAG, "updateLocationNotification failed", e);
        }
    }

    private Notification createNotification(String text) {
        return new NotificationCompat.Builder(this, "location")
                .setContentTitle("Location tracking active")
                .setContentText(text)
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    private void createNotificationChannelIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "location",
                    "Location Tracking",
                    NotificationManager.IMPORTANCE_LOW
            );
            getSystemService(NotificationManager.class)
                    .createNotificationChannel(channel);
        }
    }

    // ------------------------------------------------------------------------
    // NETWORK RECEIVER
    // ------------------------------------------------------------------------

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

    // ------------------------------------------------------------------------

    @Override
    public void onDestroy() {
        if (fusedClient != null && locationPendingIntent != null) {
            fusedClient.removeLocationUpdates(locationPendingIntent);
        }
        if (networkReceiver != null) unregisterReceiver(networkReceiver);
        if (periodicSyncExecutor != null) periodicSyncExecutor.shutdownNow();
        syncExecutor.shutdownNow();
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
