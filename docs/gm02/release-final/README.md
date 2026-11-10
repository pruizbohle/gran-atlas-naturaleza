> **Estado vigente posterior:** Oceanía web 3.29.0 publicada y verificada. El propietario autorizó nueva firma permanente Android y migración manual; la web ya no depende de ese bloqueo. [Verificación actual](../web-v3290/validation.json). El informe siguiente conserva el estado histórico anterior.

# GM-02B desde 7e6319f: paquete 3.29 validado; publicación bloqueada por firma

La política publicada está aplicada (`observations_current=true`, `network_policy.state=enforced`, revisión 1). Conexiones nuevas a GBIF, IOC y Reptile Database devolvieron HTTP 200. No se repitieron GM-01, dingo, Petauroides, ni la implementación anterior de Oceanía.

Las cuatro decisiones están en [scientific-decisions.json](../scientific-decisions.json), con autoridades consultadas, hashes de evidencia, IDs, ESP, filas y HX conservados. IOC 15.2 adopta **Apteryx maxima** para el kiwi moteado mayor, manteniendo `oc_esp_apteryx_haastii` y el nombre fuente. IOC restringe **Lophorina superba** al noroeste de Nueva Guinea; se adopta explícitamente su tratamiento restaurado desde 14.2, distinto del de GBIF. **Trichoglossus haematodus** conserva el concepto de lori de cocotero en Nueva Guinea, excluyendo los loris australianos segregados. Reptile Database restringe **Crocodylus novaeguineae** al norte de las tierras altas, excluyendo **C. halli**. Las regiones amplias representan subáreas compatibles; no se infiere presencia uniforme en cada hexágono.

## Validación completada

- 97 identidades, ocho regiones, 131 presencias adicionales; total candidato 807 / 87 / 1460. Mismo `gran_atlas_v05`, IDs y economía anterior.
- 414 pruebas pasan: [log](../release/regression-final.txt). Prueba nueva de nombres aceptados, trazabilidad de filas y hashes de evidencia.
- Auditoría artística previa conservada. Adaptación del nombre del kiwi mantiene su dibujo de kiwi moteado grande. [Render revisado](../art-final/birds.png), 212 combinaciones SVG válidas y cuatro resoluciones sin desbordamiento. No constituye prueba Android física.
- [Actualización final 3.28 → 3.29](upgrade-results.json): respaldo idéntico, rechazo con otra ventana abierta, guardado conservado, compra/desbloqueo/viaje desde la UI, prestigio sin consumo, ocho celdas y laboratorio offline.
- Generador definitivo con todos los controles aprobados; paquete externo `/workspace/gran-atlas-3290-final-validated`. [Manifest de recursos](staging-manifest.json). El paquete se integra en el runner firmado sin desplegar el sitio.
- Workflow Android preparado para versión 32900, inspección de firma, comparación de certificado previo, recursos web idénticos y plugins nativos de exportación/importación. La comparación de firma es obligatoria antes de presentar compatibilidad de actualización.

## Bloqueo observado y acción exacta

El [workflow firmado 42739927891](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42739927891) falló en **Verificar secretos de firma**, antes de compilar. La API de listado de secretos devuelve 403; no permite determinar cuál faltaba con la versión original del workflow. La [segunda ejecución 42740710245](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42740710245), sobre `09c0d82`, confirmó mediante anotaciones que **faltan los cuatro secretos**, individualmente. No se mostraron valores. No existe un problema de red pendiente ni se necesita conceder acceso de listado de secretos al agente para continuar.

En el repositorio, abrir **Settings → Secrets and variables → Actions** y configurar los secretos `ATLAS_ANDROID_KEYSTORE_BASE64`, `ATLAS_ANDROID_STORE_PASSWORD`, `ATLAS_ANDROID_KEY_ALIAS` y `ATLAS_ANDROID_KEY_PASSWORD`. Usar el almacén que firmó el APK distribuido, sin enviar secretos al chat.

El APK público 3.28.0 es **Android Debug**, no una release con certificado estable acreditado. Se descargó y se leyó su certificado: SHA-256 `1C:C8:DE:77:E7:BA:88:CB:1B:03:32:24:B3:26:A0:75:82:1C:9E:7B:3D:2C:28:2D:A3:88:2D:1A:63:93:2E:FC`. [Procedencia y hash del APK](previous-apk.json), [salida keytool](previous-apk-certificate.txt). Esta lectura no sustituye `apksigner verify` del APK final.

Para actualizar esa instalación conservando la identidad Android se necesita su **keystore original**. Crear otra clave no resuelve la continuidad de firma. Si no se conserva, el usuario debe decidir una migración mediante exportación de partida y reinstalación con una clave estable; esa vía no equivale a una actualización sobre la instalación anterior.

## Trabajo que permanece abierto

Construir el APK 3.29, verificar su firma real y continuidad, activar los archivos finales en `www/` y los contratos de versión de las pruebas, integrar en `main`, ejecutar Pages y verificar los recursos servidos y enlace del APK. Se conserva la entrada pública 3.28.0 para evitar publicar una integración parcial mientras la firma está bloqueada. No se ha integrado a main, publicado la web ni generado un APK final. GM-03 no se inicia.

Verificación HTTPS posterior: `atlas-release.json` servido devuelve `version=3.28.0`; `main` sigue en `564c63c341465f79b556a0a589e0515ef8361e6a`. No se disparó Pages.

Juego público anterior: https://pruizbohle.github.io/gran-atlas-naturaleza/ . APK anterior: https://github.com/pruizbohle/gran-atlas-naturaleza/releases/tag/v3.28.0 . No se presentan como enlaces de Oceanía publicada.
