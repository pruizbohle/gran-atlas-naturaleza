# El Gran Atlas v3.21.0 — Campo jugable

Campo presenta una expedición naturalista de 1842: región compacta, paisaje como foco, animal integrado en el entorno, recompensa inmediata, una acción principal y el siguiente objetivo del Cuaderno. El resto de las pantallas conserva su presentación.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-campo-v3210.html)

## Composición e interacción

- Doce fondos SVG originales reutilizables: bosque, pradera, río, costa, tundra, montaña, estepa, mediterráneo, desierto, humedal, selva y sabana. Cuatro paletas de horario, sin recursos remotos ni efectos continuos.
- El animal aparece directamente en el paisaje. Las observaciones múltiples conservan cada especie y los censos ×2/×3. Se destacan especie nueva, dimorfismo, pigmentaciones, categorías especiales e individuos Legendarios, conservando sus ilustraciones originales.
- La recompensa resume avistamientos, conocimiento, libras y muestras cuando constan en el resultado. Se mantiene la identidad oculta hasta identificar la especie en el Cuaderno.
- «Observar fauna» tiene 56 px de alto en móvil. El progreso enlaza al Cuaderno y el resumen de naturalistas a Investigación. Los controles propios de Campo y sus desplegables tienen áreas táctiles de al menos 44 px.
- Entorno, probabilidades/apoyo del equipo y diario quedan plegados. El encabezado móvil de Campo suprime información repetida; los cambios de estilo se limitan a esta pantalla.
- La llegada del animal usa una animación de 320 ms, sin bucles, desactivada con movimiento reducido. Se conserva el dock, las áreas seguras y el acceso a Respaldos.

## Auditoría de scroll

Chromium Linux, viewport CSS indicado, misma partida de revisión: Zorro rojo, etapa 2, 42 avistamientos y cuatro naturalistas, paneles secundarios cerrados. Referencia anterior `c95c201`; revisión posterior del árbol de trabajo. El scroll es `documentElement.scrollHeight - innerHeight`. El límite de visibilidad móvil descuenta el dock.

| Pantalla | Scroll anterior | Scroll nuevo | Acción, resultado, progreso y naturalistas nuevos |
| --- | ---: | ---: | --- |
| 360 × 740 | 277 px | 0 px | Todos visibles |
| 390 × 844 | 165 px | 0 px | Todos visibles |
| 412 × 915 | 79 px | 0 px | Todos visibles |
| 1440 × 1000 | 53 px | 20 px | Todos visibles |

En 360 × 740 la acción termina en y=496, el progreso en y=563 y el estado automático queda por encima del dock en y=689. El escritorio conserva un pequeño desplazamiento del documento; la información esencial cabe. Abrir detalles permite deliberadamente scroll secundario.

Capturas y rectángulos medidos: [antes](docs/field-v3210/before.json), [después](docs/field-v3210/after.json), [móvil anterior](docs/field-v3210/before-360x740.png), [móvil nuevo](docs/field-v3210/after-360x740.png), [múltiple](docs/field-v3210/group-390x844.png), [Legendario](docs/field-v3210/legendary-390x844.png), [sin encuentro](docs/field-v3210/empty-390x844.png), [doce ambientes](docs/field-v3210/biomas.png). Se revisaron visualmente estas composiciones.

## Laboratorio aislado

La mesa de revisión usa los mismos módulos de escenas y UI que producción, con sprites del catálogo real. Ofrece cuatro tamaños, doce biomas, cuatro horarios, once encuentros y tres estados del equipo. Mide acción, resultado, progreso, naturalistas, alto total, scroll y límite del dock dentro del iframe real. No carga el motor ni lee o escribe la partida. El botón de observar solo cambia el caso de muestra.

## Validación

- **209 pruebas de Node aprobadas**, sin fallos ni omisiones. Incluyen exploración manual/automática, censos, variantes, materiales, Cuaderno, economía, naturalistas, guardado y respaldo.
- **44 combinaciones responsive aprobadas**: once encuentros en 360 × 740, 390 × 844, 412 × 915 y escritorio 1024 × 900. Los cuatro componentes esenciales permanecen visibles y la acción supera 44 px. Se comprobaron además 48 SVG de ambiente/horario y tres estados del equipo.
- Navegador real: observar, cambiar horario, abrir/cerrar filtros, usar ayudas existentes, abrir el Cuaderno desde el progreso y abrir Investigación desde naturalistas. Sin errores JavaScript.
- Sin escritura en la partida desde el laboratorio. Juego y laboratorio cargan sin conexión tras instalar el worker; la exploración y el guardado siguen funcionando offline.
- Ningún reemplazo del resultado durante el tick inactivo medido. Tras renderizar Campo se registra su firma inicial para evitar el antiguo redibujo redundante en el primer tick.
- Conservación exacta de 28 funciones de juego, catálogo, siete módulos artísticos y 3.473 combinaciones de sprites. La simulación avanzada determinista de 1 s, 1 h y 8 h conserva cada byte persistido y el número de llamadas aleatorias de la referencia. No cambian probabilidades, tiempos, topes ni formato del guardado.

[Informe del navegador con los 44 casos y sus medidas](docs/field-v3210/browser-report.json). El navegador usa viewports CSS; no sustituye una prueba física en un teléfono Android.

## Rendimiento

Medianas de nueve aperturas de Campo con sprites en caché, incluyendo layout forzado, sin suites concurrentes: antes 3,7 / 3,6 / 3,0 / 3,8 ms; después 3,3 / 3,6 / 3,9 / 4,4 ms, en el orden de la tabla. Son mediciones locales sin ralentización de CPU; las pequeñas diferencias no demuestran una mejora general de velocidad ni representan hardware Android. Ninguna mediana alcanza 5 ms. El DOM pasa de 280 a 286 nodos en este caso.

No se añaden dependencias de producción, imágenes descargadas, animaciones permanentes, temporizadores ni listeners de juego adicionales. Los cambios parciales de resultado, progreso y estado automático conservan el bucle original del motor. Las evidencias completas incluyen cada ensayo, además de la mediana.

## Archivos

- `www/js/app.js`: proyección visual de estado y composición de Campo; dos accesos de navegación; actualizaciones parciales.
- `www/js/field-scene-v3210.js`, `www/js/field-ui-v3210.js`, `www/css/field-v3210.css`: presentación compartida y estilos limitados a Campo.
- `www/laboratorio-campo-v3210.html`, `www/js/lab/field-lab-v3210.js`: revisión aislada.
- `www/index.html`, `www/sw.js`, `www/js/save-manager.js`, `package.json`, `capacitor.config.json`: recursos, caché y etiqueta de versión 3.21.0; la estructura de guardado y el identificador Android permanecen iguales.
- `tests/field-v3210.test.cjs`, harness y pruebas históricas: cinco pruebas nuevas, carga de los dos módulos visuales y expectativas de versión. Los contratos de regresión de mecánicas y sprites permanecen.
- `scripts/review-field-v3210.cjs`, `scripts/check-field-browser-v3210.cjs`, `docs/field-v3210/`: revisión reproducible y evidencias. Los dos workflows comprueban la sintaxis de los módulos nuevos antes de publicar/compilar.

## Reproducción

Desde la raíz del repositorio, con Node y Chromium instalados:

```sh
node --test tests/*.test.cjs
ATLAS_REVIEW_REF=c95c201 ATLAS_REVIEW_MODE=before node scripts/review-field-v3210.cjs
ATLAS_REVIEW_REF=working ATLAS_REVIEW_MODE=after node scripts/review-field-v3210.cjs
node scripts/check-field-browser-v3210.cjs
```

Los scripts de navegador requieren Playwright disponible para Node y `/usr/bin/chromium`. En el entorno de revisión se usa `NODE_PATH=/workspace/atlas-tools/node_modules`; no se incorpora esa dependencia al juego. El servidor de revisión sirve archivos locales y se cierra al terminar. El worker instala una revisión completa y espera el cierre de clientes anteriores antes de activarse, conservando el contrato offline de 3.20.0.
