# GM-02B · integración aislada avanzada, sin publicación

**Se mantiene la versión pública 3.28.0.** Rama `gm02/oceania`, sobre el trabajo existente; no se reinició GM-01 ni GM-02A. La fuente sigue siendo el contrato de 97 identidades, ocho regiones y 131 presencias. [Prompt GM-02B](request-gm02b.md).

El motor candidato, ejecutado únicamente en VM/navegador de revisión, contiene **807 identidades, 87 regiones y 1.460 presencias**. La entrada pública conserva **710 / 79 / 1.329**, `gran_atlas_v05`, sus módulos anteriores y sus mecánicas. El candidato tiene `approvedForProduction=false` y no se añade a `index.html` ni a su caché.

## Etapas ya verificadas

1. **Ecología:** 97 configuraciones explícitas, 131 presencias compatibles con los filtros manuales y automáticos reales, cuatro estaciones de acceso jugable y clasificación coherente; Morelia viridis sigue siendo serpiente y Sphenodon, rincocéfalo. No se inventan ocurrencias uniformes para todo un hexágono. [Datos y pruebas](runtime/README.md).
2. **Progresión candidata:** Cartografía de Oceanía depende de Sudamérica; £3800 y 3400 de conocimiento, sin recetas ni materiales nuevos. Prestigio 197–218 en saltos de tres, sin consumirlo ni abrir regiones automáticamente. Se probaron investigación, bloqueo de viaje, desbloqueo y desplazamiento.
3. **Mecánicas reales aisladas:** encuentros manuales/automáticos en ocho regiones; las cinco etapas y publicación de las 97 identidades; muestra/exposición e ingresos en el Museo vigente; conservación de probabilidades e intervalo de naturalistas; persistencia y exportación/importación nativa en memoria. Las investigaciones previas, objetos, recetas, viajes y Legendarios se mantienen iguales.
4. **Arte:** perfiles para las 97 identidades, reutilización de tres bases compatibles y motor regional puro. Laboratorio con la ruta SVG exacta, filtros, tamaños, paginación, comparaciones sexuales y referencia de estilo existente. Se inspeccionaron renders y se corrigieron problemas del primer candidato. 212 combinaciones configuradas pasan XML y no hay dibujos idénticos diferenciados solo por atributos. Los 710 dibujos anteriores siguen idénticos. Son candidatos: el pulido final de volumen, detalles y contraste y la aprobación de publicación siguen pendientes. [Láminas e inventario](art/README.md).
5. **Cartografía:** ocho celdas candidatas, cinco de Australia continental unidas por bordes reales; Nueva Guinea, Tasmania y Nueva Zelanda separadas. Se preservan las otras cinco mallas. [Evidencias originales](cartography/browser-results.json).
6. **Interfaz:** 32 recorridos reales de Atlas → Campo → Cuaderno para las ocho regiones en cuatro resoluciones. Investigación comprada desde el Instituto 3.28, mapa completo y acciones visibles sin desbordamiento. Chromium emulado, no Android físico. [Evidencias](runtime/browser/README.md).
7. **Rendimiento:** Bestiario mantiene 32 tarjetas. Bajo CPU ×4, la mediana de apertura pasa de 134,4 a 144,4 ms y la reapertura de 30,1 a 34,1 ms. Se registra el aumento, junto a muestras, memoria aproximada y serialización; no se declara mejora.
8. **Offline aislado:** reapertura del candidato autocontenido con worker en un origen privado, conservando región, investigación y avistamientos. Esto no equivale a validar el empaquetado modular final 3.29 ni su actualizador.

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

- Resolver con evidencia las cuatro revisiones y completar el pulido/aprobación artística final.
- Incorporar las inserciones revisadas al arranque productivo y preparar su empaquetado real, metadatos, PWA y respaldo seguro; volver a probar esa composición final. El adapter aislado ya prueba las funciones existentes, pero no sustituye la instalación productiva.
- Validar recursos offline separados y actualización segura 3.28 → 3.29; repetir mediciones relevantes sobre la composición final.
- Compilar/verificar APK y firma, conservar exportación/importación y comprobar los workflows/artefactos reales. El entorno tiene Java, pero no se detectó sdkmanager ni SDK Android en la ruta estándar inspeccionada; no se declara una compilación local realizada.
- Verificar publicación y después integrar a main. Actualmente no hay nueva versión, APK ni laboratorio publicado y no se inicia GM-03.

Los informes históricos de la primera cartografía y GM-02A permanecen como evidencias de esas etapas. Los resultados actuales se registran en `validation-isolated-gm02b.json` y en sus logs enlazados; el bloqueo de red no se presenta como si fuera la única tarea de cierre.
