# AND-01 · Auditoría inicial

Base local y remota `3422b10265fd230de03e6f4160245ce362cf25e8`, árbol limpio. Rama `feat/android-estable-v3420`. Se revisaron README_V3410, UX-06, README de firma permanente, tres workflows Android, certificado, scripts de versión/verificación/restauración/instalación nativa, gestor JSON, navegación móvil, Capacitor y validadores actuales.

Se conserva el ID `com.elgranatlas.naturaleza.beta314`. El script real calcula `major*10000+minor*100+patch`: 3.42.0 corresponde a **34200**. El nombre visible actual contiene «Beta 3.41.0»; se ajustará a «El Gran Atlas». Java local 21.0.13. No hay adb ni Gradle de sistema. Capacitor figura como ^7.0.0, sin lockfile ni instalación local: no constituye una instalación reproducible.

La huella pública sigue `null`. El entorno cloud no tiene secretos configurados; no se leen ni se presuponen los valores de secretos remotos. No existe evidencia física del candidato. AND-06 y la publicación APK no pueden ejecutarse en este estado; continúan las tareas automatizables y la web.

Hallazgos que se corregirán:

- El workflow de candidato es manual, pero no restringe la ejecución a main; usa npm install y validadores ligados a 3.41.
- La publicación comprueba el workflow y la rama de origen, pero falta vincular expresamente commit, manifiesto del candidato y evidencia física. Debe conservar el mismo artefacto y permitir únicamente un commit posterior de documentación de la prueba, sin cambios del contenido compilado.
- La verificación actual compara los recursos web esperados, pero necesita detectar duplicados y recursos inesperados, además de vincular los hashes al run y commit.
- El instalador nativo solo añade ambos registros si falta AtlasExport; un registro de AtlasImport ausente podría pasar inadvertido.
- El gestor de respaldo reutiliza los plugins existentes. Revisar la selección asíncrona de archivos, el estado pendiente tras cancelar una nueva selección, los fallos de almacenamiento y la resolución de los plugins de compartir en Capacitor actual.

El workflow debug sigue desactivado y se conservará así. No se crean claves, no se firma con debug, no se desinstala ninguna app y no se declara Android estable a partir de Chromium o de un ZIP de prueba.
