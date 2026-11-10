# GM-05 — Consolidación Mundial
## El Gran Atlas · Versión objetivo 3.35.0

Actúa como desarrollador principal de El Gran Atlas, auditor de datos zoológicos, diseñador de videojuegos incrementales y especialista en rendimiento, compatibilidad y pruebas automatizadas.

**Repositorio:** `pruizbohle/gran-atlas-naturaleza`  
**Rama base:** `main`  
**Commit de referencia:** `9da9808`  
**Versión base:** 3.34.0  
**Versión objetivo:** 3.35.0  
**Rama nueva:** `gm05/consolidacion-mundial`

## 1. Objetivo

Consolidar todas las expansiones del juego desde GM-01 hasta GM-04C.

Ya no necesitamos ampliar el mapa. Necesitamos comprobar la integridad global, detectar problemas reales, corregirlos sin comprometer las partidas y mejorar la estabilidad.

No limitarse a elaborar un README. Ejecutar auditorías y correcciones verificables, documentando lo realizado.

No modificar los datos originales únicamente para hacer coincidir contadores o superar pruebas.

**No agregar regiones ni especies nuevas**, salvo que una decisión científica documentada demuestre una corrección indispensable y previamente justificada. Priorizar conservar los IDs y el contenido existente.

## 2. Línea base

Comprobar:

- 945 identidades zoológicas.
- 113 regiones funcionales.
- 1.744 presencias del juego.
- 1.574 filas originales de fauna del Excel.
- 900 filas del catálogo fuente.
- 209 celdas fuente: 103 pobladas y 106 reservadas.
- Guardado `gran_atlas_v05`.

Consultar obligatoriamente:

- `docs/gm01/summary.md`
- `docs/gm01/summary.json`
- `docs/gm01/implementation-plan.md`
- `docs/gm01/species.csv`
- `docs/gm01/presences.csv`
- `docs/gm01/issues.csv`
- `docs/gm04c/world-closure.md`
- `docs/gm04c/world-closure.json`
- `README_V3300.md` hasta `README_V3340.md`

No reconstruir la auditoría GM-01 desde cero ni sobrescribir sus datos históricos.

## 3. GM-05A — Auditoría integral de catálogo

Comprobar las 945 identidades, sus nombres científicos, grupos, familias, rarezas, regiones, hábitats y configuraciones.

Detectar:

- Duplicaciones zoológicas efectivas.
- Sinónimos tratados incorrectamente como identidades diferentes.
- Confusiones entre especies y subespecies.
- Variaciones de nombres que puedan provocar registros duplicados.
- Inconsistencias de categoría o familia.
- Regiones donde una identidad no debería aparecer.
- Presencias imposibles de encontrar.
- Referencias sin especie o región válida.

Prestar especial atención a:

1. Panthera pardus y las subespecies de leopardo existentes.
2. Gorilla beringei y el gorila de montaña.
3. Canis aureus frente a Canis lupaster.
4. Conceptos heredados de Arapaima, Electrophorus, gatos de pajonal y tigrillos.
5. Correcciones taxonómicas de Oceanía y mares.
6. Especies compartidas entre mar superficial, profundo y abisal.

No fusionar ni eliminar identidades únicamente por semejanza nominal.

Para cada decisión científica relevante, registrar autoridad consultada, concepto utilizado, región afectada y consecuencias sobre el juego.

Si una discrepancia no puede resolverse con evidencia suficiente, mantener el comportamiento existente y documentarla como pendiente.

## 4. Conciliación completa de las fuentes

Revisar las 1.574 filas originales y sus correspondencias reales con producción.

Confirmar que cada registro tenga:

- Identificador de origen.
- Fila y hoja originales.
- Región de destino.
- Identidad zoológica.
- Equivalencia o diferencia justificada.
- Estado de revisión.

El diagnóstico anterior identifica:

- 415 presencias incorporadas durante GM-02 a GM-04.
- 1.148 concordancias históricas.
- Diez registros con conflictos de rango.
- Una diferencia taxonómica o distributiva documentada.

Conciliar estos resultados con la versión 3.34.0 sin declarar equivalencias inexistentes.

Revisar los 47 IDs históricos que no tienen correspondencia canónica aprobada con el catálogo fuente. Su ausencia en el Excel no justifica eliminarlos.

No imponer artificialmente un catálogo de exactamente 900 especies: las 945 identidades actuales incluyen fauna adicional y decisiones posteriores.

## 5. Registro mundial de incidencias

Tomar las 413 incidencias documentadas en GM-01 y crear una tabla derivada con cuatro estados:

- Resuelta.
- Pendiente.
- Contexto histórico.
- Sin defecto demostrado.

Vincular cada incidencia con decisiones y commits posteriores.

Priorizar las que puedan afectar:

- Identidad zoológica.
- Presencia geográfica.
- Desbloqueos.
- Encuentros.
- Guardados.
- Duplicaciones.
- Funcionamiento de los módulos.

No considerar que una advertencia histórica sigue pendiente solo porque aparece en un CSV antiguo.

No modificar los informes históricos de GM-01; publicar una vista vigente, reproducible y trazable.

## 6. GM-05B — Economía y progresión global

Auditar la progresión completa del mundo.

Verificar los incrementos de prestigio:

| Área | Incremento |
|---|---:|
| Europa | +1 |
| Asia | +2 |
| África | +3 |
| Norteamérica | +4 |
| Sudamérica | +5 |
| Oceanía | +6 |
| Polos | +7 |
| Mares superficiales | +8 |
| Océanos profundos | +9 |
| Fosas abisales | +10 |

El requisito final actual es 485.

Simular distintas partidas, comenzando desde cero y con estados intermedios y avanzados.

Evaluar:

- Tiempo para desbloquear cada continente.
- Conocimiento y libras generados.
- Materiales necesarios para fabricación.
- Rentabilidad del Museo.
- Utilidad de Comercio.
- Expediciones de 4, 8, 12 y 24 horas.
- Sondeos y muestreos de 60, 180 y 300 segundos.
- Progreso de naturalistas y mejoras.
- Obtención de especímenes especiales.
- Dificultad de completar las cinco etapas del Cuaderno.
- Tiempos prolongados de inactividad y retorno.

Realizar simulaciones reproducibles con semillas controladas, varios escenarios y rangos de resultados. Diferenciar tiempo simulado de tiempo humano real de juego.

Identificar especialmente cuellos de botella y períodos de espera excesivos.

**No modificar probabilidades, costos o recompensas globales basándose en una sola simulación.**

Antes de cualquier ajuste, entregar evidencia del problema y comparación entre el comportamiento anterior y el propuesto.

Corregir únicamente desequilibrios demostrados y preservar partidas avanzadas.

## 7. GM-05C — Auditoría mundial de sprites

Revisar visualmente los sprites de las 945 identidades.

Organizar un laboratorio mundial por:

- Mamíferos.
- Aves.
- Reptiles y anfibios.
- Peces y cefalópodos.

Agregar filtros por familia y búsqueda de especies.

Evaluar prioritariamente:

- Anatomía incorrecta.
- Siluetas de familias equivocadas.
- Diferencias insuficientes entre especies similares.
- Escalas desproporcionadas.
- Errores de dimorfismo.
- Variantes albinas, melánicas y especiales.
- Animales con dibujos excesivamente genéricos.
- Artefactos o desbordamientos SVG.

Reutilizar los laboratorios artísticos existentes.

No rediseñar masivamente los 945 sprites. Clasificar los problemas y corregir primero los demostrables.

Preservar el estilo artístico actual.

Documentar cada intervención visual con capturas anteriores y posteriores.

## 8. GM-05D — Rendimiento y estabilidad

Ejecutar pruebas prolongadas de:

- Campo y naturalistas.
- Bestiario completo.
- Cuaderno.
- Atlas mundial.
- Museo.
- Inventario y fabricación.
- Comercio.
- Expediciones.
- Sondeos y muestreos.
- Investigaciones.
- Actualización PWA.

Comprobar especialmente:

1. Uso de memoria con sesiones prolongadas.
2. Acumulación de temporizadores.
3. Renderizados innecesarios.
4. Reaperturas del Bestiario.
5. Cambios rápidos entre pestañas.
6. Expediciones simultáneas permitidas.
7. Operaciones pendientes al cerrar la aplicación.
8. Retornos después de 8, 24, 72 horas o más.
9. Guardado, exportación e importación.
10. Compatibilidad de partidas antiguas.
11. Errores JavaScript y bloqueos de interfaz.

Medir rendimiento en Chromium a 320, 360, 390, 412 y 1280 píxeles.

No declarar pruebas en Android físico si no se ha utilizado realmente un dispositivo.

Priorizar arreglar errores funcionales y fugas de memoria antes que optimizaciones cosméticas.

## 9. Compatibilidad absoluta

Conservar el guardado `gran_atlas_v05`.

Ninguna corrección puede eliminar o reiniciar:

- Animales descubiertos.
- Avistamientos.
- Monografías.
- Prestigio.
- Regiones desbloqueadas.
- Inventario.
- Objetos fabricados.
- Investigaciones.
- Libras y conocimiento.
- Mejoras.
- Museo y fósiles.
- Expediciones comerciales.
- Operaciones científicas pendientes.

Ejecutar exportación/importación desde versiones anteriores y comprobar que las migraciones son aditivas.

Si una corrección taxonómica afecta una identidad utilizada por una partida, diseñar y probar una migración que preserve su historial.

Evitar toda limpieza destructiva automática.

## 10. Desarrollo por etapas

Organizar en commits independientes:

**GM-05A:** integridad, incidencias y conciliación taxonómica.

**GM-05B:** auditoría de economía, prestigio y fabricación; correcciones respaldadas por pruebas.

**GM-05C:** revisión artística mundial y correcciones de sprites.

**GM-05D:** estabilidad, rendimiento y compatibilidad.

**GM-05E:** integración, pruebas finales, documentación y publicación.

No mezclar grandes cambios de economía, taxonomía y arte dentro de un mismo commit.

Continuar con las etapas después de superar sus pruebas correspondientes.

Si una incertidumbre científica impide una corrección puntual, documentarla y continuar con las tareas independientes; no inventar una decisión para cerrar artificialmente la auditoría.

## 11. Publicación

Generar `README_V3350.md` con:

- Auditorías ejecutadas.
- Problemas confirmados.
- Problemas corregidos.
- Incidencias pendientes.
- Decisiones taxonómicas.
- Resultados de simulaciones.
- Sprites intervenidos.
- Rendimiento comparativo.
- Compatibilidad de guardados.
- Pruebas automatizadas.
- Limitaciones conocidas.

Publicar 3.35.0 solamente cuando existan cambios productivos justificados, todas las pruebas pasen y la compatibilidad esté validada.

Si la auditoría concluye sin cambios funcionales necesarios, conservar la versión 3.34.0 y entregar el informe GM-05 sin incrementar artificialmente la versión.

No incorporar fauna, regiones, nuevas economías o expansiones durante esta fase.

Mantener la publicación Android como tarea independiente. No generar APK debug temporal ni afirmar que está validado en dispositivo.

## 12. Resultado esperado

Terminar GM-05 con una base mundial estable, científicamente trazable y equilibrada.

Entregar un diagnóstico verificable de los 945 animales, 113 regiones y 1.744 presencias, incluyendo los problemas reales encontrados y las soluciones aplicadas.

La prioridad es que el juego completo sea consistente, seguro para las partidas existentes y suficientemente estable para futuras mejoras de jugabilidad.

**Comienza revisando el diagnóstico `docs/gm04c/world-closure.md` y ejecutando GM-05A.** No repitas auditorías ya completadas si puedes reutilizar sus resultados.