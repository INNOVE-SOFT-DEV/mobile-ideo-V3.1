package com.ideogroupev3.app;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;
import com.ideogroupev3.app.location.BackgroundLocationService;

import android.Manifest;
import android.content.pm.PackageManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";
    private static final int REQUEST_LOCATION_PERMISSIONS = 100;
    private static final int REQUEST_BACKGROUND_LOCATION = 101;
    private static final int REQUEST_NOTIFICATION_PERMISSION = 102;

    // Flags to track if we've already asked for permissions
    private boolean hasAskedForLocation = false;
    private boolean hasAskedForBackgroundLocation = false;
    private boolean hasAskedForNotification = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView.setWebContentsDebuggingEnabled(true);

        Log.d(TAG, "onCreate called");

        // Register the plugin
        try {
            registerPlugin(LocationPlugin.class);
            Log.d(TAG, "LocationPlugin registered successfully");
        } catch (Exception e) {
            Log.e(TAG, "Failed to register LocationPlugin", e);
        }

        // Create notification channel for background service
        createNotificationChannel();
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume called");

        // Only request permissions on first resume
        requestPermissionsFlow();
    }

    /**
     * Step-by-step permission request flow - ask once only, never block user
     */
    private void requestPermissionsFlow() {
        // Step 1: Request basic location permissions (only once)
        if (!hasBasicLocationPermissions() && !hasAskedForLocation) {
            Log.d(TAG, "Requesting basic location permissions");
            hasAskedForLocation = true;
            requestBasicLocationPermissions();
            return; // Wait for result
        }

        // Step 2: Request background location if basic is granted (only once)
        if (hasBasicLocationPermissions()
                && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q
                && !hasBackgroundLocationPermission()
                && !hasAskedForBackgroundLocation) {
            Log.d(TAG, "Requesting background location permission");
            hasAskedForBackgroundLocation = true;
            requestBackgroundLocationPermission();
            return; // Wait for result
        }

        // Step 3: Request notification permission (only once)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && !hasNotificationPermission()
                && !hasAskedForNotification) {
            Log.d(TAG, "Requesting notification permission");
            hasAskedForNotification = true;
            requestNotificationPermission();
            return; // Wait for result
        }

        // Step 4: Start service with whatever permissions we have
        // If no location permission at all, just log and let app run normally
        if (hasBasicLocationPermissions()) {
            Log.d(TAG, "Starting location service with available permissions");
            startLocationServiceSafe();
        } else {
            Log.w(TAG, "No location permissions - app will run without background tracking");
        }
    }

    // ---------------------------------------------
    // PERMISSION CHECKS
    // ---------------------------------------------

    private boolean hasBasicLocationPermissions() {
        boolean fine = ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        boolean coarse = ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;

        return fine || coarse;
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private boolean hasBackgroundLocationPermission() {
        return ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    private boolean hasNotificationPermission() {
        return ContextCompat.checkSelfPermission(this,
                Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
    }

    // ---------------------------------------------
    // PERMISSION REQUESTS
    // ---------------------------------------------

    private void requestBasicLocationPermissions() {
        ActivityCompat.requestPermissions(this,
                new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                },
                REQUEST_LOCATION_PERMISSIONS);
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private void requestBackgroundLocationPermission() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION},
                REQUEST_BACKGROUND_LOCATION);
    }

    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    private void requestNotificationPermission() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.POST_NOTIFICATIONS},
                REQUEST_NOTIFICATION_PERMISSION);
    }

    // ---------------------------------------------
    // PERMISSION RESULTS
    // ---------------------------------------------

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        switch (requestCode) {
            case REQUEST_LOCATION_PERMISSIONS:
                handleLocationPermissionsResult(grantResults);
                break;

            case REQUEST_BACKGROUND_LOCATION:
                handleBackgroundLocationResult(grantResults);
                break;

            case REQUEST_NOTIFICATION_PERMISSION:
                handleNotificationPermissionResult(grantResults);
                break;
        }
    }

    private void handleLocationPermissionsResult(int[] grantResults) {
        boolean anyGranted = false;
        for (int result : grantResults) {
            if (result == PackageManager.PERMISSION_GRANTED) {
                anyGranted = true;
                break;
            }
        }

        if (anyGranted) {
            Log.d(TAG, "Location permissions granted - will request background access");
        } else {
            Log.w(TAG, "Location permissions denied - app will run without location tracking");
        }

        // Continue to next permission or finish
        requestPermissionsFlow();
    }

    private void handleBackgroundLocationResult(int[] grantResults) {
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "Background location granted - full tracking enabled");
        } else {
            Log.w(TAG, "Background location denied - location will only work when app is open");
        }

        // Continue to next permission or start service
        requestPermissionsFlow();
    }

    private void handleNotificationPermissionResult(int[] grantResults) {
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "Notification permission granted");
        } else {
            Log.w(TAG, "Notification permission denied - service will run silently");
        }

        // Finish permission flow - start service or just continue
        requestPermissionsFlow();
    }

    // ---------------------------------------------
    // SERVICE MANAGEMENT
    // ---------------------------------------------

    private void startLocationServiceSafe() {
        // Double-check we have at least basic location permissions
        if (!hasBasicLocationPermissions()) {
            Log.w(TAG, "Cannot start service without location permissions - skipping");
            return;
        }

        try {
            Intent intent = new Intent(this, BackgroundLocationService.class);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
                Log.d(TAG, "Started BackgroundLocationService as foreground service");
            } else {
                startService(intent);
                Log.d(TAG, "Started BackgroundLocationService");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to start BackgroundLocationService", e);
        }
    }

    // ---------------------------------------------
    // NOTIFICATION CHANNEL
    // ---------------------------------------------

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

            NotificationChannel channel = new NotificationChannel(
                    "location",
                    "Location Tracking",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Channel for background location tracking");
            channel.setShowBadge(false);

            if (nm != null) {
                nm.createNotificationChannel(channel);
                Log.d(TAG, "Notification channel created");
            }
        }
    }

    // ---------------------------------------------
    // LIFECYCLE LOGGING
    // ---------------------------------------------

    @Override
    public void onStart() {
        super.onStart();
        Log.d(TAG, "onStart called");
    }

    @Override
    public void onPause() {
        super.onPause();
        Log.d(TAG, "onPause called");
    }

    @Override
    public void onStop() {
        super.onStop();
        Log.d(TAG, "onStop called");
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy called");
    }
}