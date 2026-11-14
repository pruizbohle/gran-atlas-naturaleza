package __PACKAGE__;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

/**
 * Save a JSON backup with Android ACTION_CREATE_DOCUMENT.
 * A large JSON payload must not remain in a pending PluginCall while the
 * Android document picker is open; it may exceed the system state parcel limit.
 * New clients stage the file in the app-private cache and send only cacheName.
 */
@CapacitorPlugin(name = "AtlasExport")
public class AtlasExportPlugin extends Plugin {
    private static final int MAX_BYTES = 4 * 1024 * 1024;
    private static final Pattern SAFE_NAME = Pattern.compile("[a-zA-Z0-9._-]{1,120}\\.json");
    private static final Pattern SAFE_CACHE = Pattern.compile("atlas-export-[0-9]{13}-[a-z0-9]{1,16}\\.json");

    private File stagedFile(PluginCall call) {
        String cacheName = call.getString("cacheName");
        if (cacheName == null || !SAFE_CACHE.matcher(cacheName).matches()) return null;
        return new File(getContext().getCacheDir(), cacheName);
    }

    private void removeStagedFile(PluginCall call) {
        File staged = stagedFile(call);
        if (staged != null && staged.isFile()) staged.delete();
    }

    @PluginMethod
    public void saveFile(PluginCall call) {
        String name = call.getString("name");
        String cacheName = call.getString("cacheName");
        String content = call.getString("content"); // Legacy callers only.
        File staged = stagedFile(call);
        if (name == null || !SAFE_NAME.matcher(name).matches()) {
            call.reject("Nombre de archivo inválido");
            return;
        }
        if (cacheName != null) {
            if (staged == null || !staged.isFile() || staged.length() < 1 || staged.length() > MAX_BYTES) {
                call.reject("El respaldo temporal no existe o supera los 4 MB");
                return;
            }
        } else if (content == null || content.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES) {
            call.reject("Archivo inválido o demasiado grande");
            return;
        }

        Intent request = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        request.addCategory(Intent.CATEGORY_OPENABLE);
        request.setType("application/json");
        request.putExtra(Intent.EXTRA_TITLE, name);
        try {
            startActivityForResult(call, request, "afterCreateDocument");
        } catch (Exception e) {
            removeStagedFile(call);
            call.reject("No se pudo abrir el selector de archivos", e);
        }
    }

    @ActivityCallback
    private void afterCreateDocument(PluginCall call, ActivityResult result) {
        if (call == null) return;
        try {
            if (result.getResultCode() != Activity.RESULT_OK
                    || result.getData() == null || result.getData().getData() == null) {
                call.reject("Guardado cancelado", "CANCELLED");
                return;
            }
            Uri uri = result.getData().getData();
            File staged = stagedFile(call);
            try (OutputStream output = getContext().getContentResolver().openOutputStream(uri, "wt")) {
                if (output == null) throw new IllegalStateException("No se pudo abrir el destino");
                if (call.getString("cacheName") != null) {
                    if (staged == null || !staged.isFile() || staged.length() < 1 || staged.length() > MAX_BYTES) {
                        throw new IllegalStateException("Respaldo temporal no disponible");
                    }
                    try (InputStream input = new FileInputStream(staged)) {
                        byte[] buffer = new byte[16384];
                        int count;
                        int total = 0;
                        while ((count = input.read(buffer)) != -1) {
                            total += count;
                            if (total > MAX_BYTES) throw new IllegalArgumentException("Respaldo demasiado grande");
                            output.write(buffer, 0, count);
                        }
                    }
                } else {
                    String content = call.getString("content");
                    if (content == null) throw new IllegalArgumentException("Respaldo vacío");
                    output.write(content.getBytes(StandardCharsets.UTF_8));
                }
                output.flush();
            }
            JSObject response = new JSObject();
            response.put("uri", uri.toString());
            call.resolve(response);
        } catch (Exception e) {
            call.reject("No se pudo guardar el respaldo en el destino elegido", e);
        } finally {
            removeStagedFile(call);
        }
    }
}
