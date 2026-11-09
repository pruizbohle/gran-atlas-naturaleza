# GM-02B · integración aislada avanzada, sin publicación

**Se mantiene la versión pública 3.28.0.** Rama `gm02/oceania`, sobre el trabajo existente; no se reinició GM-01 ni GM-02A. La fuente sigue siendo el contrato de 97 identidades, ocho regiones y 131 presencias. [Prompt GM-02B](request-gm02b.md).

El motor candidato, ejecutado únicamente en VM/navegador de revisión, contiene **807 identidades, 87 regiones y 1.460 presencias**. La entrada pública conserva **710 / 79 / 1.329**, `gran_atlas_v05`, sus módulos anteriores y sus mecánicas. El candidato tiene `approvedForProduction=false` y no se añade a `index.html` ni a su caché.

## Preparación productiva y cierre de esta pasada

La pasada de pulido técnico/visual está cerrada para el candidato ([detalle](art/polish-review.json)): pupilas compatibles con albinismo, volumen local y articulaciones/dedos más legibles, inspeccionados también a 64 px. La PWA de prepublicación 3.29 ya se genera con módulos separados y pasó una actualización real desde 3.28, respaldo exacto y reapertura offline de juego y laboratorio. No se han publicado esos archivos. Véase el [informe concreto de cierre y siguientes pasos](release/README.md).

## Etapas ya verificadas

1. **Ecología:** 97 configuraciones explícitas, 131 presencias compatibles con los filtros manuales y automáticos reales, cuatro estaciones de acceso jugable y clasificación coherente; Morelia viridis sigue siendo serpiente y Sphenodon, rincocéfalo. No se inventan ocurrencias uniformes para todo un hexágono. [Datos y pruebas](runtime/README.md).
2. **Progresión candidata:** Cartografía de Oceanía depende de Sudamérica; £3800 y 3400 de conocimiento, sin recetas ni materiales nuevos. Prestigio 197–218 en saltos de tres, sin consumirlo ni abrir regiones automáticamente. Se probaron investigación, bloqueo de viaje, desbloqueo y desplazamiento.
3. **Mecánicas reales aisladas:** encuentros manuales/automáticos en ocho regiones; las cinco etapas y publicación de las 97 identidades; muestra/exposición e ingresos en el Museo vigente; conservación de probabilidades e intervalo de naturalistas; persistencia y exportación/importación nativa en memoria. Las investigaciones previas, objetos, recetas, viajes y Legendarios se mantienen iguales.
4. **Arte:** perfiles para las 97 identidades, reutilización de tres bases compatibles y motor regional puro. Laboratorio con la ruta SVG exacta, filtros, tamaños, paginación, comparaciones sexuales y referencia de estilo existente. Se inspeccionaron renders y se corrigieron problemas del primer candidato. 212 combinaciones configuradas pasan XML y no hay dibujos idénticos diferenciados solo por atributos. Los 710 dibujos anteriores siguen idénticos. Son candidatos: la pasada final de volumen, detalles y contraste se registra en `art/polish-review.json`; la aprobación de publicación sigue bloqueada por las revisiones científicas y verificaciones finales. [Láminas e inventario](art/README.md).
5. **Cartografía:** ocho celdas candidatas, cinco de Australia continental unidas por bordes reales; Nueva Guinea, Tasmania y Nueva Zelanda separadas. Se preservan las otras cinco mallas. [Evidencias originales](cartography/browser-results.json).
6. **Interfaz:** 32 recorridos reales de Atlas → Campo → Cuaderno para las ocho regiones en cuatro resoluciones. Investigación comprada desde el Instituto 3.28, mapa completo y acciones visibles sin desbordamiento. Chromium emulado, no Android físico. [Evidencias](runtime/browser/README.md).
7. **Rendimiento:** Bestiario mantiene 32 tarjetas. Bajo CPU ×4, la mediana de apertura pasa de 134,4 a 144,4 ms y la reapertura de 30,1 a 34,1 ms. Se registra el aumento, junto a muestras, memoria aproximada y serialización; no se declara mejora.
8. **Offline y empaquetado:** además del ensayo aislado original, la nueva previsualización modular 3.29 pasó la actualización desde la PWA 3.28, rechazo con otra ventana abierta, respaldo exacto y offline de los módulos separados. Esto no constituye un despliegue público ni una prueba Android. [Informe y comandos](release/README.md).

## Estado de la red: comprobado, no supuesto

El borrador revisionado contiene los seis dominios pedidos, pero la observación activa sigue `network_policy.state=enforced`, `allowed_hosts=[]`, únicamente presets de paquetes. Una conexión HTTPS nueva a GBIF vuelve a producir **curl exit 56, CONNECT tunnel failed, response 403**. No se recibió contenido científico de destino. No se intentó sortear la política ni se supuso aplicada por estar guardada.

**Acción del usuario:** abrir la configuración del entorno `gran-atlas-naturaleza`; revisar el borrador de acceso de red, guardarlo y **Publicar**. Deben figurar `api.gbif.org`, `worldbirdnames.org`, `www.worldbirdnames.org`, `reptile-database.reptarium.cz`, `api.github.com` y `pruizbohle.github.io`, además de los presets actuales. Si la sesión actual no recibe la revisión publicada, usar esa versión del entorno en una sesión nueva. Después se debe consultar de nuevo el estado y abrir conexiones nuevas. El agente no puede dar por concedido ese acceso ni publicar el entorno por el usuario.

## Cuatro revisiones científicas aún abiertas

| Nombre fuente | ID preparado conservado | Filas Fauna | Región fuente |
| --- | --- | --- | --- |
| `Apteryx haastii` | `oc_esp_apteryx_haastii` | 1498 | Nueva Zelanda |
| `Lophorina superba` | `oc_esp_lophorina_superba` | 1120 | Nueva Guinea |
| `Crocodylus novaeguineae` | `oc_esp_crocodylus_novaeguineae` | 1132 | Nueva Guinea |
| `Trichoglossus haematodus` | `oc_esp_trichoglossus_haematodus` | 1123 | Nueva Guinea |

Los cuatro conceptos mantienen `pending-authority-review` y una marca visible en el laboratorio. No se proponen nuevos sinónimos ni nombres aceptados sin consultar evidencia. El dingo y Petauroides conservan sus decisiones documentadas con MDD; no se reabren ni se modifican sus filas originales.

## Cierre pendiente antes de activar 3.29.0

- Resolver con evidencia las cuatro revisiones; mantener intactos sus IDs y trazabilidad al aplicar las decisiones.
- Regenerar y validar la composición definitiva sobre esos datos. El empaquetado y la actualización segura ya están preparados y probados; falta autorizar técnicamente esa versión final con evidencia, trasladar los archivos definitivos y verificar los contratos de la versión nueva.
- Construir/verificar APK, plugins y certificado; verificar los workflows y enlaces realmente publicados. No hay SDK Android local configurado ni APK final generado.
- Integrar a main y desplegar solo después de esas comprobaciones. No se inicia GM-03.

El estado actual y los resultados de esta entrega están en `release/validation.json`, `release/regression-tests.txt` y `release/README.md`. Los logs de 408 pruebas, la cartografía inicial y GM-02A se mantienen como evidencias históricas de sus etapas, sin repetir las auditorías. La versión pública permanece en 3.28.0.
