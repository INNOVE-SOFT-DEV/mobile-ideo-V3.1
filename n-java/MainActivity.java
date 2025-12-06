package com.ideogroupev3.app;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.util.Log;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";

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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel channel = new NotificationChannel(
                    "location",
                    "Location Tracking",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Channel for background location tracking");
            if (nm != null) nm.createNotificationChannel(channel);
        }

        // ✅ Start the background location service automatically
        try {
            Intent intent = new Intent(this, com.ideogroupev3.app.location.BackgroundLocationService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
            } else {
                startService(intent);
            }
            Log.d(TAG, "BackgroundLocationService started automatically");
        } catch (Exception e) {
            Log.e(TAG, "Failed to start BackgroundLocationService automatically", e);
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        Log.d(TAG, "onStart called");
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume called");
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
