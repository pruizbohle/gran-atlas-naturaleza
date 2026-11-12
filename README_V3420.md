# El Gran Atlas 3.42.0 · Android preparado y continuidad de partidas

Esta versión conserva íntegramente el juego y prepara una distribución Android verificable. Refuerza respaldo e importación y vincula cada candidato a su certificado, APK, recursos, versión, run y commit. La web se publica independientemente de la firma Android.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Actualizar la PWA con respaldo](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3420.html) · [Laboratorio UX aislado conservado](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-experiencia-v3410.html)

**Web publicada y verificada.** El commit [`8ecafed`](https://github.com/pruizbohle/gran-atlas-naturaleza/commit/8ecafed107567a9ff988ee17d0eb1bf223417194) está integrado en main. [GitHub Actions](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/43273738003) aprobó las **858 ejecuciones**: 720 referencias, 97 pruebas nuevas y 41 regresiones repetidas, sin fallos. También instaló las dependencias exactas y generó/verificó el proyecto nativo sin compilar APK. Los [188/188 hashes publicados](docs/and3420/published-report.json) coinciden; caché `gran-atlas-v3.42.0-android-d63bd336d9e5`, 186 recursos offline. La [navegación pública en cinco anchos](docs/and3420/published-browser/report.json) y los [respaldos y reapertura offline](docs/and3420/published-backups/report.json) pasaron sin errores JavaScript.

**Android preparado, pendiente de certificado y validación física.** No se ha generado candidato ni APK estable; no se ha ejecutado el workflow de firma ni publicado un APK 3.42.0.

## Cuatro estados distintos

| Estado | Resultado |
|---|---|
| Web 3.42.0 | **Publicada y verificada en GitHub Pages** |
| Android preparado | Configuración, dependencias, generación/sincronización, respaldo y automatización comprobados en lo que permite el entorno |
| Android candidato | **Pendiente:** falta fijar la huella pública real y configurar/verificar los secretos privadamente |
| Android estable | **Pendiente:** no existe candidato exacto probado en un dispositivo físico ni publicación autorizada de ese binario |

No se genera una clave sustituta ni un APK debug. `docs/android/signing-certificate.json` sigue intacto con SHA-256 nulo. Los secretos remotos no se leen ni se presuponen configurados.

## Identidad, dependencias y contenido

Se mantiene **com.elgranatlas.naturaleza.beta314**, nombre visible **El Gran Atlas**, versionName **3.42.0** y versionCode **34200**, calculado por el script existente y aplicado al proyecto generado. Capacitor core/android/cli 7.6.10, Filesystem 7.1.9 y Share 7.0.4 quedan fijados mediante package-lock y npm ci. Java requerido 21; minSdk 23 y compile/targetSdk 35. Portrait y pantalla completa se configuran de forma idempotente; su apariencia física no se da por aprobada.

La [verificación del proyecto generado](docs/and3420/generated-project-verification.json) compara todos los recursos web, identidad, versión y registros nativos. Esto acredita fuentes generadas y copiadas, **no compilación ni ejecución de APK**. Capacitor añade dos archivos Cordova vacíos documentados; cualquier código o archivo web inesperado se rechaza.

El motor app.js es idéntico a 3422b10: 945 especies, 113 regiones, 1.744 presencias, 68 objetos, 80 logros, 37 misiones, doce exposiciones, diez módulos, mapas/Mapamundi y Brújula. No se alteran probabilidades, economía, recompensas ni procesamiento temporal. Los plugins SAF originales se conservan; se corrige su instalación parcial y se resuelven los plugins de compartir con la API actual de Capacitor.

## Respaldos y compatibilidad

El gestor mantiene gran_atlas_v05 y el formato JSON v1. Elegir un archivo solo prepara una previsualización; restaurar requiere confirmación explícita y una copia de emergencia anterior. Se impide que una lectura antigua sustituya la selección nueva o que cancelar otra selección deje un respaldo anterior listo para restaurarse. Se gestionan formatos inválidos, claves anidadas peligrosas y fallos de almacenamiento.

Las pruebas actuales recorren exportadores reales de 3.28–3.41, partidas avanzadas, campos completos, trabajos pendientes, recarga y reexportación. La PWA 3.41→3.42 conserva respaldo exacto, bloqueo de otra ventana y trabajos tras 90 días offline sin pagar dos veces. En Android no se registra el service worker web: el APK usa sus propios recursos y conserva oculto el actualizador PWA.

[Compatibilidad](docs/and3420/compatibilidad.md) · [Respaldo y migración segura](docs/and3420/respaldo-y-migracion.md) · [Pruebas de navegador y puente simulado](docs/and3420/backups-browser/report.json). La simulación de Capacitor no equivale a una exportación/restauración física.

## Rendimiento y pruebas

[Comparación con 3.41](docs/and3420/AND-04-rendimiento.md): ocho estados, cinco anchos, diez módulos y ráfagas de 600 cambios/200 guardados. No se observa otra regresión grave en esos recorridos; los tiempos de guardado aumentaron en esta ejecución y quedan registrados. Nodos y escuchadores permanecen estables y no se añade otro intervalo. No se reduce la frecuencia de guardado ni se refactoriza el juego. No se atribuyen cifras Chromium a teléfonos.

Las **720 pruebas históricas** se conservan sin modificaciones y se ejecutan sobre sus fuentes exactas. Se agregan **97 pruebas actuales**: 40 Node para configuración, respaldo, migraciones e integridad y 57 Python de guardas de firma/contenido/candidato/evidencia. Otras 41 regresiones de 3.41 se repiten en el candidato: se cuentan como repeticiones, no como pruebas nuevas. Son **817 pruebas distintas y 858 ejecuciones**. Las guardas Python utilizan ZIP y reportes sintéticos, nunca una firma o un teléfono reales.

```sh
npm ci --no-audit --no-fund
npm run release:verify
python3 scripts/audit-android-readiness-v3420.py
# Servir www en 127.0.0.1:8768 para Chromium/Playwright:
node scripts/check-android-web-v3420.cjs
node scripts/check-android-backups-v3420.cjs
node scripts/check-android-web-pwa-v3420.cjs
```

## Firma, candidato y prueba física pendientes

[Auditoría inicial](docs/and3420/AND-01-auditoria.md) · [Configuración](docs/and3420/AND-02-configuracion.md) · [Firma y publicación](docs/and3420/AND-05-firma-y-publicacion.md) · [Estado automatizado](docs/and3420/android-readiness.json).

El propietario debe reutilizar su clave permanente, si existe, o crearla privadamente siguiendo el [README Windows](README_ANDROID_FIRMA_PERMANENTE.md). Solo se fija públicamente la huella SHA-256 real. Los cuatro secretos se configuran en Settings, nunca en Git ni en el chat. [Acciones exactas pendientes](docs/and3420/AND-06-candidato-pendiente.md).

El workflow de candidato es manual y solo main: valida huella y secretos, usa npm ci, ejecuta las pruebas de release, incorpora plugins, compila release con la clave permanente y verifica apksigner/aapt, paquete, versión y contenido. Guarda el APK como artefacto candidato, sin release pública. Solo se conserva públicamente la huella del certificado; el reporte transitorio completo se elimina.

La [lista física](docs/and3420/prueba-fisica.md) requiere autorización de transición y dos respaldos externos ya validados antes de cualquier reinstalación manual. Distingue mismo certificado (actualización normal) y certificado diferente (migración manual). No hay desinstalación automática. El registro real debe identificar dispositivo, Android/WebView, tiempo, run, commit, APK hash y payload exactos; no existe un archivo con resultados inventados.

Publicar Android exige ese registro y descarga el mismo candidato, sin recompilar. Rechaza otro commit, versión, firma, APK o contenido. Un commit posterior de documentación puede incorporar la prueba; cualquier cambio compilable o de verificación exige otro candidato. La etiqueta de release apunta al commit del binario. Hasta entonces el resultado es **Web publicada; Android preparado, pendiente de validación**, sin afirmar Android estable.
