# 3.32.0 — Mares superficiales (GM-04A)

Doce mares jugables y 192 filas originales de Fauna: **923 identidades zoológicas, 106 regiones y 1.697 presencias**. Son **95 identidades nuevas y 18 reutilizadas**, calculadas desde los 112 nombres fuente y 113 identidades efectivas después de las correcciones documentadas. Se mantienen intactos los 828 animales y 94 regiones anteriores. No se inicia GM-04B/C, no se crean celdas vacías y no se genera APK.

## Datos y ciencia

[Decisiones, fuentes e incidencias](docs/gm04a/decisions.md) · [Catálogo trazado](docs/gm04a/catalog.json). Cada una de las 192 filas conserva hoja, fila Fauna, HX, ESP, nombre común y científico originales, rareza, bioma y concepto efectivo. Se usan los doce IDs semánticos GM-01 para evitar las tres colisiones con África. El Excel no se reaudita ni se reconstruye.

Las correcciones por ámbito indopacífico y subárea se documentan separadas de los nombres originales: Aetobatus ocellatus, Eudyptes filholi y Octopus tetricus. Para Balaenoptera edeni se adopta explícitamente el tratamiento de SMM, incluyendo brydei bajo una identidad; se reconoce que otras autoridades adoptan otro tratamiento. Los matches GBIF son evidencia de nomenclatura y familia, no certificados de ocurrencia. Las fuentes y límites editoriales están vinculados en las decisiones.

## Juego y progresión

Mapa de cuencas con costa, arrecife, archipiélago, mar abierto, mar austral y plataforma. Sus posiciones son un esquema de navegación, no distancias ni coordenadas reales derivadas de HX. Los encuentros usan subáreas por presencia, sin alterar los registros ecológicos de especies heredadas. Cetáceos en superficie respiratoria, fauna arrecifal en arrecife/costa, Isistius nocturno y calamar gigante poslarvario; no se habilitan adultos batiales ni fauna exclusiva de profundidad.

Investigación **Navegación de mares superficiales** tras Polos: £5200 y 4600 conocimiento. Prestigio 332, 340, 348, 356, 364, 372, 380, 388, 396, 404, 412 y 420. No se consume. Se reutilizan las cinco preparaciones acumulativas y el Cuadrante transatlántico; no se agrega un sexto instrumento redundante. Comercio mantiene exactamente sus rutas de 4/8/12/24 h, costes, recompensas, mercado y trueques.

Cefalópodos: categoría jugable **Peces**, clase biológica **Cephalopoda**, sin afirmar que sean peces. La categoría Notable usa la tasa existente y permite completar el quinto nivel del Cuaderno. Nuevas identidades integradas en Campo, naturalistas, Cuaderno, monografías, Bestiario paginado, Museo, investigaciones y guardado `gran_atlas_v05`.

## Arte, rendimiento y validación

95 láminas por familia, búsqueda y escalas 64/80/120 px. [Revisión visual](docs/gm04a/art-review.md), tres tableros y 51 capturas por familia. Las láminas fueron inspeccionadas renderizadas y se corrigieron las geometrías, además de comprobar su XML y límites. Los SVG previos, incluidas variantes y sexos configurados, permanecen exactos.

Pruebas diferenciadas: **430 históricas de 3.30.0**, **11 históricas de producción 3.31.0** y **12 del runtime actual 3.32.0**. Las dos líneas históricas se ejecutan sin editar en worktrees de sus commits reales; no se presentan como tests del catálogo actual. Las pruebas actuales contrastan los 828 perfiles/94 regiones, todas las ilustraciones previas, recetas, investigaciones, Comercio, tasas e intervalos; recorren las 192 presencias mediante filtros y encuentros reales, y comprueban monografías, Museo y partidas avanzadas con viaje de 24 h, exportación/importación y pago único tras 72 h.

Bestiario, Chromium CPU×4, ocho aperturas, catálogo completamente identificado: primera apertura 308,1→263,2 ms; mediana de reapertura 148,9→154,4 ms. La variación de reapertura es aproximadamente +3,7%, no una mejora; son medidas de emulación con dos frames incluidos, no de teléfono físico. Se conservan 32 tarjetas por página. No se informa memoria de heap porque el entorno no devolvió esas métricas. [Informe medido](docs/gm04a/performance-report.json).

Comandos reproducibles:

- `node scripts/validate-marine-v3320.cjs`
- `node --test tests/marine-v3320.test.cjs`
- `node scripts/check-marine-art-v3320.cjs`
- `node scripts/check-marine-performance-v3320.cjs`
- `python3 scripts/build-marine-data-v3320.py`

Las pruebas móviles son Chromium emulado. Android y su firma permanente permanecen independientes.

## Publicación

Pendiente de actualización PWA final, GitHub Actions y comprobación del paquete publicado.

## Recursos para GM-04B, sin iniciar esa fase

Se podrán reutilizar el índice de presencias por región, IDs marinos estables, filtros temporales, plantillas familiares de cetáceos/cefalópodos, laboratorio con búsqueda y escalas, mapas delegados, catálogo trazado, migración aditiva y comprobación de viajes pendientes. Los cinco sectores profundos y sus 44 filas permanecen fuera de esta implementación; no se añaden datos, regiones ni métodos de inmersión para ellos.
