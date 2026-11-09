# GM-02 — Oceanía completa | El Gran Atlas

Actúa como desarrollador principal, diseñador de videojuegos incrementales, especialista en zoología y responsable de la integridad del proyecto **El Gran Atlas**.

**Repositorio:** `pruizbohle/gran-atlas-naturaleza`

**Versión base:** 3.28.0.

**Objetivo:** incorporar Oceanía al Globo Mundial, utilizando exclusivamente las regiones y presencias zoológicas justificadas por el Excel original y la auditoría GM-01.

Esta será la primera ampliación geográfica después de completar Norteamérica y Sudamérica.

## 1. Verificación previa obligatoria

Antes de modificar el juego:

1. Revisar los últimos commits de `main`.
2. Confirmar la versión realmente publicada.
3. Buscar los entregables de GM-01 en `docs/gm01/`.
4. Leer `summary.md`, `regions.csv`, `species.csv`, `presences.csv`, `issues.csv` e `implementation-plan.md`.
5. Verificar que GM-01 utilizó el Excel original `Atlas_Fauna_Hexagonal_209_900_Especies.xlsx`.
6. Confirmar que sus resultados son reproducibles y que no existen incidencias bloqueantes para Oceanía.

**Regla fundamental:** si GM-01 no está completado, no avanzar ciegamente con la integración. Completar primero la auditoría documental pendiente, siempre que la fuente original esté disponible. Si no es posible, informar exactamente qué falta, sin introducir fauna o regiones no verificadas.

No asumir que la diferencia entre 900 registros originales y 710 identidades actuales equivale directamente a 190 especies nuevas.

## 2. Objetivo geográfico

Incorporar todas las regiones de Oceanía que aparezcan en el Excel original y estén pendientes de implementación.

Revisar específicamente la presencia de:

- Australia y sus distintas regiones ecológicas.
- Tasmania.
- Nueva Zelanda.
- Nueva Guinea.
- Archipiélagos de Melanesia.
- Micronesia y Polinesia.
- Otras islas o regiones oceánicas contempladas en la fuente.

**Estos territorios son referencias de búsqueda, no una autorización para crear regiones nuevas.** El número y la identidad de los hexágonos deben proceder del Excel y GM-01.

Excluir regiones oceánicas abiertas o polares reservadas para las siguientes etapas, salvo que GM-01 determine explícitamente otra clasificación.

## 3. Integración de fauna

Para cada región nueva:

- Obtener sus especies desde el Excel auditado.
- Reutilizar los IDs científicos ya presentes.
- Crear nuevos IDs únicamente cuando corresponda a una identidad no implementada.
- Conservar los nombres científicos y las equivalencias taxonómicas documentadas.
- Mantener todas las presencias originales verificadas.
- No duplicar especies compartidas con Asia, África, América o Europa.

La identidad de una especie debe ser mundial, independientemente del continente donde fue incorporada originalmente.

Ejemplo conceptual: una especie presente en Asia y Oceanía debe tener un único registro zoológico, con ambas distribuciones, y conservar su progreso de descubrimiento.

No crear taxones adicionales basándose únicamente en nombres comunes diferentes.

Separar las especies pendientes de revisión taxonómica y resolverlas con evidencia antes de incorporarlas.

## 4. Clasificación zoológica

Mantener las cuatro categorías actuales:

- Mamíferos.
- Aves.
- Reptiles y anfibios.
- Peces.

Los pulpos y calamares mantienen la clasificación interna previamente acordada en el juego, sin introducir una quinta categoría.

Respetar las clasificaciones y subgrupos efectivos del Bestiario.

No modificar la taxonomía de animales ya incorporados fuera del alcance de Oceanía.

## 5. Sprites y representación artística

Oceanía debe incorporar animales visualmente reconocibles y anatómicamente correctos.

Trabajar sobre los motores gráficos SVG existentes de mamíferos, aves, herpetofauna y peces.

Priorizar una representación adecuada de los grupos zoológicos que efectivamente aparezcan en la fuente, especialmente cuando requieran morfologías diferentes a las actuales.

Por ejemplo, si están presentes, revisar cuidadosamente marsupiales, monotremas, aves corredoras, loros, reptiles y especies insulares.

**No representar animales con siluetas de familias incorrectas.**

Mantener:

- Estilo ilustrativo actual.
- Tamaños y proporciones visuales.
- Paletas coherentes.
- Variantes albinas y melánicas cuando corresponda.
- Dimorfismo sexual respaldado.
- Especímenes especiales ya configurados.

Reutilizar bases anatómicas compatibles cuando realmente lo sean.

No modificar indiscriminadamente ilustraciones aprobadas de los continentes anteriores.

Crear un laboratorio comparativo para revisar las nuevas ilustraciones, incluyendo ejemplos de especies compartidas y variantes.

## 6. Cartografía de Oceanía

Integrar las regiones nuevas en el Atlas mundial existente.

Requisitos:

1. Respetar la geometría y el lenguaje visual actual.
2. Incorporar Oceanía como continente seleccionable.
3. Distribuir las regiones con coherencia geográfica.
4. Mantener etiquetas y selección de hexágonos.
5. Evitar solapamientos y colisiones de IDs.
6. Garantizar navegación táctil, zoom y desplazamiento.
7. Conservar todos los continentes existentes sin alteraciones.

Las islas y archipiélagos pueden requerir una representación continental compacta.

Antes de implementarla, revisar el comportamiento del renderizador actual y reutilizar sus componentes.

No sustituir el mapa por un motor cartográfico completamente nuevo.

## 7. Acceso y desbloqueo

Analizar el sistema actual de progresión continental.

Oceanía debe desbloquearse mediante una progresión coherente con los continentes existentes.

Considerar los mecanismos ya disponibles:

- Prestigio.
- Investigación.
- Partes de mapa.
- Fabricación de mapas.
- Cartografía y navegación.
- Viajes o expediciones.

No crear automáticamente una mecánica nueva si los sistemas actuales permiten resolver el desbloqueo.

Si es necesario incorporar un mapa de Oceanía o una investigación específica, explicar su función, requisitos y relación con el árbol actual.

Mantener las reglas generales del juego:

- El prestigio funciona como requisito y no se consume.
- Los materiales se consumen únicamente cuando su receta lo establece.
- Las investigaciones respetan sus dependencias.
- Los continentes desbloqueados anteriormente mantienen su acceso.

No alterar precios o probabilidades históricos para acelerar la expansión.

## 8. Jugabilidad de las nuevas regiones

Cada región incorporada debe funcionar realmente.

Comprobar:

- Acceso desde el Atlas.
- Selección de región.
- Exploración en Campo.
- Aparición de fauna correspondiente.
- Avistamientos y sus multiplicadores.
- Experiencia y progresión de naturalistas.
- Registro en Cuaderno.
- Registro en Bestiario.
- Monografías y publicaciones.
- Variantes y encuentros especiales.
- Navegación desde fichas zoológicas hacia las regiones disponibles.

No basta con mostrar nuevos hexágonos: deben ser jugables y estar conectados con los sistemas existentes.

Prestar especial atención a especies con varias regiones y continentes, para evitar multiplicar sus registros o reiniciar sus avances.

## 9. Integridad y compatibilidad

Antes de la incorporación, registrar los valores reales de:

- Especies únicas.
- Regiones funcionales.
- Presencias especie-región.
- Identidades taxonómicas duplicadas.
- Regiones por continente.

Después de implementar, generar un informe que permita comprobar exactamente qué se agregó y qué se reutilizó.

Mantener:

- Guardado `gran_atlas_v05`.
- Compatibilidad con partidas antiguas.
- Inventario y monedas.
- Naturalistas y sus mejoras.
- Investigaciones.
- Expediciones y tiempos pendientes.
- Museo, fósiles, relictos y artefactos.
- Cuaderno, Bestiario y publicaciones.
- Progresión de los cinco continentes anteriores.

No cambiar IDs antiguos ni producir pérdida de datos durante la migración.

## 10. Rendimiento y pruebas

Mantener las optimizaciones desarrolladas en las versiones 3.20.0 a 3.28.0.

Evitar renderizar todas las especies del catálogo simultáneamente.

Mantener paginación, generación diferida de SVG y reutilización de cachés donde corresponda.

Probar:

1. Integridad del catálogo mundial.
2. Ausencia de duplicados científicos.
3. Total de regiones y presencias de Oceanía.
4. Accesibilidad real de cada especie.
5. Colisiones cartográficas y de IDs.
6. Progresión continental y desbloqueos.
7. Guardados anteriores.
8. Reapertura offline.
9. Rendimiento del Bestiario y Campo.
10. Funcionamiento en pantallas móviles de 320, 360, 390 y 412 píxeles.
11. Navegación entre continentes.
12. Todas las pruebas de regresión existentes.

Documentar errores y regresiones, sin ocultar resultados desfavorables.

## 11. Publicación y versión

Si la integración completa resulta viable, preparar la siguiente versión jugable: **3.29.0 — Oceanía**.

Actualizar versión web, metadatos, PWA y Capacitor de manera consistente.

Verificar la construcción y publicación mediante GitHub Actions.

Preparar:

- Actualización web segura con respaldo.
- Laboratorio visual comparativo.
- APK Android de prueba.
- Informe de integridad.
- Registro de cambios.

Comprobar la firma del APK respecto de la versión anterior y advertir si impide una actualización directa.

No afirmar que el APK está disponible ni que los workflows terminaron correctamente hasta comprobarlo.

Si el trabajo requiere dividir Oceanía en varias entregas, proponer subfases GM-02A y GM-02B con límites precisos. No publicar una versión que declare Oceanía completa si todavía faltan regiones o presencias previstas en el Excel.

## 12. Entrega esperada

Crear un informe `README_GM02.md` que incluya:

- Versión anterior y nueva.
- Regiones añadidas.
- Especies nuevas.
- Especies existentes reutilizadas.
- Nuevas presencias.
- Ilustraciones creadas o adaptadas.
- Sistemas de desbloqueo incorporados.
- Pruebas funcionales.
- Rendimiento comparativo.
- Compatibilidad de guardados.
- Incidencias pendientes.
- Enlaces de juego, laboratorio y APK, si están realmente publicados.

Al finalizar, presentar un resumen claro de lo incorporado y explicar cuál es el siguiente hito recomendado.

**Criterio de éxito:** Oceanía integrada, funcional, ilustrada y accesible, sin duplicar identidades científicas ni romper la arquitectura, el progreso o los sistemas existentes de El Gran Atlas.

Mantener el principio del proyecto: ampliar el contenido mundial sobre una base estable, preservando todo lo que ya funciona.
