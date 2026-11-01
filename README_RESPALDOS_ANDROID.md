# El Gran Atlas v3.0.1 — Respaldo y firma Android

## Respaldos de partida

- Pulsa el botón **💾** de la cabecera en la web o en Android.
- **Exportar mi partida:** en Android se abre el menú de compartir. Elige **Guardar en archivos**, Drive u otro destino; confirma que existe el archivo `el-gran-atlas-partida-AAAA-MM-DD.json`. En la web se descarga el JSON.
- **Importar:** selecciona un respaldo JSON, revisa el resumen del progreso y confirma. La partida anterior se guarda localmente bajo `gran_atlas_backup_pre_import_v301` antes del reemplazo. Conserva siempre también el respaldo externo: la copia local desaparece si desinstalas la aplicación.
- El formato del archivo es `el-gran-atlas-save` versión 1. Incluye toda la partida y la fecha de exportación; no contiene cuentas ni datos de acceso.
- Se mantiene la clave de almacenamiento `gran_atlas_v05`. Las partidas web y Android **no se sincronizan automáticamente**; el archivo JSON permite transferirlas manualmente.

## Por qué Android Alpha usa un identificador nuevo

La primera APK usaba `com.elgranatlas.naturaleza` y una **firma de depuración temporal** generada en GitHub Actions. No disponemos de su clave privada para actualizarla con la misma firma. Para **no sobrescribir ni forzar a eliminar esa partida**, la nueva Alpha utiliza `com.elgranatlas.naturaleza.alpha` y se instala de manera independiente. Conserva la aplicación anterior sin desinstalarla.

La antigua APK aún no dispone de exportación integrada. No la desinstales si tiene progreso que deseas conservar.

## Firma estable para APK posteriores

El flujo `.github/workflows/android-signed.yml` está preparado para generar un APK release usando un keystore privado. **No funciona hasta que el propietario configure** cuatro secretos cifrados en GitHub (`Settings → Secrets and variables → Actions`):

- `ATLAS_ANDROID_KEYSTORE_BASE64`: archivo keystore privado codificado en base64.
- `ATLAS_ANDROID_STORE_PASSWORD`: contraseña del almacén.
- `ATLAS_ANDROID_KEY_ALIAS`: alias de clave.
- `ATLAS_ANDROID_KEY_PASSWORD`: contraseña de la clave.

**Nunca subas el keystore al repositorio**, y guarda una copia segura del archivo y de las contraseñas fuera de GitHub. La pérdida de la firma estable impide actualizar instalaciones firmadas con ella sin reinstalar. La clave de firma no debe exponerse en chats ni archivos públicos.

Al configurar los secretos, abre `Actions → Android APK firmado → Run workflow`. El flujo mostrará un error explícito si falta alguno. El artefacto `El-Gran-Atlas-Android-Firmado` contendrá el APK para pruebas. El primer paso después será comprobar la firma de una segunda compilación contra la primera.

## Notas de seguridad y compatibilidad

- La APK no contiene pagos reales; las coronas son simuladas.
- El respaldo es local, sin nube propia; evita compartirlo públicamente.
- La importación revisa el contenido del archivo, conserva copia de emergencia e informa antes de reemplazar la partida.
- Los APK de depuración generados por Actions pueden tener firmas diferentes en cada compilación. No los utilices para actualizaciones automáticas de una partida con progreso importante.

## Actualización v3.2 — guardar directamente en el teléfono

El menú 💾 ofrece dos opciones distintas: **⬇️ Guardar en el teléfono** abre el selector nativo Android para elegir una carpeta como Descargas y crear el archivo `.json` allí. **📤 Compartir respaldo** conserva el menú de compartir con otras aplicaciones. En navegador, Guardar solicita la descarga normal. La restauración desde un JSON sigue igual y no cambia la clave local de la partida.

El selector Android usa `ACTION_CREATE_DOCUMENT` y no necesita acceso general al almacenamiento. Si cancelas el selector, no se modifica tu partida. Para incluirlo en la APK se utiliza `scripts/install-atlas-export.py` tras `npx cap sync android`.

## v3.3 — Restauración Android desde Archivos

- La opción **📁 Abrir archivo del teléfono** emplea el selector nativo de Android (ACTION_OPEN_DOCUMENT). Permite elegir el JSON de Descargas o Documentos y muestra un resumen antes de confirmar la restauración.
- La opción previa de selección de archivos web permanece como alternativa.
- La partida existente no se sobrescribe hasta confirmar; se guarda además una copia local de emergencia.
- Si el archivo no se puede leer o validar, se muestra el motivo y no se altera el progreso.
- En Investigación, Fondo Científico I/II/III habilitan los lotes ×1, ×10 y ×100 del cambio libras→conocimiento en Sociedad, manteniendo la equivalencia £100→70 conocimiento.
