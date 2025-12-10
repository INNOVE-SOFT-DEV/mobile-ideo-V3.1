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
import java.util.HashSet;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
public class BackgroundLocationService extends Service {

    public static final String TAG = "BG_LOC_SERVICE";
    public static final String ACTION_LOCATION = "com.ideogroupev3.app.LOCATION_UPDATE";
    private static final String ACTION_PROCESS_UPDATES = "com.ideogroupev3.app.PROCESS_UPDATES";

    private FusedLocationProviderClient fusedClient;
    private PendingIntent locationPendingIntent;

    private final AtomicBoolean syncRunning = new AtomicBoolean(false);
    private final Object queueLock = new Object();
    private BroadcastReceiver networkReceiver;
    private final ExecutorService syncExecutor = Executors.newSingleThreadExecutor();

    private SharedPreferences prefs;
    private static final String PREFS_NAME = "BG_LOC_PREFS";
    private static final String QUEUE_KEY = "unsent_locations";

    @Override
    public void onCreate() {
        super.onCreate();

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        fusedClient = LocationServices.getFusedLocationProviderClient(this);

        createNotificationChannelIfNeeded();
        requestLocationUpdates();
        registerNetworkReceiver();

        Log.d(TAG, "Service onCreate and initialized");

        // Attempt initial sync if online
        if (isOnline()) {
            syncExecutor.submit(this::syncQueue);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand received");

        startForeground(1001, createNotification());

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


    private void requestLocationUpdates() {
        try {
            Log.d(TAG, "Requesting location updates");
            fusedClient.requestLocationUpdates(createLocationRequest(), getLocationPendingIntent());
        } catch (SecurityException ex) {
            Log.e(TAG, "Missing location permission. Could not request updates.", ex);
            stopSelf();
        }
    }

    private LocationRequest createLocationRequest() {
        return new LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 30000) // 30 second interval
                .setMinUpdateDistanceMeters(5) // 5 meters displacement
                .build();
    }

    private PendingIntent getLocationPendingIntent() {
        if (locationPendingIntent != null) {
            return locationPendingIntent;
        }
        Intent intent = new Intent(this, BackgroundLocationService.class);
        intent.setAction(ACTION_PROCESS_UPDATES);
        locationPendingIntent = PendingIntent.getService(
                this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
        return locationPendingIntent;
    }

    private void onNewLocation(Location loc) {
        Log.d(TAG, "New location: " + loc.getLatitude() + ", " + loc.getLongitude());
        try {
            JSONObject item = buildLocationObject(loc);
            queueLocation(item);
            broadcastLocation(item);
            // Trigger a sync if online. The sync itself is debounced.
            if (isOnline()) {
                syncExecutor.submit(this::syncQueue);
            }
        } catch (Exception e) {
            Log.e(TAG, "onNewLocation error", e);
        }
    }

    private void createNotificationChannelIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "location", "Location Tracking", NotificationManager.IMPORTANCE_LOW);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
    }

    private Notification createNotification() {
        return new NotificationCompat.Builder(this, "location")
                .setContentTitle("Location tracking")
                .setContentText("Tracking location in background")
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    private JSONObject buildLocationObject(Location loc) {
        JSONObject item = new JSONObject();
        try {
            item.put("id", System.currentTimeMillis());
            item.put("lat", loc.getLatitude());
            item.put("lng", loc.getLongitude());
            item.put("acc", loc.getAccuracy());
            item.put("time", System.currentTimeMillis());
        } catch (Exception ignored) {}
        return item;
    }

    private void queueLocation(JSONObject item) {
    synchronized (queueLock) {
        try {
            JSONArray queue = new JSONArray(prefs.getString(QUEUE_KEY, "[]"));
            queue.put(item);
            prefs.edit().putString(QUEUE_KEY, queue.toString()).apply();

            // 🔹 Écriture dans fichier pour Ionic
            saveQueueToFile(queue);

            Log.d(TAG, "Queued item. Total555: " + queue.length());
        } catch (Exception e) {
            Log.e(TAG, "queueLocation failed", e);
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






    private void broadcastLocation(JSONObject item) {
        Intent i = new Intent(ACTION_LOCATION);
        i.putExtra("payload", item.toString());
        sendBroadcast(i);
    }

    private boolean isOnline() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        Network network = cm.getActiveNetwork();
        if (network == null) return false;
        NetworkCapabilities capabilities = cm.getNetworkCapabilities(network);
        return capabilities != null && (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) || capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR));
    }

    private String getAccessToken() {
        SharedPreferences capacitorPrefs = getApplicationContext().getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String token = capacitorPrefs.getString("token", null);
        if (token == null) token = capacitorPrefs.getString("access_token", null);
        return token;
    }

    private boolean uploadBatch(JSONArray batch) {
        String token = getAccessToken();
        if (token == null) {
            Log.w(TAG, "Cannot upload batch: no token available");
            return false;
        }
        if (batch.length() == 0) {
            return true; // Nothing to upload
        }

        try {
            java.net.URL url = new java.net.URL("https://apideo.webo.tn/missions/auto_sync_gps");
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(15000);
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String payload = batch.toString();
            Log.d(TAG, "Uploading batch of " + batch.length() + " items.");

            try (java.io.OutputStream os = conn.getOutputStream()) {
                os.write(payload.getBytes(StandardCharsets.UTF_8));
            }
            int code = conn.getResponseCode();
            Log.d(TAG, "Upload batch response code: " + code);
            return code >= 200 && code < 300;
        } catch (Exception e) {
            Log.e(TAG, "uploadBatch failed", e);
            return false;
        }
    }

    private void syncQueue() {
        if (!syncRunning.compareAndSet(false, true)) {
            Log.d(TAG, "Sync already running, skipping.");
            return;
        }

        JSONArray queueToUpload;

        try {
            synchronized (queueLock) {
                if (!isOnline()) {
                    return;
                }
                String queueString = prefs.getString(QUEUE_KEY, "[]");
                queueToUpload = new JSONArray(queueString);
                if (queueToUpload.length() == 0) {
                    return; // Nothing to sync
                }
            }

            boolean success = uploadBatch(queueToUpload);

            if (success) {
                // If upload was successful, remove the sent items from the master queue
                synchronized (queueLock) {
                    JSONArray masterQueue = new JSONArray(prefs.getString(QUEUE_KEY, "[]"));
                    JSONArray newQueue = new JSONArray();
                    HashSet<Long> sentIds = new HashSet<>();
                    for (int i = 0; i < queueToUpload.length(); i++) {
                        sentIds.add(queueToUpload.getJSONObject(i).getLong("id"));
                    }
                    for (int i = 0; i < masterQueue.length(); i++) {
                        if (!sentIds.contains(masterQueue.getJSONObject(i).getLong("id"))) {
                            newQueue.put(masterQueue.getJSONObject(i));
                        }
                    }
                    prefs.edit().putString(QUEUE_KEY, newQueue.toString()).apply();
                    Log.d(TAG, "Batch upload successful. New queue size: " + newQueue.length());
                }
            } else {
                Log.w(TAG, "Batch upload failed. Items remain in queue.");
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception during syncQueue", e);
        } finally {
            syncRunning.set(false);
        }
    }


    private void registerNetworkReceiver() {
        if (networkReceiver != null) return;
        networkReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (isOnline()) {
                    Log.d(TAG, "Network is back online. Triggering sync.");
                    syncExecutor.submit(BackgroundLocationService.this::syncQueue);
                }
            }
        };
        registerReceiver(networkReceiver, new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION));
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.w(TAG, "Service destroyed. Cleaning up.");
        if (fusedClient != null && locationPendingIntent != null) {
            fusedClient.removeLocationUpdates(locationPendingIntent);
        }
        if (networkReceiver != null) {
            unregisterReceiver(networkReceiver);
        }
        syncExecutor.shutdownNow();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
