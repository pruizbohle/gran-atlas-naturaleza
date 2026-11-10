# Android: firma permanente y migración desde 3.28.0

La web 3.29.0 se publica independientemente de Android. El antiguo workflow debug ya no compila ni distribuye APK. El APK 3.28.0 distribuido tenía una firma debug; se adopta una clave permanente nueva por decisión del propietario. No se intentará instalarla como actualización sobre esa firma anterior.

## 1. Crear la clave en tu PC Windows, una sola vez

1. Instala un JDK 21 de una fuente oficial (por ejemplo Eclipse Temurin). Abre una ventana nueva de PowerShell y comprueba `keytool -help`. Si no aparece, usa el `keytool.exe` de la carpeta `bin` del JDK instalado.
2. Elige una carpeta privada **fuera del repositorio**. Estos comandos usan una carpeta en tu perfil:

   ```powershell
   $KeyDir = Join-Path $env:USERPROFILE 'Atlas-Android-Firma'
   New-Item -ItemType Directory -Force -Path $KeyDir | Out-Null
   if (Test-Path "$KeyDir\atlas-release.jks") { throw 'Ya existe la clave: consérvala; no la reemplaces.' }
   keytool -genkeypair -v -keystore "$KeyDir\atlas-release.jks" -storetype JKS -alias atlas-release -keyalg RSA -keysize 4096 -validity 36500
   ```

3. `keytool` solicitará la contraseña del almacén, los datos del titular y la contraseña de la clave. Elige contraseñas largas y guárdalas en tu gestor de contraseñas. Puedes usar la misma contraseña para almacén y clave; si son distintas, registra ambas. El alias es `atlas-release`. No escribas contraseñas como argumentos de comandos ni las envíes al chat.
4. Comprueba el certificado:

   ```powershell
   keytool -list -v -keystore "$KeyDir\atlas-release.jks" -alias atlas-release
   keytool -exportcert -keystore "$KeyDir\atlas-release.jks" -alias atlas-release -file "$KeyDir\atlas-release.cer"
   ```

   La huella **SHA256 del certificado** es pública. Anótala; no confundir con el hash del archivo `.jks`. El archivo `.cer` contiene solo la parte pública; el `.jks` y su representación Base64 son privados.
5. Conserva al menos dos copias cifradas del `.jks` en ubicaciones independientes (una fuera del PC) y las contraseñas en tu gestor. Verifica una copia con `keytool -list`. La pérdida de esta clave impediría actualizar las futuras instalaciones firmadas con ella. No generes otra por cada versión.

En macOS/Linux, el mismo comando `keytool -genkeypair` sirve sustituyendo la ruta por una carpeta privada del usuario. No se necesita Android Studio para crear la clave; sí un JDK.

## 2. Configurar GitHub sin compartir secretos por el chat

Abre https://github.com/pruizbohle/gran-atlas-naturaleza/settings/secrets/actions y, en **Repository secrets → New repository secret**, crea:

| Nombre exacto | Valor que debes introducir en GitHub |
| --- | --- |
| `ATLAS_ANDROID_KEYSTORE_BASE64` | El archivo `atlas-release.jks` completo codificado en Base64 |
| `ATLAS_ANDROID_STORE_PASSWORD` | Contraseña del almacén |
| `ATLAS_ANDROID_KEY_ALIAS` | `atlas-release` |
| `ATLAS_ANDROID_KEY_PASSWORD` | Contraseña de la clave (la del almacén si elegiste la misma) |

Para copiar el Base64 directamente al portapapeles en PowerShell, sin imprimirlo ni crear otro archivo privado:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$KeyDir\atlas-release.jks")) | Set-Clipboard
```

Pégalo **solo** en el valor del secreto `ATLAS_ANDROID_KEYSTORE_BASE64`, guarda el secreto y limpia el portapapeles:

```powershell
Set-Clipboard -Value ''
```

Base64 no es cifrado: trátalo igual que el `.jks`. No pegues ninguno de estos valores en issues, commits, logs ni en este chat. Introduce las dos contraseñas directamente desde tu gestor en las páginas de secretos de GitHub.

Falta además fijar la **huella pública**, que no es un quinto secreto: en `docs/android/signing-certificate.json`, sustituye `"sha256": null` por los 64 caracteres hexadecimales SHA256 del certificado, sin dos puntos, y guarda el cambio en `main`. Puedes comunicar al agente **solo esa huella pública** para incorporarla; no hace falta compartir ningún archivo ni contraseña. El workflow rechazará una firma diferente en esta y todas las versiones futuras. El archivo queda inicialmente sin huella para no inventar una identidad de firma.

## 3. Construir un candidato, sin publicarlo como release

En **Actions → Android APK firmado · candidato de validación → Run workflow**, selecciona `main`. Con los cuatro secretos y la huella fijada, el runner ejecutará las pruebas, creará la versión Android desde `package.json`, registrará los plugins de respaldo y compilará `assembleRelease` con la misma clave permanente.

La ejecución debe terminar en verde. Descarga el artefacto `Atlas-Android-candidato-<run ID>` para las pruebas. Contiene el APK y las evidencias de firma, versión y SHA256. Es un **candidato para validación**, no una release Android oficial. Los recursos web deben ser idénticos a `www/`, el ID Android histórico se conserva y la firma debe coincidir con la huella fijada. No se genera una clave de respaldo temporal si faltan secretos.

## 4. Migrar sin perder la partida

**No desinstales el APK anterior hasta completar los primeros cuatro pasos.** La aplicación y los workflows no desinstalan, borran guardados ni ejecutan `localStorage.clear` por esta migración.

1. En el APK 3.28.0, abre **Partida → Exportar partida** y guarda el JSON fuera del almacenamiento privado de la aplicación, por ejemplo en Descargas. Si no recuerdas qué archivo es, vuelve a exportar y comprueba fecha y tamaño. Conserva también una copia en tu PC y otra copia independiente. No las envíes al chat.
2. Anota o captura para ti monedas, conocimiento, prestigio, región actual, inventario, equipo, avistamientos, etapas/publicaciones, Museo y viajes. Esta referencia permite comprobar la restauración; el tiempo de los viajes y los ingresos offline pueden avanzar legítimamente.
3. **Valida el respaldo antes de desinstalar.** Abre https://pruizbohle.github.io/gran-atlas-naturaleza/ en un perfil de navegador separado de tu partida web habitual. Importa el JSON mediante la pantalla de Partida y revisa su previsualización antes de confirmar. Comprueba los datos anteriores y que se puede cerrar, reabrir y exportar otra copia. La prueba sustituye únicamente la partida de ese perfil elegido; no uses tu perfil habitual sin respaldarlo antes.
4. Si el archivo no abre, no se valida o faltan datos, **detente y conserva la aplicación vieja**. Puedes probar el respaldo alternativo y la opción de pegar JSON completo. No continúes con un archivo incompleto ni con un enlace al APK en lugar del JSON.
5. Solo cuando tengas las copias y la restauración verificada, **tú** desinstala manualmente el APK debug anterior desde Ajustes de Android. Esa desinstalación elimina su almacenamiento privado; por eso los respaldos deben estar fuera. Si prefieres conservarlo, pospón la migración; no hay una acción automática.
6. Instala el APK candidato firmado y abre **Partida → Importar partida**. Selecciona el JSON guardado, revisa la previsualización y confirma la restauración. Si el selector falla, usa la alternativa de pegar JSON completo. No necesitas iniciar una partida desde cero.
7. Compara los campos anotados, entra al Atlas, Campo, Cuaderno y Museo, cierra y vuelve a abrir. Comprueba también la reapertura offline. Exporta una nueva copia desde 3.29.0 y valida que vuelve a importarse en un perfil de prueba. Conserva los respaldos 3.28 hasta terminar todo el proceso.
8. Las futuras versiones con este **mismo certificado** e ID se instalarán como actualización; no necesitarán repetir la desinstalación. Mantén una copia del guardado antes de actualizar igualmente.

## 5. Publicar únicamente el APK que pasó la restauración

Después de probar un Android real, registra en `docs/android/restoration-validation.json` la evidencia de **ese candidato exacto**, sin datos personales ni contenido del guardado. El archivo no se crea con resultados inventados. Debe contener:

```json
{
  "version": "3.29.0",
  "workflowRunId": 123456789,
  "apkSha256": "hash SHA256 de ese APK, obtenido de apk-sha256.txt",
  "certificateSha256": "huella pública permanente sin dos puntos",
  "physicalAndroid": true,
  "backupExportedFrom328": true,
  "backupValidatedBeforeUninstall": true,
  "manualReinstall": true,
  "nativeImportRestored": true,
  "progressCompared": true,
  "reopenedOffline": true,
  "exportedAgain": true,
  "testedAt": "fecha real con zona horaria",
  "device": "modelo y versión Android",
  "notes": "resultado observado de la comparación; sin contenido privado"
}
```

Guarda esa evidencia en `main` solo cuando sea real. Después ejecuta **Actions → Publicar Android validado**, introduciendo el `candidate_run_id` correspondiente. El workflow descarga **el mismo APK**, vuelve a verificar firma, recursos y evidencia de restauración y crea el enlace de release; no recompila otro binario y no reemplaza silenciosamente un APK ya publicado. Si cambian recursos o certificado, se rechaza y hace falta un candidato y validación nuevos.

La web puede estar operativa mientras estos pasos Android permanecen pendientes. No se declarará cerrado el componente Android sin el candidato firmado y la restauración comprobada.
