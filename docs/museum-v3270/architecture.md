# Alcance técnico y conservación de reglas

La renovación es una capa de presentación. `AtlasMuseumUI` genera las cinco salas y gestiona un único diálogo reutilizable. Los modelos `museum*3270()` derivan los datos del estado existente y los botones llaman a las funciones económicas originales, que vuelven a validar cada operación.

`tests/museum-v3270.test.cjs` elimina exclusivamente los bloques aditivos delimitados `M-3270` y compara el resultado completo con el `app.js` publicado de 3.26.0 (`a12d7ed`). Su SHA-256 es `b10346f80d120657428d41891aa7efb7f638bdee86053240064465322d903f15`. Esto incluye catálogos, geometría, motores, requisitos, probabilidades, economía, observación, guardado, temporizadores y los otros cuatro módulos de presentación. Los fixtures científicos e históricos mantienen sus valores originales.

## Flujo de presentación

- Exposiciones genera las vitrinas animales reales y hasta doce gabinetes científicos por página. Los gabinetes no consumen capacidad animal ni reciben una renta nueva.
- Muestras filtra las especies publicadas con estudio 5/5 y conserva muestras históricas ya expuestas. Ordena el conjunto de datos y recorta 32 entradas antes de pedir sus SVG. Las 710 identidades siguen accesibles por 23 páginas en una partida que las tenga publicadas.
- Fósiles presenta las ocho reconstrucciones; sus nueve componentes, cuatro registros y tres proyectos generan sus ilustraciones al abrir el desplegable. Al reabrirlo se conserva el contenido; al cambiar de sala se reconstruye únicamente lo necesario.
- Relictos calcula nueve expedientes y oculta nombre, latín e ilustración de los que no tienen indicios. Conserva los conjuntos, hitos y análisis comparativo. Estos registros siguen separados del catálogo zoológico.
- Artefactos conserva las cinco recetas y muestra también las piezas catalogadas retiradas de exposición. La ficha permite consultar su descripción y los materiales de referencia con las existencias actuales.
- La colección especial de legendarios utiliza el `renderLegendaryCollection()` original, bajo demanda. No es una sexta sala y solo revela individuos encontrados.

Los filtros, orden, páginas, desplazamientos, desplegables y diálogo se mantienen en `museumUI3270`, fuera de la partida. La sala seleccionada utiliza el campo histórico `museumView`. No se añaden campos permanentes. Los identificadores de interfaz son tokens temporales; los trabajos se resuelven desde sus registros vigentes y no se acumulan en una caché de trabajos terminados.

## Temporizadores y diálogos

El temporizador existente `syncMuseumTimers(now)` actualiza las barras y el estado de los trabajos visibles. No se registra ningún intervalo, proceso de tick ni autoentrega adicional. Se usa un inicio válido cuando existe; si el guardado solo tiene `endAt`, se deriva la barra de la duración real del yacimiento o prospección, indicando esa procedencia. Sin duración fiable no se muestra una barra inventada. Las fechas del historial proceden de `at` y se presentan en America/Santiago; no se reconstruyen recompensas antiguas ausentes.

El diálogo nativo tiene cierre, Escape, toque exterior, foco contenido y restaurado, fondo inerte y bloqueo de desplazamiento. El contenido se genera solo para la pieza consultada y se vacía al cerrar. Un render global lo cierra para evitar acciones sobre una ficha obsoleta. El motor vuelve a comprobar propiedad, capacidad, materiales y requisitos antes de actuar.

## Actualización y Android

Se conserva la clave `gran_atlas_v05`, el formato de exportación, los plugins nativos y el ID `com.elgranatlas.naturaleza.beta314`. Cambia únicamente el metadato de versión exportada. La actualización mantiene la copia previa y aceptación explícita; utiliza el helper seguro `pwa-update-v3260.js`, incluido su control de entrega al trabajador preparado. La entrada nueva `actualizar-v3270.html` evita depender del HTML de inicio retenido por una instalación antigua. No se eliminan los accesos de recuperación anteriores.

El catálogo del laboratorio Atlas se regenera únicamente para mantener su shell de versión y enlaces de recursos en consonancia con `index.html`; no cambian regiones, coordenadas ni reglas del Atlas.
