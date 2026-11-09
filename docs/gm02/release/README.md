# Paquete de prepublicación 3.29.0 y actualización segura

**Preparado y probado; no publicado.** El checkout público sigue en 3.28.0. La salida se materializa fuera del repositorio y se identifica como `unpublished-preview`, con marca visual de previsualización. No se ejecutan deploys ni se construye un APK al generar este paquete.

## Qué quedó terminado

- Generador `scripts/build-oceania-release-v3290.cjs`: copia una composición completa a un directorio externo nuevo, instala los puntos de integración ya probados y carga **módulos separados** de datos, arte y cartografía desde `index.html`. No depende de una respuesta JS simulada con todo el candidato incrustado.
- Versión de web, exportación, metadatos y Capacitor coherente en **3.29.0** dentro de la salida; ID de Capacitor histórico conservado. El repositorio no cambia de versión.
- Worker con revisión propia, assets de Oceanía y laboratorio en caché, rutas antiguas y nueva ruta de actualizador admitidas. La actualización conserva los mecanismos existentes: copia exacta primero, aceptación explícita y rechazo si hay otras ventanas abiertas.
- Plantillas de exportación/importación Android y scripts de instalación/configuración incluidos. Una prueba local de preparación verifica el registro de ambos plugins y `versionName=3.29.0`, `versionCode=32900`; **no es una compilación Android**.
- Rechazo de destinos dentro del repositorio, destinos existentes y publicación no validada. El generador no borra destinos ni puede escribir encima de `www/` mediante su interfaz normal.

## Prueba empaquetada de extremo a extremo

[Resultados reales](upgrade-results.json) · [Mapa offline](packaged-offline-map.png) · [Laboratorio offline](packaged-offline-art.png).

En un origen privado, Chromium instaló la PWA 3.28 real y después descargó el paquete 3.29 de previsualización. Con otra ventana abierta la activación se bloqueó sin escribir un respaldo. Al cerrarla y confirmar la actualización, se conservó una copia **idéntica byte por byte** del guardado anterior y se preservaron monedas, conocimiento, prestigio, inventario, equipo, avistamientos, etapas, monografías, región actual, regiones desbloqueadas, Museo y viajes.

Después se compró Cartografía de Oceanía desde el Instituto, se desbloqueó una región sin consumir prestigio y se viajó a Campo. Se verificaron los módulos nuevos en la caché, se desconectó la red y se recargaron el juego y el laboratorio: ocho celdas de Oceanía y 24 tarjetas artísticas iniciales funcionaron con los archivos separados. La prueba no cambia partidas personales ni el service worker público. Es Chromium, no Android físico.

El primer ensayo detectó que el worker preparado conservaba la respuesta de protocolo `version:3.28.0` aunque su caché ya era nueva; se corrigió el generador para actualizar también esa respuesta. Una prueba específica evita repetirlo. El resultado aprobado corresponde al ensayo posterior a la corrección.

## Comandos ejecutables

Desde la raíz del repositorio, con un destino que todavía no exista:

```sh
node scripts/build-oceania-release-v3290.cjs --status
node scripts/build-oceania-release-v3290.cjs --preview --output /tmp/gran-atlas-3290-preview
node --test tests/oceania-release-v3290.test.cjs
node scripts/check-oceania-packaged-upgrade-v3290.cjs
```

`--status` debe seguir indicando bloqueo. **Sin `--preview` el generador rechaza el lanzamiento antes de crear archivos** mientras falten las cuatro resoluciones científicas y el cierre técnico de lanzamiento. `docs/gm02/release-validation.json`, cuando se genere al terminar la validación, deberá corresponder a los hashes reales de datos/arte; no es una solicitud de permiso manual al usuario ni se debe fabricar para saltar bloqueos. No basta cambiar una bandera.

El paquete externo contiene `www/`, `package.json`, `capacitor.config.json`, los dos plugins Android y sus instaladores, además de `staging-manifest.json` con hashes de cada recurso web. El paquete de previsualización **no debe copiarse al sitio ni presentarse como versión definitiva**.

## Qué impide publicar todavía

1. Cuatro conceptos sin evidencia actual consultada: `Apteryx haastii`, `Lophorina superba`, `Crocodylus novaeguineae`, `Trichoglossus haematodus`. No se modificaron sus nombres, ámbitos ni IDs por falta de acceso.
2. Tras resolverlos, regenerar el candidato, cerrar la validación de lanzamiento sobre esos hashes y materializar la integración definitiva. Hay que trasladar/revisar los archivos finales y ajustar los contratos de versión de las pruebas actuales sin alterar fixtures históricos; los workflows actuales publican `www/`, no una salida temporal automáticamente.
3. Compilar el APK final, comprobar sus recursos/plugins y comparar su certificado con el APK anterior. Java está disponible, pero no están definidos ANDROID_HOME/ANDROID_SDK_ROOT ni se encontró sdkmanager. No se declara compilación o continuidad de firma verificadas. Esto podrá realizarse en el runner Android configurado y verificarse con los artefactos reales.
4. Confirmar los resultados de los workflows de despliegue y Android y los enlaces servidos antes de declarar la publicación.

## Intervención del usuario y siguiente paso

La política activa aún solo tiene los presets de paquetes y deniega GBIF con CONNECT 403. En la configuración de `gran-atlas-naturaleza`, revisar y guardar el borrador de seis dominios y **Publicar**. Si ya fue publicado pero esta sesión conserva la revisión anterior, usar la versión publicada en una sesión nueva y retomar `gm02/oceania`. No se necesita una nueva aprobación del usuario para continuar el código.

Con el acceso aplicado, el siguiente paso del agente es abrir conexiones nuevas a las autoridades, registrar las cuatro decisiones con sus fuentes y filas originales, y ejecutar la generación y validación final. Mientras tanto, la previsualización empaquetada y sus comprobaciones anteriores son ejecutables sin esas consultas.
