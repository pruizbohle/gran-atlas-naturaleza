# El Gran Atlas 3.41.0 · Experiencia del naturalista y estabilidad móvil

La Brújula del naturalista muestra un objetivo calculado desde la partida en Atlas. Puede plegarse u ocultarse. Sus botones consultan requisitos y registros; comprar, fabricar, reclamar y viajar siguen requiriendo una decisión explícita en su módulo.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Actualizar con respaldo](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3410.html) · [Laboratorio aislado](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-experiencia-v3410.html)

**Publicación web verificada.** El commit [`a343ed2`](https://github.com/pruizbohle/gran-atlas-naturaleza/commit/a343ed23ee5150a500708cd33cc543705a9eb0b7) integra UX-01–UX-07 en `main`. [Actions](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/43239217859) aprobó **720/720 pruebas** (666 referencias intactas + 54 actuales) y desplegó Pages. Los [187/187 hashes publicados](docs/ux3410/published-report.json) coinciden sin diferencias; caché `gran-atlas-v3.41.0-experience-376e1e9631e1`, 185 recursos offline. [Navegación publicada en cinco anchos](docs/ux3410/published-browser/report.json) y [laboratorio publicado offline](docs/ux3410/published-lab/report.json) aprobados, sin errores JavaScript. Android queda pendiente por separado.

## Orientación y navegación

La Brújula prioriza un premio realmente reclamable, un trabajo terminado, una región preparada o un estudio/publicación disponible. Después consulta la cadena de investigación, herramientas, cartografía y prestigio de la próxima etapa; si no encuentra una recomendación fiable ofrece un resumen neutral. No duplica contadores ni concede premios. La preferencia opcional `ux3410.compass` es aditiva y se guarda en `gran_atlas_v05`.

Los requisitos de Atlas abren recetas e investigaciones concretas. Los materiales abren sus fuentes reales, las fichas permiten consultar el Museo y Comercio enlaza sus insumos. Las misiones abren el módulo correspondiente. «Volver» conserva filtros, selección, sección y desplazamiento; no cambia la región del jugador ni ejecuta operaciones económicas.

Un acceso histórico legítimo satisface su condición cartográfica. La ausencia de un mapa físico se presenta como colección voluntaria cuando corresponde; nunca se crea un mapa ni se bloquea de nuevo ese acceso. El Mapamundi físico mantiene su requisito real de seis mapas, independiente del reconocimiento histórico.

## Móvil y avisos

Se conservan diez módulos y las ilustraciones. Atlas sitúa su acción regional antes del mapa en móvil; la barra inferior deja espacio a los controles. Hay foco visible, controles táctiles de 44 px, Tab/Shift+Tab y Escape en el menú. Logros muestra ocho tarjetas por página; Misiones cuatro. Los 80 logros y 37 encargos siguen accesibles.

Se reutiliza el aviso de Sociedad para descubrimientos, etapas, publicaciones, mapas, regiones disponibles, expediciones, contratos y exposiciones. Agrupa eventos simultáneos y pendientes por tipo, respeta movimiento reducido y evita avisar éxitos de escrituras fallidas o importar una partida como si fuera progreso nuevo. No hay otro intervalo ni sonido obligatorio.

## Evidencia y límites

- [UX-01: ocho estados, nueve tareas y fricciones](docs/ux3410/UX-01.md).
- [UX-04: móvil, teclado, retorno y avisos](docs/ux3410/UX-04.md), con [pruebas y capturas de cinco anchuras](docs/ux3410/browser/report.json).
- [UX-05: rendimiento antes/después, incluidas regresiones](docs/ux3410/UX-05.md). Atlas→receta pasa de 6 a 2 interacciones; material→rutas de 3 a 1. La navegación manual conserva sus pasos.
- [Listas de Sociedad](docs/ux3410/society-performance.json): Logros baja de 1.407 a 366 nodos y Misiones de 1.079 a 373. Los cambios de módulo presentan una regresión de latencia en estas ejecuciones; no se afirma una mejora general de velocidad.
- [Actualización real 3.40→3.41](docs/ux3410/pwa/report.json): respaldo exacto, otra ventana bloquea activación, trabajos pendientes, 90 días offline, cobro único, manifiestos, contratos y acceso oceánico histórico sin mapas inventados.
- [Laboratorio offline](docs/ux3410/lab/report.json): iframe opaco `allow-scripts`, motor real, nueve etapas sintéticas y fallo simulado de almacenamiento; no puede leer o sustituir partidas personales.

Las sesiones base y final completaron más de veinte minutos reales, sin errores ni crecimiento de nodos o escuchadores tras estabilizarse. El SHA-256 de app.js de la sesión final coincide con el manifiesto publicado. [Resultados de tiempo real](docs/ux3410/sessions-comparison.json) · [Gráfica de memoria y DOM](docs/ux3410/sessions-comparison.png).

Las pruebas usan Chromium emulado y partidas sintéticas declaradas. No son una prueba de usabilidad con participantes ni un ensayo Android físico. Las sesiones de tiempo real y las ráfagas de 600 cambios se informan por separado. Se fuerza GC solo para comparar extremos de memoria, no como mecanismo del juego.

## Compatibilidad y pruebas

Se conservan 945 especies, 113 regiones, 1.744 presencias, 80 logros, 37 misiones, doce exposiciones y 68 objetos. No cambian precios, probabilidades, ingresos, premios, geometría de animales, contratos, manifiestos, trueques, mapas, investigación ni operaciones activas. Se comparan catálogos completos y una secuencia económica determinista con 0b48f60.

Las **666 pruebas de referencia** permanecen intactas y se ejecutan sobre 3.40 y sus fuentes históricas exactas, en worktrees temporales. Se distinguen de las **54 pruebas actuales** de 3.41: orientación en nueve estados y diez etapas cartográficas, fuentes alcanzables, atajos seguros, preferencias, importación, fallos de almacenamiento, ausencia de recompensas duplicadas, identidad y aislamiento. Las pruebas de navegador comprueban filtros, desplazamiento, tacto, teclado, movimiento reducido, paginación completa y ausencia de desbordamiento en 320/360/390/412/1280.

```sh
node scripts/build-experience-release-v3410.cjs
node scripts/validate-experience-v3410.cjs
python3 scripts/audit-android-readiness-v3410.py
# Con Playwright/Chromium y www servido en 127.0.0.1:8768:
node scripts/check-experience-v3410.cjs
node scripts/check-experience-pwa-v3410.cjs
node scripts/check-experience-lab-v3410.cjs
```

El workflow de Pages valida la revisión completa y las suites separadas. Las tres campañas mundiales desde cero de 3.40 permanecen como evidencia histórica, con sus tests originales; esta versión sin cambios de reglas verifica además catálogos, equivalencia económica y las diez etapas contextuales, sin atribuirse otra ejecución de esas campañas.

## Android

**Pendiente; no se ha generado ni publicado APK.** [Auditoría UX-06](docs/ux3410/UX-06-ANDROID.md). Se mantienen el identificador histórico y AtlasExport/AtlasImport. La huella permanente sigue nula e intacta. Faltan el certificado público real fijado y una prueba física de restauración del candidato exacto; los secretos remotos no se han inspeccionado. No se afirma continuidad por actualización con otra firma ni se exige desinstalar sin respaldo verificado. La publicación web continúa independientemente.
