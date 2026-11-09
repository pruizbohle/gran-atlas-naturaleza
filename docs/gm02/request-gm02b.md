# GM-02B — Oceanía jugable y publicación 3.29.0

Continúa el desarrollo de **El Gran Atlas** desde el trabajo realizado en GM-02A.

**Repositorio:** `pruizbohle/gran-atlas-naturaleza`
**Rama de trabajo:** `gm02/oceania`
**Commit de referencia:** `9bf3ebf`
**Versión jugable actual:** 3.28.0
**Versión objetivo:** 3.29.0 — Oceanía

## 1. Instrucción principal

GM-01 está completada y GM-02A ya preparó los datos de Oceanía.

**No repetir las auditorías ni reconstruir los datos.**

Utiliza los documentos existentes en `docs/gm01/`, `docs/gm02/`, el módulo `www/js/oceania-data-v3290.js` y el informe `README_GM02.md`.

El objetivo ahora es completar GM-02B, transformando los datos preparados en contenido totalmente jugable.

## 2. Integración geográfica y zoológica

Incorporar las ocho regiones de Oceanía identificadas por GM-01 y GM-02A:

- Nueva Guinea: 18 presencias.
- Costa nordeste australiana: 13.
- Norte Tropical Australiano: 14.
- Desierto Australiano: 14.
- Tasmania: 12.
- Australia Occidental: 17.
- Australia Oriental: 26.
- Nueva Zelanda: 17.

**Total: ocho regiones, 131 presencias y 97 identidades preparadas.**

Mantener los IDs definidos en GM-02A y la resolución documentada del dingo.

Resolver con evidencia las cinco revisiones científicas pendientes: `Apteryx haastii`, `Lophorina superba`, `Crocodylus novaeguineae`, `Petauroides volans` y `Trichoglossus haematodus`.

Configurar hábitats, horarios, estaciones y clasificación de las especies. Garantizar que todas puedan encontrarse mediante los mecanismos reales de exploración.

No introducir especies adicionales al Excel ni duplicar identidades.

## 3. Ilustraciones y sprites

Esta etapa debe incluir un trabajo artístico completo.

Crear y adaptar los perfiles SVG necesarios para las 97 identidades, priorizando:

- Canguros, ualabíes y otros marsupiales.
- Ornitorrinco y equidnas.
- Koala, wombat y demonio de Tasmania.
- Casuarios, emúes, kiwis y aves del paraíso.
- Loros y cacatúas.
- Reptiles, anfibios y peces propios de Oceanía.

No utilizar siluetas anatómicamente incorrectas para representar animales nuevos.

Reutilizar las bases gráficas existentes cuando correspondan, sin sacrificar identidad visual.

Mantener la coherencia de colores, detalles, tamaños y variantes del juego.

**Realizar una auditoría visual efectiva de las nuevas especies**, con capturas comparativas en un laboratorio independiente. No considerar terminada esta tarea únicamente porque los SVG sean válidos.

## 4. Mapa y progresión

Integrar Oceanía al Atlas mundial existente sin modificar las regiones de los cinco continentes anteriores.

Incorporar:

- Selección continental.
- Ocho hexágonos funcionales.
- Desbloqueo progresivo de regiones.
- Requisitos de investigación, cartografía y prestigio coherentes con el árbol actual.
- Navegación móvil, zoom y desplazamiento.

Evitar nuevas mecánicas innecesarias y dependencias circulares.

El prestigio debe continuar funcionando como requisito, sin consumirse.

## 5. Integración con las mecánicas existentes

Comprobar que Oceanía funcione correctamente con:

- Campo y encuentros automáticos.
- Naturalistas y mejoras.
- Cuaderno e investigación de especies.
- Bestiario, filtros y búsqueda.
- Monografías y publicaciones.
- Inventario y expediciones cuando corresponda.
- Museo y muestras zoológicas.
- Variantes y especímenes especiales.

Las especies deben mantener una única identidad aunque en futuras versiones aparezcan también en océanos o regiones polares.

## 6. Compatibilidad y rendimiento

Conservar completamente el guardado `gran_atlas_v05`.

No modificar las reglas económicas, probabilidades globales ni mecanismos existentes salvo adaptaciones estrictamente necesarias para incorporar Oceanía.

Verificar partidas antiguas y funcionamiento offline.

Realizar pruebas de regresión, rendimiento y navegación móvil en resoluciones de 320, 360, 390 y 412 píxeles.

Controlar especialmente el rendimiento del Bestiario con el catálogo ampliado.

## 7. Publicación

Una vez completada y validada toda la integración:

- Preparar la versión 3.29.0.
- Actualizar metadatos, PWA y Capacitor.
- Publicar la nueva versión web.
- Generar y comprobar el APK Android.
- Comprobar firma y compatibilidad de actualización.
- Mantener disponible la exportación e importación de partidas.

No declarar la versión publicada sin confirmar los workflows correspondientes.

Si existe algún bloqueo técnico o científico que impida completar Oceanía, documentarlo y mantener la versión 3.28.0 sin publicar una integración parcial como definitiva.

## 8. Informe de cierre

Actualizar `README_GM02.md` con los resultados finales.

Indicar:

1. Cantidad de regiones y especies efectivamente incorporadas.
2. Total actualizado del catálogo mundial.
3. Estado de las 131 presencias.
4. Resultado de la auditoría artística.
5. Funcionamiento de los desbloqueos y las mecánicas.
6. Pruebas ejecutadas y resultados.
7. Compatibilidad de guardados.
8. Rendimiento antes y después.
9. Enlaces verificados de juego, laboratorio y APK.
10. Incidencias pendientes.

Al completar, integrar los cambios validados en `main` siguiendo un procedimiento seguro.

**Objetivo final: Oceanía completamente jugable, científicamente trazable, visualmente coherente y estable, sin romper ningún sistema existente.**

El siguiente hito después de esta entrega será GM-03 — Regiones polares, pero no comenzarlo todavía.
