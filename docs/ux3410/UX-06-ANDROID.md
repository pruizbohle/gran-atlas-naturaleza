# UX-06 · Continuidad Android pendiente

La publicación web 3.41.0 es independiente. No se ha compilado, firmado, instalado ni publicado un APK en esta versión. Chromium emulado no acredita continuidad de una instalación Android.

Se conserva `com.elgranatlas.naturaleza.beta314`, la clave `gran_atlas_v05`, las fuentes nativas AtlasExport/AtlasImport y los verificadores existentes. `docs/android/signing-certificate.json` permanece intacto con `sha256: null`. El entorno local no tiene credenciales configuradas; no se ha inspeccionado el inventario de secretos remoto de Actions. No hay evidencia física para un candidato 3.41.0.

La auditoría de los dos workflows confirma que son manuales. El de candidato valida ahora la huella antes de ejecutar las suites y antes de compilar; ejecuta las 666 referencias en sus fuentes exactas y las pruebas actuales separadas. El de publicación descarga el artefacto ya probado, sin recompilarlo, y verifica identidad, versión, todos los recursos web, plugins, firma y restauración del binario exacto.

Pendientes para una futura publicación Android:

- Fijar la huella SHA-256 pública del certificado permanente real. No crear otra firma para simular continuidad. Los secretos se configuran fuera del repositorio.
- Generar un candidato desde main mediante el procedimiento existente y comprobar su paquete, versión, contenido, plugins y certificado.
- Antes de una migración que requiera reinstalar, exportar y validar un respaldo real de la instalación anterior. No desinstalar una partida sin ese respaldo.
- Probar en un dispositivo físico exportación, importación nativa, comparación de progreso, reapertura offline y nueva exportación. Registrar dispositivo, fecha, versión, hash del APK, certificado y run exactos en `docs/android/restoration-validation.json`, sin datos personales de la partida.
- Publicar únicamente el mismo artefacto cuyo hash y restauración hayan sido comprobados. Una firma distinta no puede conservar una instalación por actualización directa.

[Resultado reproducible de la auditoría](android/report.json). No hay credenciales ni huellas inventadas y no se solicita incorporar almacenes o contraseñas al repositorio.
