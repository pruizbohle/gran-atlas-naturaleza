# Reproducir las comprobaciones

```sh
node --test tests/*.test.cjs
ATLAS_EVIDENCE_DIR=docs/expeditions-research-v3280 node --test tests/*.test.cjs
NODE_PATH=/ruta/a/node_modules node scripts/check-expeditions-research-v3280.cjs
NODE_PATH=/ruta/a/node_modules node scripts/benchmark-expeditions-research-v3280.cjs
NODE_PATH=/ruta/a/node_modules node scripts/check-development-update-v3280.cjs
python scripts/verify-expeditions-apk-v3280.py /ruta/El-Gran-Atlas-Beta-3.28.0-debug.apk docs/expeditions-research-v3280/android-report.json
```

Los scripts de navegador requieren Playwright externo y Chromium en `/usr/bin/chromium`; no son dependencias de producción. Las comparaciones necesitan el objeto Git `71d4f4e`; descargar el historial si el checkout es superficial. No ejecutar otras tareas intensivas durante el benchmark. Se conserva el resultado de todos los ensayos, incluidos empeoramientos.

Las pruebas usan servidores locales, instrumentos insertados solo en sus respuestas y partidas de prueba. La emulación táctil no equivale a un dispositivo Android físico. El laboratorio emplea marcos de origen opaco con almacenamiento en memoria y sin intervalos; nunca utiliza una partida personal.

La prueba de actualización instala primero el service worker de 3.27.0. Después sirve la nueva revisión, exige pulsar Actualizar, compara la copia previa exactamente y espera el control del worker preparado. Verifica el estado completo y vuelve a abrir Expediciones offline.

La importación/exportación nativa se prueba mediante los contratos de los plugins. El verificador del APK descargado lee el manifiesto binario, compara todos los archivos web con producción, comprueba los plugins en DEX y extrae las huellas públicas de firma. No instala el paquete ni afirma una prueba física.
