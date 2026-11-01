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
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

/** Importación Android Storage Access Framework, sin permisos amplios de archivos. */
@CapacitorPlugin(name = "AtlasImport")
public class AtlasImportPlugin extends Plugin {
    private static final int MAX_BYTES = 4 * 1024 * 1024;

    @PluginMethod
    public void openFile(PluginCall call) {
        Intent pick = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        pick.addCategory(Intent.CATEGORY_OPENABLE);
        pick.setType("*/*");
        pick.putExtra(Intent.EXTRA_MIME_TYPES,
                new String[]{"application/json", "text/plain", "application/octet-stream"});
        startActivityForResult(call, pick, "onChosen");
    }

    @ActivityCallback
    private void onChosen(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK ||
                result.getData() == null || result.getData().getData() == null) {
            call.reject("Selección cancelada", "CANCELLED");
            return;
        }
        Uri uri = result.getData().getData();
        try (InputStream input = getContext().getContentResolver().openInputStream(uri);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            if (input == null) throw new IllegalStateException("No se pudo abrir el documento");
            byte[] buf = new byte[16384];
            int n;
            while ((n = input.read(buf)) != -1) {
                if (out.size() + n > MAX_BYTES) throw new IllegalArgumentException("Máximo 4 MB");
                out.write(buf, 0, n);
            }
            JSObject json = new JSObject();
            json.put("content", new String(out.toByteArray(), StandardCharsets.UTF_8));
            json.put("name", "Respaldo elegido");
            call.resolve(json);
        } catch (Exception e) {
            call.reject("No se pudo leer el archivo seleccionado", e);
        }
    }
}
