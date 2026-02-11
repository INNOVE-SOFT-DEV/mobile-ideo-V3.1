package com.ideogroupev3.app;

import android.content.*;
import android.os.Build;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.getcapacitor.*;

import org.json.JSONArray;

import java.io.File;
import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

public class LocationPlugin extends Plugin {

    private static final String TAG = "LocationPlugin";
    private BroadcastReceiver locationReceiver;

@PluginMethod
public void start(PluginCall call) {
    try {
        Context ctx = getContext();

        // Check location permissions first
        boolean hasFine = ContextCompat.checkSelfPermission(ctx, android.Manifest.permission.ACCESS_FINE_LOCATION) == android.content.pm.PackageManager.PERMISSION_GRANTED;
        boolean hasCoarse = ContextCompat.checkSelfPermission(ctx, android.Manifest.permission.ACCESS_COARSE_LOCATION) == android.content.pm.PackageManager.PERMISSION_GRANTED;
        boolean hasForeground = Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q
                ? ContextCompat.checkSelfPermission(ctx, android.Manifest.permission.FOREGROUND_SERVICE_LOCATION) == android.content.pm.PackageManager.PERMISSION_GRANTED
                : true;

        if (!hasFine && !hasCoarse) {
            call.reject("Location permission not granted");
            return;
        }
        if (!hasForeground) {
            call.reject("Foreground service location permission not granted");
            return;
        }

        // Permissions OK, start service
        Intent intent = new Intent(ctx, com.ideogroupev3.app.location.BackgroundLocationService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ctx.startForegroundService(intent);
        } else {
            ctx.startService(intent);
        }

        Log.d(TAG, "start service requested");
        call.resolve();
    } catch (Exception ex) {
        Log.e(TAG, "start error: " + ex.getMessage(), ex);
        call.reject("start_failed");
    }
}


    @PluginMethod
    public void stop(PluginCall call) {
        try {
            Context ctx = getContext();
            Intent intent = new Intent(ctx, com.ideogroupev3.app.location.BackgroundLocationService.class);
            ctx.stopService(intent);
            Log.d(TAG, "stop service requested");
            call.resolve();
        } catch (Exception ex) {
            Log.e(TAG, "stop error: " + ex.getMessage(), ex);
            call.reject("stop_failed");
        }
    }

    @SuppressWarnings("unused")
    @PluginMethod
    public void getHistory(PluginCall call) {
        try {
            File file = new File(getContext().getExternalFilesDir(null), "locations.json");
            String data = "[]";
            if (file.exists()) {
                try (FileInputStream fis = new FileInputStream(file);
                     ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                    byte[] buffer = new byte[1024];
                    int read;
                    while ((read = fis.read(buffer)) != -1) {
                        bos.write(buffer, 0, read);
                    }
                    data = bos.toString(StandardCharsets.UTF_8.name());
                }
            }
            JSObject ret = new JSObject();
            ret.put("history", data);
            call.resolve(ret);
            Log.d(TAG, "getHistory returned length=" + new JSONArray(data).length());
        } catch (Exception ex) {
            Log.e(TAG, "getHistory error: " + ex.getMessage(), ex);
            call.reject("get_history_failed");
        }
    }

    @SuppressWarnings("unused")
    @PluginMethod
    public void clearHistory(PluginCall call) {
        try {
            File file = new File(getContext().getExternalFilesDir(null), "locations.json");
            if (file.exists()) {
                if (!file.delete()) {
                    Log.w(TAG, "Failed to delete history file");
                }
            }
            Log.d(TAG, "clearHistory executed");
            call.resolve();
        } catch (Exception ex) {
            Log.e(TAG, "clearHistory error: " + ex.getMessage(), ex);
            call.reject("clear_failed");
        }
    }

    @Override
    public void handleOnStart() {
        super.handleOnStart();
        // register broadcast receiver to forward events to JS while app is running
        if (locationReceiver == null) {
            locationReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    try {
                        String payload = intent.getStringExtra("payload");
                        JSObject data = new JSObject();
                        data.put("location", payload);
                        notifyListeners("locationUpdate", data);
                        Log.d(TAG, "Forwarded locationUpdate to JS");
                    } catch (Exception ex) {
                        Log.e(TAG, "onReceive error: " + ex.getMessage(), ex);
                    }
                }
            };
            IntentFilter filter = new IntentFilter(com.ideogroupev3.app.location.BackgroundLocationService.ACTION_LOCATION);
            ContextCompat.registerReceiver(getContext(), locationReceiver, filter, ContextCompat.RECEIVER_NOT_EXPORTED);
            Log.d(TAG, "locationReceiver registered");
        }
    }

    @Override
    public void handleOnStop() {
        super.handleOnStop();
        // unregister receiver
        if (locationReceiver != null) {
            try {
                getContext().unregisterReceiver(locationReceiver);
                locationReceiver = null;
                Log.d(TAG, "locationReceiver unregistered");
            } catch (Exception ex) {
                Log.e(TAG, "unregister error: " + ex.getMessage(), ex);
            }
        }
    }
}
