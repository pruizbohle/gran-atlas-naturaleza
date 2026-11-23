# El Gran Atlas — hoja de ruta (23 de noviembre de 2026)

Estado de partida: **V5.4.0**. Esta hoja distingue lo que ya está hecho, lo que los informes del repositorio dejan pendiente y lo que es solo una propuesta. El plan anterior, que llegaba hasta la Beta 3.12, está en [`docs/ROADMAP-historico.md`](docs/ROADMAP-historico.md).

## Completado

| Etapa | Versiones | Resultado |
| --- | --- | --- |
| Android Alpha y móvil | 2.5 – 3.0 | Navegación vertical, uso sin conexión y persistencia local |
| Europa, Asia y África | 2.1 – 3.12 | Europa y Asia completas; África en etapas |
| Américas | 3.22 – 3.23 | Norteamérica completa y Sudamérica pulida |
| Oceanía, Polos y mares | 3.29 – 3.32 | Oceanía, regiones polares y doce mares superficiales |
| Océanos profundos | 3.33 – 3.34 | Regiones profundas y fosas abisales |
| Consolidación mundial | 3.35 – 3.44 | 997 especies y 125 regiones, con cartografía del naturalista |
| Módulos del juego | 3.24 – 3.43 | Bestiario, Museo, Expediciones, Sociedad, Inventario, Campamento y perfil |
| Catálogo mundial ilustrado | 4.2 – 4.9.6 | 1.000 fichas activas con láminas científicas de todos los grupos |
| Auditoría y arte | 5.0.1 – 5.0.12 | Auditoría global, rendimiento de arranque y repintado de variantes pigmentarias |
| Legendarios, relictos y guía | 5.1.2 – 5.2.0 | 30 legendarios, 20 relictos y Guía del naturalista |
| Iconografía | 5.3.0 – 5.4.0 | 63 iconos y 16 motivos de bioma, 61 objetos ilustrados más, hexágonos por bioma e interfaz sin emojis |

## Pendiente según los informes del repositorio

| Tema | Estado | Fuente |
| --- | --- | --- |
| Android estable | APK sin generar. El certificado permanente ya tiene su huella fijada; faltan el candidato compilado, el registro de restauración en un dispositivo físico y la autorización expresa | [Notas de Android](docs/android/release-notes.md), [firma permanente](docs/android/signing-certificate.json), [informe 3.42.0](README_V3420.md) |
| Pruebas históricas | 219 de 885 pruebas fallan desde antes de V5.2.0. Hay que revisar cuáles son obsoletas y cuáles esconden errores | [Regresión V5.3.0](docs/v530/regresion.json) |
| Arte pigmentario | Siguiente lote propuesto: 20 animales con variante albina o melánica mejorable | [Próximo lote ART-08](docs/arte-v5012/proximo-lote.md) |
| Coleccionables | El desarrollo de coleccionables (300 piezas y Filatelia) quedó fuera de V5.2 y de la iconografía 5.3–5.4 | [Auditoría de integración](docs/v520/auditoria.md) |
| Iconos restantes | Objetos `fossil_tooth`, `field_telescope` y `parchment_scrap` (a homologar o ajustar), motivos `misiones` y `comparativo`, y arte de legendarios y relictos | [docs/v540](docs/v540/README.md) |

## Propuestas

Son ideas mías para ordenar el proyecto. No están decididas en ningún informe:

- Mover los más de 60 `README_V*.md` de la raíz a `docs/` y actualizar los enlaces.
- Crear un `CLAUDE.md` con las reglas del proyecto: no tocar `gran_atlas_v05`, ejecutar `npm run release:verify` antes de publicar y no generar APK sin autorización.
- Dejar una sola fuente de la versión vigente, ya que hoy aparece en `package.json` y en `www/atlas-release.json`.

## Reglas de compatibilidad

- No modificar `gran_atlas_v05` ni el formato de respaldo `el-gran-atlas-save` versión 1 sin una migración.
- El prestigio es acumulado y no se consume al viajar.
- Cada cambio visual conserva rutas, etiquetas de juego e identificadores de guardado.
