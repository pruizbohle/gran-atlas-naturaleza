# ART-OBJ-12 · Continuidad

- Rama de trabajo `art-obj-12`, sobre V5.6.9 Beta en `d7cc4cb30b44656f922c2413a020ea93ee03c989`.
- Referencia artística OBJ-11 en `952d9c0e9660eb1c6921bb162ef38be3d901925b`. Iconografía inicial en `a1d22c7b0fc52c71faaa955545f694a54c98a868` y lote de revisión en `3ce29ecd921b05e2d2acc48dfc09b2940a1f766b`.
- Último lote terminado: D · Estudios y demostraciones. Los cuatro lotes reúnen las 73 referencias de MEC-06 integradas.
- Último commit de integración y biblioteca: `cdd3544df6bbc3588d1cd00911a11bf7ea937c32`.
- Último commit con cambios de láminas: `9a0a2cbcc4d2c89f5a3d43947ca044428239a356`.
- Revisión PWA: `gran-atlas-v5.6.9-naturalist-83c2e84a7c7a`.
- Próximo trabajo inmediato: producir los 129 coleccionables del inventario de V5.6 pendientes de lámina.

## Acceso y recuperación

- [Biblioteca ART-OBJ-12](https://el-gran-atlas-art-obj-12.muddyroadrunner17.chatgpt.site/art-obj-12/)
- [Beta web experimental](https://el-gran-atlas-art-obj-12.muddyroadrunner17.chatgpt.site/)
- [Rama art-obj-12](https://github.com/pruizbohle/gran-atlas-naturaleza/tree/art-obj-12)

| Entrega | Commit |
| --- | --- |
| Matriz inicial y Lote A | `13867aa3132c6ce838f5bf4df69e3ee45e38591a` |
| Lote B | `8bb554fb5c1843d9c4ff81820a7bd0a8cb5b97c4` |
| Lote C | `aac87eaf79ecf2f52dd7127f8ab4968298deda8d` |
| Lote D | `eafe13623583f0940c8c127774aab65de85e095a` |
| Catálogo OBJ-11 e instalación offline | `9a0a2cbcc4d2c89f5a3d43947ca044428239a356` |
| Biblioteca portable | `cdd3544df6bbc3588d1cd00911a11bf7ea937c32` |

## Lote A

| Trabajo | Identificadores |
| --- | --- |
| Generadas | MAT-N03, MAT-N04, MAT-N05, MAT-N08, MAT-N10, MAT-N11, MAT-N12, MAT-N15, MAT-N20, MAT-N22, MAT-N24 |
| Recuperadas de OBJ-11 | MAT-N01, MAT-N02, MAT-N09, MAT-N14, MAT-N16, MAT-N18, MAT-N19, MAT-N21 |
| Históricas mantenidas | owl_feather, heron_feather, otter_whisker, beaver_tail_scale, antler_fragment, wolf_tooth, boar_tusk, animal_trace |
| Integradas | Los 27 IDs anteriores. Cuatro tamaños por material, incluidos los ocho archivos de 128 px ya presentes. |
| Pendientes de arte | Ninguno del Lote A. |

La [plancha de 64 px](lote-a-64.webp) usa los WebP de juego sobre dos fondos. Se comprobaron 108 WebP con alfa real, resolución y márgenes. Las variantes recuperadas coinciden byte por byte con OBJ-11. El plumón conserva un alfa máximo de 253 a 256 px.

Pasaron 32 pruebas de MEC-06, persistencia MEC-09D, caché verificada, restauración e iconografía. El [laboratorio privado del Lote A](https://el-gran-atlas-art-obj-12.muddyroadrunner17.chatgpt.site/art-obj-12/?lote=A) quedó publicado. La sesión de navegador requiere autenticación. Las pruebas de presentación comprobaron las rutas reales del inventario y las fichas.


## Lote B

- Generadas 13 láminas. Microscopio, globo celeste, esfera armilar, planetario, autómatas cantor y escribiente, estereoscopio, linterna mágica, cámara oscura, máquina electrostática, pila de Volta, galvanómetro y demostrador de inducción.
- Recuperadas 7 láminas de OBJ-11. Los cinco artefactos históricos, el refractor de observatorio y la cámara de cajas deslizantes de `INS-09`.
- Integradas las 20, con miniatura del Taller, vistas del Museo, ficha ampliada y consulta de los artefactos instalados en el Campamento.
- La [plancha comparativa](lote-b-128.webp) muestra las veinte ilustraciones en dos fondos. Se verificaron 80 WebP y las rutas de Museo, Taller y Campamento.
- Pendientes de arte del lote B: ninguno.


## Lote C

- Generadas e integradas seis láminas. Engranaje de latón, espejo pulido, carta estelar, placa de daguerrotipo, módulo luminoso y componente eléctrico.
- Los 24 WebP pasaron la comprobación de resolución, transparencia, márgenes, hashes y correspondencia con el manifiesto offline.
- Pendientes del lote C: ninguno.


## Lote D

- Integradas 20 vistas. Las 14 de estudios, cuatro de demostraciones y dos de instalaciones.
- Generadas 11 ilustraciones de actividad. Se exportaron nueve composiciones con láminas ya revisadas de OBJ-11 y ART-OBJ-12. Los IDs y las capas constan en [planchas.json](planchas.json) y [composiciones.json](composiciones.json).
- La cámara de fuelle de una propuesta del Campamento se descartó. La composición integrada usa la cámara de cajas deslizantes de OBJ-11.
- Pasaron la [revisión visual de 20 fichas](lote-d-128.webp), la comprobación de 80 WebP y las pruebas de rutas para estudios, demostraciones e instalaciones.
- Pendientes del lote D: ninguno.

## Auditoría y recuperación

La [matriz MEC-06](referencias-mec06.csv) registra las 73 referencias comprobadas. El laboratorio de OBJ-05 está protegido por autenticación. Se cotejaron el registro, los candidatos y los archivos de OBJ-05 conservados en OBJ-11. El [informe de calidad](CALIDAD.md) identifica las fuentes comprobadas y las pruebas. La rama `main` remontaba a `9006b53b2cf5dcda9b0f6e3acbaa330f0e0b28b3`, cuya cabecera informa V5.6.0 Beta.

La [matriz de la beta](coleccionables.csv) confirma 431 IDs, con 300 coincidencias de ID y nombre con OBJ-11. Hay 302 coleccionables integrados. De los 131 incorporados se recuperaron BOT-14 y RAR-07. El [inventario de pendientes](coleccionables-v56-pendientes.csv) contiene los otros 129 IDs. `NUM-09` identifica el estátero lidio en la beta y un birr etíope archivado en OBJ-11.

## Reproducir

```bash
git fetch origin experiment/scientific-illustration-objects
mkdir -p /tmp/atlas-obj11
git archive 952d9c0 docs/objetos-cientificos/catalogo-300.json docs/objetos-cientificos/preparar-arte.py docs/objetos-cientificos/materiales-futuros.tsv www/objetos-cientificos | tar -x -C /tmp/atlas-obj11
node scripts/build-art-obj-12.cjs /tmp/atlas-obj11
node scripts/build-naturalist-release.cjs
```

La orden de recuperación es `node scripts/build-art-obj-12.cjs /tmp/atlas-obj11 --recover=A`. Las maestras PNG, los cortes y las capas se guardan en este directorio. La exportación de un lote usa `python scripts/prepare-art-obj-12.py /tmp/atlas-obj11 A`, con el lote correspondiente. Para volver a extraer comparaciones de ART-COL-01, se usa `git archive 451e844 www/assets/collectibles-draft www/data/atlas_coleccionables_240_manifest_v2.json` y se pasa la carpeta de extracción en `--draft=<directorio>`. Los archivos ya integrados se conservan en Git.

El punto de entrada en el repositorio es `www/art-obj-12/index.html?lote=A`. El juego y el laboratorio leen el mismo manifiesto de WebP.
