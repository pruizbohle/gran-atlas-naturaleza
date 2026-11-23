# El Gran Atlas · Catálogo mundial ilustrado

Juego naturalista y catálogo ilustrado de la fauna del mundo. Funciona en el navegador como PWA, también sin conexión, y tiene una versión Android preparada con Capacitor. La partida se guarda en el propio dispositivo.

**Versión actual: 5.5.0**

[Jugar](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio gráfico](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Galería de relictos](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-relictos.html) · [Actualizar la PWA conservando la partida](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

## Estado actual (V5.5.0)

| Contenido | Cantidad |
| --- | --- |
| Especies activas | 1.000 |
| Regiones | 125 |
| Paisajes (motivos de bioma) | 16 |
| Láminas zoológicas | 1.690 |
| Legendarios | 30 |
| Relictos (registro propio en el Museo) | 20 |
| Iconos de objetos ilustrados | 68 |

- **V5.2** añadió la Guía del naturalista, que se abre dentro de cada módulo, y retiró las ayudas ficticias de prueba. Detalles en el [informe de V5.2.0](docs/v520/README.md) y en la [auditoría de integración](docs/v520/auditoria.md).
- **V5.3** introdujo la iconografía naturalista: 63 iconos en WebP, pestañas, motivos de bioma y la [Biblioteca visual](https://pruizbohle.github.io/gran-atlas-naturaleza/iconoteca/biblioteca.html). Informe en [docs/v530](docs/v530/README.md).
- **V5.4** cierra la iconografía: 64 objetos jugables más con ilustración científica (OBJ-11), hexágonos del mapa con el color de su bioma, y la interfaz y el registro sin emojis. Informe en [docs/v540](docs/v540/README.md).

## Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| `www/` | El juego: páginas, código, imágenes, laboratorios y páginas de actualización de la PWA |
| `docs/` | Informes por versión, auditorías, inventarios y evidencia |
| `scripts/` | Generación de la versión, inventarios de arte, pruebas en navegador y firma de APK |
| `tests/` | Pruebas en Node (`*.test.cjs`) |
| `android-native/` | Complementos nativos de Android: firma y exportación e importación de partidas |
| `.github/workflows/` | Despliegue en GitHub Pages y compilación, firma y publicación de Android |
| `capacitor.config.json`, `package.json` | Configuración de Capacitor y de las dependencias |
| `README_V*.md` | Informes de las versiones 3.x, conservados en la raíz para no romper enlaces |

## Desarrollo

La comprobación de publicación se ejecuta con:

```
npm ci
npm run release:verify
```

`release:verify` genera la versión (`scripts/build-naturalist-release.cjs`) y ejecuta las pruebas críticas. La compilación de Pages usa Node 22. La suite completa (`node --test --test-concurrency=4 tests/*.test.cjs`, con el historial de git completo) da 666 de 885 pruebas aprobadas en V5.4.2. Los 219 fallos restantes ya se reproducían en V5.3.0 y V5.2.0: son comparaciones con commits históricos que hay que revisar una a una. Ver [docs/v530/regresion.json](docs/v530/regresion.json).

Cada envío a `main` despliega el sitio mediante `.github/workflows/static.yml`.

## Compatibilidad de partidas

- La clave de guardado `gran_atlas_v05` y el respaldo JSON (formato `el-gran-atlas-save`, versión 1) no se cambian sin una migración.
- El prestigio es acumulado y no se consume al viajar ni al habilitar una región.
- Antes de actualizar una instalación, usa la [página de actualización](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html), que conserva la partida.

## Android

La configuración de Capacitor, los flujos de firma y el certificado permanente (su huella SHA-256 está fijada en [`docs/android/signing-certificate.json`](docs/android/signing-certificate.json)) están preparados. Todavía no hay APK generado para V5.2, V5.3 ni V5.4. Para publicar uno falta el candidato compilado, el registro de la restauración física en un dispositivo (`docs/android/restoration-validation.json`, que aún no existe) y la autorización expresa del propietario. Procedimiento y límites en [`docs/android/release-notes.md`](docs/android/release-notes.md) y en [`README_ANDROID_FIRMA_PERMANENTE.md`](README_ANDROID_FIRMA_PERMANENTE.md).

## Documentación por versión

La hoja de ruta vigente está en [`ROADMAP.md`](ROADMAP.md). El historial completo de versiones está en [`docs/CHANGELOG.md`](docs/CHANGELOG.md), y la hoja de ruta anterior, que llega hasta la Beta 3.12, en [`docs/ROADMAP-historico.md`](docs/ROADMAP-historico.md).

### Serie 5 · Auditoría, arte, relictos y legendarios

| Versión | Tema | Informe |
| --- | --- | --- |
| 5.4.0 | Iconografía: objetos OBJ-11, hexágonos por bioma e interfaz sin emojis | [docs/v540](docs/v540/README.md) |
| 5.3.0 | Iconografía naturalista: 63 iconos, biblioteca visual y motivos de bioma | [docs/v530](docs/v530/README.md) |
| 5.2.0 | 30 legendarios, 20 relictos, Guía del naturalista e integración de ramas | [docs/v520](docs/v520/README.md) |
| 5.1.2 | Relictos 5.0: de 9 a 20 relictos | [docs/relictos-v50](docs/relictos-v50/README.md) |
| 5.0.12 | ART-08: revisión de variantes pigmentarias | [docs/arte-v5012](docs/arte-v5012/README.md) |
| 5.0.11 | ART-07: rapaces y nutria | [docs/arte-v5011](docs/arte-v5011/README.md) |
| 5.0.10 | ART-06 | [docs/arte-v5010](docs/arte-v5010/README.md) |
| 5.0.9 | ART-05: visor de albinos y melánicos | [docs/arte-v509](docs/arte-v509/README.md) |
| 5.0.8 | ART-04 | [docs/arte-v508](docs/arte-v508/README.md) |
| 5.0.7 | ART-03 | [docs/arte-v507](docs/arte-v507/README.md) |
| 5.0.6 | ART-02 | [docs/arte-v506](docs/arte-v506/README.md) |
| 5.0.5 | ART-01: 11 correcciones en siete mamíferos | [docs/arte-v505](docs/arte-v505/README.md) |
| 5.0.4 | AUD-06: arranque y rendimiento | [docs/auditoria-v504](docs/auditoria-v504/README.md) |
| 5.0.3 | AUD-05 | [docs/auditoria-v503](docs/auditoria-v503/README.md) |
| 5.0.2 | Motor y caché | [docs/auditoria-v502](docs/auditoria-v502/README.md) |
| 5.0.1 | Integración de la auditoría global | [docs/auditoria-v501](docs/auditoria-v501/README.md) |

### Serie 4 · Catálogo mundial ilustrado

| Versión | Tema | Informe |
| --- | --- | --- |
| 4.9.6 | Peces marinos y cefalópodos (36 láminas) | [docs/cientifica-v496](docs/cientifica-v496/README.md) |
| 4.9.5 | Fauna de las profundidades | [docs/cientifica-v495](docs/cientifica-v495/README.md) |
| 4.9.3 | Peces de arrecife y cierre del catálogo mundial | [docs/cientifica-v493](docs/cientifica-v493/README.md) |
| 4.9.2 | Peces dulceacuícolas y estuarinos | [docs/cientifica-v492](docs/cientifica-v492/README.md) |
| 4.9.1 | Salmónidos y remonte | [docs/cientifica-v491](docs/cientifica-v491/README.md) |
| 4.9.0 | Tiburones, rayas y actualización de la PWA | [docs/cientifica-v490](docs/cientifica-v490/README.md) |
| 4.8.2 | Anfibios | [docs/cientifica-v482](docs/cientifica-v482/README.md) |
| 4.8.1 | Tortugas, crocodilianos y tuátara | [docs/cientifica-v481](docs/cientifica-v481/README.md) |
| 4.8.0 | Serpientes y lagartos | [docs/cientifica-v480](docs/cientifica-v480/README.md) |
| 4.7.4 | Paseriformes y cierre de aves | [docs/cientifica-v474](docs/cientifica-v474/README.md) |
| 4.7.3 | Aves arborícolas, chucao y sapo pulga | [docs/cientifica-v473](docs/cientifica-v473/README.md) |
| 4.7.2 | Aves terrestres, corredoras y galliformes | [docs/cientifica-v472](docs/cientifica-v472/README.md) |
| 4.7.1 | Aves acuáticas y marinas | [docs/cientifica-v471](docs/cientifica-v471/README.md) |
| 4.7.0 | Rapaces diurnas y nocturnas | [docs/cientifica-v470](docs/cientifica-v470/README.md) |
| 4.6.0 | Mamíferos acuáticos | [docs/cientifica-v460](docs/cientifica-v460/README.md) |
| 4.5.0 | Mamíferos terrestres restantes | [docs/cientifica-v450](docs/cientifica-v450/README.md) |
| 4.4.0 | Ilustración científica clásica y ungulados | [docs/cientifica-v440](docs/cientifica-v440/README.md) |
| 4.3.0 | Primates | [docs/naturalista-v430](docs/naturalista-v430/README.md) |
| 4.2.1 | Consolidación naturalista | [docs/naturalista-v421](docs/naturalista-v421/README.md) |

### Series 3 y anteriores

Los informes de las versiones 3.x están en la raíz como `README_V3xx.md`. Por ejemplo, la 3.44.0 (cartografía del naturalista) está documentada en [`docs/gm06/cierre-validacion.md`](docs/gm06/cierre-validacion.md) y la 3.43.0 en [`README_V3430.md`](README_V3430.md). El resumen de cada una está en el [historial de versiones](docs/CHANGELOG.md).
