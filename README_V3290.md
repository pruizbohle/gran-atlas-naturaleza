# 3.29.0 — Oceanía

La integración web añade **97 identidades, ocho regiones y 131 presencias**. El catálogo mundial alcanza **807 identidades, 87 regiones y 1.460 presencias**. Se conservan los IDs preparados, el guardado `gran_atlas_v05`, la economía y las reglas de observación anteriores.

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/)
- [Actualización PWA con respaldo](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3290.html)
- [Laboratorio artístico de Oceanía](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-arte-oceania-v3290.html)
- [Datos científicos y trazabilidad](docs/gm02/scientific-decisions.json)
- [Guía de firma permanente y migración Android](README_ANDROID_FIRMA_PERMANENTE.md)

## Integración y validación

Cartografía de Oceanía depende de Sudamérica: £3800 y 3400 de conocimiento. Los ocho requisitos de prestigio van de 197 a 218 en saltos de tres, sin consumir prestigio. La fauna se integra en encuentros manuales y automáticos, Cuaderno, Bestiario, monografías, Museo, categorías y variantes. Se mantienen las 131 presencias del contrato y los nombres fuente; el nombre aceptado del kiwi moteado mayor pasa a `Apteryx maxima` conservando su ID histórico.

La ciencia, cartografía y auditoría artística ya completadas no se repitieron en esta integración. Se conserva la evidencia previa y el pulido de 212 combinaciones SVG. El rendimiento medido en la etapa anterior fue 134,4→144,4 ms de apertura y 30,1→34,1 ms de reapertura del Bestiario bajo CPU ×4; se informa como aumento, sin inventar una nueva medición. La paginación continúa en 32 tarjetas.

La regresión se ejecuta contra el motor instalado y los 807 animales; las comprobaciones históricas eliminan únicamente los bloques aditivos marcados de Oceanía para comparar los fixtures originales. Se conserva una referencia 3.28 inmutable con hashes para generar/reproducir la integración y probar la PWA. El paquete generado debe coincidir byte por byte con todos los archivos instalados.

[Pruebas de regresión](docs/gm02/web-v3290/regression-tests.txt): 416 aprobadas, ninguna fallida. [Prueba PWA](docs/gm02/web-v3290/upgrade-results.json): 3.28→3.29 con rechazo si hay otra ventana abierta, respaldo exacto, preservación de los campos del guardado, desbloqueo/viaje desde la interfaz y juego/laboratorio offline. También se prueba exportación real del formato 3.28 e importación mediante el puente nativo simulado en 3.29; no se presenta como una prueba en un teléfono Android físico.

## Android separado de la web

El propietario autorizó una firma permanente nueva y la migración manual con respaldo, reinstalación e importación. El antiguo workflow debug está desactivado. La compilación firmada y su publicación son pasos manuales separados; ningún push genera otra firma temporal.

Faltan crear/resguardar la clave en el PC, configurar los cuatro secretos, fijar la huella pública, compilar el candidato y validar la restauración en un Android real. El workflow de publicación exige evidencia asociada al SHA256 de ese APK y descarga ese mismo binario, sin recompilar. No se borra ningún guardado ni se desinstala automáticamente.

El cierre Android permanece pendiente de esas comprobaciones. La web no depende de ellas. GM-03 no se inicia.
