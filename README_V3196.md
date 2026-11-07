# El Gran Atlas v3.19.6 — Albinismo y melanismo

La variante conserva exactamente la ilustración normal y cambia solamente sus pinturas. No se modifican especies, identificadores, rarezas, economía, progresión, mapas, expediciones, museo, investigaciones, inventario ni probabilidades.

## Disponibilidad y nomenclatura

- Catálogo efectivo: **487 especies**; **251 con Albino**, **256 con Melánico**, **455 con Notable**. Ninguna variante nueva.
- Se homologan **244 configuraciones históricas**: 241 «Leucístico» y 3 «Leucística». Las 7 configuraciones anteriores «Albino» completan las 251 actuales.
- Las 252 etiquetas «Melánico» y 4 «Melánica» se presentan exclusivamente como **Melánico**.
- Tokens de dibujo: `albino`, `melanico`; Notable mantiene `alfa`.
- «Albino» agrupa las variantes pálidas por una decisión del juego, sin afirmar equivalencia biológica.
- [Inventario completo y controles zoológicos](docs/pigmentacion-v3196/inventario.json), regenerable con `node scripts/pigmentation-inventory.cjs`.

La cifra 244 corresponde al catálogo histórico, no a partidas de personas. La actualización reconoce cualquier descubrimiento guardado bajo esas etiquetas; no se ha accedido a partidas reales para contar registros migrados.

## Auditoría y arquitectura artística

La ruta anterior aplicaba una paleta especial en los motores y volvía a transformar el resultado. Se perdían valores de luz y se reducían patrones a pocos colores. Ahora `getSpriteMarkup` obtiene el SVG normal mediante los motores existentes, lo conserva en `spriteCache` y realiza una sola pasada `transformPigmentation`. El marcador `data-pigmentation` impide repetirla. Las claves de caché separan especie, variante y sexo válido.

Se mantienen los motores de mamíferos 3.19.4, aves 3.19.3, herpetología 3.19.2b y peces 3.19.1. El motor de peces incrustado en `app.js` coincide con el módulo externo utilizado por el laboratorio. No se cargan motores nuevos en la entrada del juego. `applySkin` permanece como auxiliar compatible; la nueva ruta evita precolorear el sprite.

- Albino: marfil, perla y crema con valores continuos; contornos gris cálido, sombras suaves y ojos rosa apagado solamente en las marcas oculares reconocidas. Se conservan colores diferenciados de tejidos expuestos.
- Melánico: carbón y gris azulado con sombras y luces discretas. Los reflejos oculares son pequeños y atenuados; no se agregan filtros ni reflejos blancos grandes.
- Astas y cuernos mantienen un valor cálido diferenciado mediante la pintura de queratina existente.
- Ajuste específico para las rosetas de **leopardo africano, leopardo persa y leopardo nublado**, y para las rayas del **tigre siberiano**: el patrón usa valores de pigmento separados del contorno. No se añaden patrones a otros félidos. El mismo tratamiento de rosetas está disponible en la previsualización técnica del leopardo de las nieves, que sigue teniendo únicamente Notable configurado.
- Se preservan todos los trazados, figuras, transformaciones geométricas, clips, opacidades, transparencias, `fill="none"`, contornos y `viewBox`. Se admiten pinturas hexadecimales, RGB/RGBA, HSL/HSLA y los nombres simples usados en las pruebas; las referencias `url(...)` se conservan.

Las pruebas comparan hashes de **487 sprites normales y 64 sprites sexuales** anclados en v3.19.5. Todos coinciden byte por byte. La geometría completa de las dos variantes se compara con su normal en las 487 especies, incluidas las previsualizaciones no coleccionables.

## Migración de partidas

`specialVariantName` unifica las etiquetas; `configuredSpecials` elimina opciones duplicadas conservando el orden. `normalizeSpecialDiscoveries` combina registros con OR: un descubrimiento verdadero nunca se pierde frente a una clave falsa duplicada. Conserva otras claves históricas y no modifica `specialSeen`, recompensas o inventario. Copia los registros anidados para no mutar el respaldo del llamador ni perjudicar la reversión de una restauración fallida.

La normalización se aplica al cargar el navegador, validar/importar JSON y restaurar directamente mediante `AtlasSaveBridge.restoreGame`. También homologa textos de encuentros y del diario. Los alias antiguos de especies continúan migrándose, con unión segura de sus descubrimientos especiales. No cambia la clave de almacenamiento ni `formatVersion: 1`; los respaldos exportados identifican `gameVersion: 3.19.6`.

Se verifican claves masculinas/femeninas antiguas, Albino, ambas claves juntas, Melánico, ausencia de descubrimientos y registros falsos. Importación nativa Android simulada, pegado JSON durante una sesión real de Chromium, tick de confirmación, persistencia y arranque offline con service worker conservan el progreso. El proceso es idempotente y no vuelve a otorgar descubrimientos.

## Dimorfismo y probabilidades

Permanecen las **32 especies** configuradas, `SEXUAL_DIMORPHISM`, `sexSeen`, dibujos macho/hembra, requisitos y contadores 0/2–2/2. No hay nuevos coleccionables combinando sexo y pigmentación. Las variantes mantienen su prioridad de dibujo sobre el argumento sexual, como en 3.19.5.

La probabilidad especial sigue siendo `0.01 + (ethology >= 2 ? 0.005 : 0)`; la selección sigue usando el índice aleatorio sobre las variantes configuradas, con la única eliminación autorizada de alias duplicados. No cambian probabilidades sexuales ni recompensas.

## Laboratorio y evaluación visual

[Laboratorio de pigmentación](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-pigmentacion.html): comparación Normal / Albino / Melánico por grupo, nombre científico, familia visual, disponibilidad y configuración; 56/80/120 px, fondos claro/oscuro, siluetas, búsqueda, filtros y previsualizaciones técnicas explícitamente no coleccionables. No inicializa el juego, accede al guardado ni registra observaciones. Los laboratorios históricos de aves y mamíferos conservan su columna anterior y delegan la columna actual al renderizador de producción.

Se inspeccionaron láminas reales a 56 px en ambos fondos: zorro rojo, erizo, reno, lince boreal, tigre, leopardo africano, búho real, cálao rinoceronte, tortuga mediterránea, cobra india y esturión siberiano. Se conservan cola, penachos, astas, rosetas, rayas, disco facial, pico/casco, placas, capucha y aletas. El pavo real común sólo tiene Notable: no se le habilita pigmentación por ser un control solicitado. Su anatomía puede compararse mediante la previsualización técnica.

La identidad y el volumen se revisan visualmente; validez XML y geometría se comprueban aparte. No se incluye un motor antiguo adicional para comparar exclusivamente paletas. Las referencias históricas ya existentes siguen disponibles.

## Validación reproducible y publicación

```sh
node --test tests/*.test.cjs
node scripts/build-dimorphism-lab.cjs --check
node scripts/pigmentation-inventory.cjs --check
node --check www/js/app.js
node --check www/js/lab/pigmentation-lab-v3196.js
```

**166 pruebas Node aprobadas**, incluidas 16 específicas de pigmentación, sin desactivar pruebas. Las expectativas históricas se actualizan únicamente por nomenclatura, versión de caché y rango continuo de la nueva paleta. Los inventarios de aves/mamíferos se regeneran con las etiquetas canónicas.

Con Playwright y Chromium disponibles, servir `www` en el puerto 8765 y ejecutar `node scripts/check-pigmentation-browser.cjs`. Se admiten `ATLAS_PLAYWRIGHT`, `ATLAS_CHROMIUM`, `ATLAS_TEST_URL` y `ATLAS_ARTIFACT_DIR`. Este chequeo valida **1.461 SVG/XML y 974 comparaciones geométricas**, controles, aislamiento del laboratorio, importación real, navegación por Campo/Bestiario/Cuaderno/Museo/Inventario/Investigación/Expediciones, laboratorios históricos y recarga offline; cero errores JavaScript. Las capturas se generan como evidencia de revisión, sin añadir recursos gráficos al juego. El chequeo de dimorfismo existente también conserva su comprobación offline.

Versión visible, referencias de scripts, paquete npm, nombre de aplicación Capacitor y caché `gran-atlas-v3.19.6-pigmentacion-1` actualizados. `appId`, mecanismos nativos de respaldo y `webDir` permanecen compatibles. El workflow Android existente construye la APK de prueba después del push; la publicación firmada continúa siendo manual. La compilación y el despliegue se verifican en las ejecuciones del commit publicado, sin inferir éxito a partir de las pruebas locales.

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/)
- [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-pigmentacion.html)
- [Deploy El Gran Atlas](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/static.yml)
- [Android APK de prueba](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-debug.yml)

No se conocen problemas pendientes de pigmentación o migración tras estas comprobaciones. La revisión no equivale a pruebas en todos los modelos físicos de teléfono.
