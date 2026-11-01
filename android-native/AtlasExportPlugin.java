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
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

/**
 * Abre Android ACTION_CREATE_DOCUMENT. El usuario elige Descargas, Documentos
 * u otra carpeta; no necesita permisos de almacenamiento global.
 */
@CapacitorPlugin(name = "AtlasExport")
public class AtlasExportPlugin extends Plugin {
    private static final Pattern SAFE_NAME = Pattern.compile("[a-zA-Z0-9._-]{1,120}\\.json");

    @PluginMethod
    public void saveFile(PluginCall call) {
        String name = call.getString("name");
        String content = call.getString("content");
        if (name == null || !SAFE_NAME.matcher(name).matches() || content == null
                || content.getBytes(StandardCharsets.UTF_8).length > 4 * 1024 * 1024) {
            call.reject("Archivo inválido o demasiado grande");
            return;
        }
        Intent request = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        request.addCategory(Intent.CATEGORY_OPENABLE);
        request.setType("application/json");
        request.putExtra(Intent.EXTRA_TITLE, name);
        startActivityForResult(call, request, "afterCreateDocument");
    }

    @ActivityCallback
    private void afterCreateDocument(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK
                || result.getData() == null || result.getData().getData() == null) {
            call.reject("Guardado cancelado", "CANCELLED");
            return;
        }
        Uri uri = result.getData().getData();
        try (OutputStream output = getContext().getContentResolver().openOutputStream(uri, "wt")) {
            if (output == null) throw new IllegalStateException("No se pudo abrir el destino");
            String content = call.getString("content");
            if (content == null) throw new IllegalArgumentException("Respaldo vacío");
            output.write(content.getBytes(StandardCharsets.UTF_8));
            output.flush();
            JSObject response = new JSObject();
            response.put("uri", uri.toString());
            call.resolve(response);
        } catch (Exception e) {
            call.reject("No se pudo guardar el respaldo en el destino elegido", e);
        }
    }
}
