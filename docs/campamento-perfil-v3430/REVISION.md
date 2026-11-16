> Diseño aprobado por el usuario con el botón «Volver al Campamento». La candidata integrada y su estado actual se describen en [IMPLEMENTACION-3.43.0.md](IMPLEMENTACION-3.43.0.md). El documento siguiente conserva la revisión del laboratorio previo.

# UX-02 · Campamento y perfil · Laboratorio para revisión

**Estado: fase 3. Pendiente de aprobación del diseño.** Motor real **3.42.0**, base **c9991a5**. La propuesta 3.43.0 no está integrada. No hay commits nuevos, push, PR, merge, despliegue ni APK.

## Acceso

El laboratorio funciona en `http://127.0.0.1:8783/laboratorio-campamento-perfil-v3430.html` dentro del escritorio compartido del entorno de desarrollo. Esta dirección local no es una publicación ni corresponde al localhost del teléfono del usuario.

La automatización del escritorio compartido no pudo abrir la pestaña (el controlador informó `Browser Use could not read requirements` y el proveedor nativo no estaba disponible). El servidor local y los recorridos de navegador se verificaron por separado.

También se entrega `www/laboratorio-campamento-perfil-v3430.html`: un HTML autónomo de aproximadamente 2,75 MB, con código, estilos, catálogos e ilustraciones incluidos. El botón **Opciones → Descargar HTML offline** descarga la misma experiencia. No necesita instalar dependencias para usarla.

1. Elegir una partida sintética A–F.
2. Entrar a cualquiera de las cinco instalaciones y volver con **Plano del Campamento**. Los accesos superiores permiten cambiar de instalación directamente.
3. Abrir el avatar: Perfil, Estadísticas, Guardar y restaurar, Sobre el juego.
4. Comparar con **Expediciones actual** usando el selector superior.
5. El reloj de laboratorio está detenido. **Opciones → Avanzar una hora de prueba** llama al tick original para comprobar regresos. No son recursos ni trabajos de una partida personal.

## Campamento y reutilización

| Instalación | Presentación y funciones originales reutilizadas | Alcance del adaptador |
|---|---|---|
| Astillero | Expediciones científicas, rutas, requisitos, capacidad, viajes, retornos e historial; `scientificExpeditions3300` y `sail` | Cabecera, acceso y regreso al plano |
| Caravana | Comercio: rutas, manifiestos, contratos, mercado, trueques, registro; transacciones originales | Acceso y contexto de Campamento |
| Taller | Inventario → Taller, recetas, materiales, reservas y fabricación original | Acceso directo y enlace al Inventario completo |
| Excavaciones | Museo → Fósiles, yacimientos, trabajos y recogida originales | Presenta trabajos/yacimientos; el Museo conserva montajes y colecciones |
| Prospecciones | Museo → Relictos, expedientes, investigaciones y recogida originales | Presenta trabajos; el Museo conserva catalogación, exposición y registro |

La tienda central es decorativa. Los contadores se derivan de los trabajos registrados. Entrar a una instalación no inicia ni cobra actividades. Las operaciones originales conservan sus costes, tiempos, botín, confirmaciones, reservas y guardas contra repetición.

## Comparación con la interfaz actual

Antes, Expediciones agrupaba la navegación científica y comercial; Taller se encontraba en Inventario y los trabajos paleontológicos en Museo. La propuesta reúne sus cinco entradas en un plano compacto, con SVG locales y la paleta de pergamino y verde del juego.

El identificador `data-tab="expeditions"` sigue existiendo. El adaptador conserva los módulos internos y sus guardas, y extiende el contexto de regreso con la instalación del Campamento. Atlas, Campo, Cuaderno, Investigación, Sociedad, Bestiario, Inventario, Museo y Corona siguen disponibles.

El botón `saveManagerOpen` conserva su identidad y abre ahora el menú del naturalista. **Guardar y restaurar** abre el gestor original completo. El indicador de error se repinta sobre el avatar sin ocultar el mensaje accesible. `save-manager.js` y los mecanismos Android SAF no se modificaron.

El perfil tiene ocho retratos SVG y nombre opcional validado y escapado. Usa el campo opcional `naturalistProfile3430` dentro de la misma partida sintética. Las partidas anteriores conservan el avatar predeterminado. El título procede de un reconocimiento destacado realmente obtenido.

## Escenarios

| Escenario | Contenido sintético |
|---|---|
| A | Principiante, perfil sin configurar, requisitos pendientes |
| B | Primeras mejoras, rutas parciales, expedición científica activa |
| C | Inventario variado, recetas disponibles y viaje comercial |
| D | Dos excavaciones, una terminada, prospección activa y expedientes pendientes |
| E | Varias actividades, publicaciones, logros y perfil configurado |
| F | Partida avanzada con fallo de escritura simulado y acceso a respaldo |

## Verificación

- Base existente: **803 pruebas Node y 61 Python**, correctas mediante `node scripts/validate-android-v3420.cjs`. El constructor de distribución existente también pasó antes de añadir el laboratorio. No se regeneró la distribución de producción para incorporar esta propuesta.
- **14 verificaciones nuevas** de perfil, métricas dinámicas, SVG, aislamiento y ausencia de cambios en archivos versionados.
- Navegador real Chromium: cinco anchos **320, 360, 390, 412 y 1280 px**, seis escenarios por ancho, cinco instalaciones por escenario (**150 entradas y retornos**), controles del plano ≥44 px, sin desbordamiento y sin mutar el progreso al consultar.
- En móvil se usó altura de **844 px**. Las cinco instalaciones caben por encima de la barra inferior; también existe acceso compacto por lista.
- Operaciones reales: salida científica, manifiesto cancelado/confirmado, contrato con repetición de secuencia rechazada, fabricación con descuento de materiales, recogida única de excavación y prospección, nueva investigación y navegación al Museo completo.
- Alias históricos para viaje, Comercio, receta, Fósiles y Relictos; vuelta contextual al Taller; entrada desde el menú móvil conservando `expeditions`.
- Menú por teclado, edición mediante Enter, perfil exportado y restaurado con el gestor JSON real y copia de emergencia. La ausencia de perfil en una partida antigua es compatible.
- Cuota simulada: aviso visible y accesible; perfil no guardado revierte; la descarga del respaldo sigue funcionando.
- Aislamiento: iframe opaco `allow-scripts allow-downloads`, sin `allow-same-origin`; almacenamiento sustituido por mapas en memoria, sin llamadas nativas desde el laboratorio. Marcadores sintéticos de producción y respaldo del navegador permanecieron intactos, con cero escrituras nativas. El iframe no puede acceder al almacenamiento del padre.
- Offline: se descargó el HTML desde su propio control y se cargó su contenido en un navegador sin red; seis escenarios y cinco instalaciones funcionaron, sin dependencias externas.
- Rendimiento: **450 aperturas**, midiendo el objetivo CDP del iframe del motor, después de GC: **1226 → 1226 nodos**, **92 → 92 escuchadores**, heap **5 766 212 → 6 079 164 bytes**. Una inscripción de intervalo original interceptada por el reloj de laboratorio; sin intervalos añadidos.
- Sin errores JavaScript en los recorridos automatizados. Informes reproducibles: [navegador](browser-report.json), [operaciones y memoria](operations-report.json), [construcción y huella del motor](lab-build.json).

Para reproducir desde la raíz del worktree:

```sh
node scripts/build-campamento-lab-v3430.cjs
python3 -m http.server 8783 --bind 0.0.0.0 --directory www
# En otra terminal, con Chromium y Playwright disponibles:
node --test tests/cp3430-ui.test.cjs
node scripts/check-campamento-lab-v3430.cjs
node scripts/check-campamento-operations-v3430.cjs
node scripts/capture-campamento-v3430.cjs
```

## Capturas reales

| Ancho | Campamento | Menú del avatar | Perfil |
|---|---|---|---|
| 320 | [Ver](camp-320.png) | [Ver](avatar-menu-320.png) | [Ver](profile-320.png) |
| 360 | [Ver](camp-360.png) | [Ver](avatar-menu-360.png) | [Ver](profile-360.png) |
| 390 | [Ver](camp-390.png) | [Ver](avatar-menu-390.png) | [Ver](profile-390.png) |
| 412 | [Ver](camp-412.png) | [Ver](avatar-menu-412.png) | [Ver](profile-412.png) |
| 1280 | [Ver](camp-1280.png) | [Ver](avatar-menu-1280.png) | [Ver](profile-1280.png) |

A 390 px: [Astillero](installation-shipyard-390.png), [Caravana](installation-caravan-390.png), [Taller](installation-workshop-390.png), [Excavaciones](installation-excavations-390.png), [Prospecciones](installation-surveys-390.png), [Estadísticas](statistics-390.png), [Respaldos](backups-390.png), [Sobre](about-390.png), [Aviso de almacenamiento](storage-warning-390.png).

Comparación: [Expediciones actual móvil](expeditions-current-390.png) / [Campamento móvil](camp-390.png); [Expediciones actual escritorio](expeditions-current-1280.png) / [Campamento escritorio](camp-1280.png).

## Observaciones y límites

- El motor no conserva una fecha fiable de inicio: se indica expresamente y no se inventa.
- El historial de prospecciones es limitado. Se muestran **regresos conservados**, sin presentarlos como total histórico. Las visitas registradas pueden ser parciales en partidas antiguas.
- Se corrigieron el desbordamiento de la navegación a 320 px, la advertencia que sobresalía del avatar y la actualización inmediata de la identidad tras editar el perfil.
- El navegador administrado bloquea `file://` con `ERR_BLOCKED_BY_ADMINISTRATOR`. Se verificó el contenido autónomo sin red, pero la apertura directa desde el gestor de archivos queda por comprobar en el dispositivo del usuario.
- Las pruebas móviles son de navegador táctil; no se hizo una prueba física en Android ni se compiló una APK. Los módulos largos conservan su desplazamiento y diseño originales.
- El adaptador se inyecta únicamente al construir el laboratorio. La integración de producción, normalización definitiva del perfil y distribución offline del juego quedan para una fase posterior aprobada.

## Estado del repositorio y siguiente paso

`origin/main` se comprobó en `c9991a5`. Se creó el worktree independiente `/workspace/gran-atlas-campamento-lab`, rama `lab/campamento-perfil-v3430`, desde esa referencia. El checkout anterior de `main` permanece intacto. HEAD del laboratorio sigue en `c9991a5`; solo hay archivos nuevos sin seguimiento, sin cambios staged ni modificaciones de archivos previamente versionados.

**Se detiene aquí el trabajo para revisión del usuario.** Aprobar el diseño permitiría iniciar la integración. El commit y la publicación requerirán también la aprobación posterior de la implementación final, según la solicitud.
