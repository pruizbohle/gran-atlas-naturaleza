# Reproducir la validación

Desde la raíz del repositorio:

```sh
node --test tests/*.test.cjs
ATLAS_EVIDENCE_DIR=docs/museum-v3270 node --test tests/museum-v3270.test.cjs tests/persistence-v3240.test.cjs
NODE_PATH=/ruta/a/node_modules node scripts/check-museum-browser-v3270.cjs
NODE_PATH=/ruta/a/node_modules node scripts/benchmark-museum-v3270.cjs
NODE_PATH=/ruta/a/node_modules node scripts/check-museum-update-v3270.cjs
python scripts/verify-museum-apk-v3270.py /ruta/El-Gran-Atlas-Beta-3.27.0-debug.apk docs/museum-v3270/android-report.json
```

Los dos scripts de navegador requieren Playwright instalado fuera del juego y Chromium en `/usr/bin/chromium`. No son dependencias de producción. Las comparaciones necesitan el objeto Git `a12d7ed` (descargar el historial si el checkout es superficial). Usan servidores locales temporales y partidas de prueba, nunca partidas personales. La instrumentación se inserta solo en las respuestas del servidor de pruebas.

El benchmark ejecuta sus mediciones secuencialmente con CPU ×4. No ejecutar otras pruebas intensivas a la vez. El script responsive prueba también cierre/reapertura, persistencia y acceso offline real con service worker; el laboratorio usa marcos de origen opaco y almacenamiento en memoria, sin intervalos.

Las pruebas nativas de importación/exportación usan los contratos de los plugins mediante dobles deterministas. El verificador APK comprueba el manifiesto binario, los recursos empaquetados y la presencia de ambos plugins en DEX. Eso no sustituye una instalación en un teléfono físico.
