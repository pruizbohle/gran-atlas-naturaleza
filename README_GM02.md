# GM-02 · Oceanía — avance GM-02A, expansión no terminada

**Estado: GM-02A preparada; GM-02B iniciada, incompleta y sin publicación. Se mantiene 3.28.0.**

[Avance de GM-02B, evidencias y bloqueo de red](docs/gm02/progress-gm02b.md). Cartografía, ecología, ilustraciones y mecánicas se han integrado y probado en un candidato aislado de 807 identidades, 87 regiones y 1.460 presencias. Cuatro revisiones científicas siguen abiertas; el candidato no se instala en la entrada pública. Las secciones siguientes conservan el alcance de preparación de GM-02A; los resultados actuales están en el informe enlazado.

Base integrada: `main`, commit `564c63c341465f79b556a0a589e0515ef8361e6a` (GM-01). La versión instalada continúa en **3.28.0**, con **710 identidades, 79 regiones y 1.329 presencias**. El contrato nuevo está preparado para integración y no se incluye en `index.html`, service worker ni instaladores del catálogo.

## Entregas y límites

Se divide el trabajo según la sección 11 del [prompt conservado](docs/gm02/request.md), porque la integración exige revisar realmente 35 adaptaciones y 61 perfiles específicos, resolver los avisos científicos y probar los sistemas jugables antes de publicar. No se sustituyen esas tareas por comprobar JSON o SVG válido.

- **GM-02A, entregada:** contrato de datos reproducible desde los cinco documentos obligatorios de GM-01; IDs estables propuestos, preservación de todas las columnas originales, resolución documentada del dingo, procedencia científica y pruebas. Cero cambios en los datos instalados, reglas, ilustraciones anteriores o guardados.
- **GM-02B, pendiente:** resolver los cinco avisos científicos restantes, configurar ecología por especie y presencia, perfiles SVG y revisión renderizada, laboratorio comparativo, mapa compacto de ocho celdas, acceso continental alcanzable, instalación de fauna, pruebas de todos los sistemas, móvil, rendimiento, offline, publicación web y APK con comprobación de firma. Solo esta entrega completa podrá llevar el nombre **3.29.0 — Oceanía**.

## Datos preparados, no altas jugables

| Región de origen | ID estable propuesto | Presencias |
| --- | --- | ---: |
| Nueva Guinea | `oc_nueva_guinea` | 18 |
| Costa nordeste australiana | `oc_costa_nordeste_australiana` | 13 |
| Norte Tropical Australiano | `oc_norte_tropical_australiano` | 14 |
| Desierto Australiano | `oc_desierto_australiano` | 14 |
| Tasmania | `oc_tasmania` | 12 |
| Australia Occidental | `oc_australia_occidental` | 17 |
| Australia Oriental | `oc_australia_oriental` | 26 |
| Nueva Zelanda | `oc_nueva_zelanda` | 17 |
| **Total** | **8** | **131** |

Se conservan las **96 propuestas nominales de GM-01**. La decisión explícita del dingo añade un concepto preparado: **97 identidades preparadas**, **0 IDs actuales reutilizables** según el cotejo fijado. No se inventan regiones de Melanesia, Micronesia, Polinesia, mar abierto o hielo. No se modifica ninguna presencia ni se duplica una identidad por región.

El contrato incluye hoja/fila/HX/ESP, la fila fuente completa de cada presencia, la clasificación original, rareza original y su normalización de presentación, incidencias heredadas y perfiles artísticos preliminares. Las familias y perfiles de GM-01 permanecen preliminares, no certificaciones taxonómicas ni ilustraciones aprobadas.

## Dingo: decisión explícita antes de la incorporación

[Decisión](docs/gm02/dingo-decision.json) · [Extracto de autoridad](docs/gm02/authority-mdd.json)

Se consultó directamente el CSV de **ASM Mammal Diversity Database**, revisión fijada `749c2de16a949099cfc13ccbd2b86d427641e844`, la misma revisión científica utilizada por AM-04. Su registro `1005940`, `Canis_familiaris`, incluye Dingo en los nombres alternativos y declara literalmente `domestic form of Canis lupus; includes dingo as a synonym`. Se conserva la fuente, el hash del CSV completo consultado, los campos relevantes y la licencia MIT.

Para esta integración se adopta **Canis familiaris**, nombre común **Dingo**, ID preparado **oc_esp_canis_familiaris**, con concepto poblacional limitado a los dingos de los dos registros australianos. No se interpreta como presencia de todos los perros domésticos en esas regiones. Es un tratamiento de autoridad elegido explícitamente; no una afirmación de consenso universal.

Se conservan `ESP-0076`, Fauna filas **1298** y **1313**, HX **07-18** y **07-19**. Ambos apuntan a una sola identidad preparada. No se vinculan al `Canis lupus` existente ni se crean `Canis dingo` y `Canis lupus dingo` como identidades adicionales. Un futuro registro del mismo concepto aceptado de `Canis familiaris` deberá reutilizar esta identidad, conservando su contexto poblacional. La decisión original de GM-01 queda intacta como antecedente histórico; su resolución se registra aquí.

## Arquitectura y reproducción

`www/js/oceania-data-v3290.js` es un módulo de contrato **no cargado por producción**. Exporta datos inmutables en Node o navegador, sin instalar catálogos, ejecutar migraciones o acceder a almacenamiento. Su bandera `productionReady=false` y sus estados pendientes evitan confundir preparación con exploración funcional. No expone un objeto `species` instalable por el motor actual: primero deben completarse las configuraciones explícitas de GM-02B. No constituye otra base de datos ni otra arquitectura de juego.

```bash
python scripts/build-oceania-gm02.py
python scripts/build-oceania-gm02.py --check
node --test tests/oceania-gm02a.test.cjs
node --test tests/*.test.cjs
```

El generador lee los entregables ya integrados de GM-01; **no vuelve a extraer ni auditar el Excel**. Comprueba conjuntos completos, referencias, correspondencia de los registros del dingo, ausencia de colisiones con el catálogo actual y hashes de insumos. Los mismos datos se entregan como [JSON independiente](docs/gm02/source-contract.json) para revisión. No hay dependencias nuevas de producción.

## Validación y compatibilidad

Las pruebas específicas verifican: ocho regiones y sus conteos exactos, 131 parejas únicas y filas físicas únicas, 96 conceptos más dingo, 97 IDs propuestos sin colisiones, preservación de avisos científicos, decisión del dingo y fuente de autoridad, inmutabilidad del contrato, reproducción byte por byte y ausencia de instalación en el motor. Los resultados reales de la regresión se guardan en `docs/gm02/validation.json` y `regression-tests.txt`.

Se mantiene `gran_atlas_v05`. No se modifica ningún dato del guardado, inventario, equipamiento, dinero, naturalistas, investigaciones, expediciones, Museo o progreso previo. La regresión comprueba el juego existente; no demuestra todavía encuentros o viajes de Oceanía, porque GM-02B aún no está instalada.

## Pendientes y publicación

1. Revisar con evidencia los cinco conceptos: `Apteryx haastii`, `Lophorina superba`, `Crocodylus novaeguineae`, `Petauroides volans`, `Trichoglossus haematodus`, conservando cada registro y su ámbito. Ninguno se fusiona o renombra por conveniencia artística.
2. Definir hábitats, horarios, estaciones y variantes razonadas; demostrar al menos una combinación alcanzable por presencia. No modificar probabilidades globales ni suponer que todos los biomas o variantes corresponden a todas las especies.
3. Elaborar y revisar las ilustraciones, incluidos rasgos de monotremas, macrópodos, aves corredoras e insulares. Crear laboratorio con los motores reales y capturas; aún no hay dibujos nuevos aprobados.
4. Construir cartografía compacta reutilizando la geometría actual, conservando las cinco mallas anteriores. Definir investigación/acceso sin ciclos ni consumo de prestigio, con pruebas de desbloqueo y viaje.
5. Integrar Campo, Cuaderno, Bestiario y sus fichas regionales; medir rendimiento; verificar guardados históricos, offline y Chromium en 320/360/390/412 px, distinguiéndolo de Android físico.
6. Actualizar metadatos/caché solo al terminar. Publicar y comprobar workflows, artefactos, firma y respaldo seguro. No se ha compilado APK ni comprobado continuidad de firma en esta entrega.

El repositorio y el informe de publicación anterior identifican 3.28.0 como base. La consulta HTTP directa a GitHub Pages durante esta preparación devolvió **403** desde el entorno; no se declara una nueva verificación del contenido servido. No se desencadenan workflows de publicación para esta rama parcial.

No hay enlaces de laboratorio o APK de Oceanía: todavía no existen artefactos publicados y verificados. Siguiente hito: **GM-02B, integración completa antes de la publicación 3.29.0**.
