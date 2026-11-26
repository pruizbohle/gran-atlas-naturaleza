# ART-OBJ-12 · Continuidad

- Rama de trabajo `art-obj-12`, sobre V5.6.9 Beta en `d7cc4cb30b44656f922c2413a020ea93ee03c989`.
- Referencia artística OBJ-11 en `952d9c0e9660eb1c6921bb162ef38be3d901925b`. Iconografía inicial en `a1d22c7b0fc52c71faaa955545f694a54c98a868` y lote de revisión en `3ce29ecd921b05e2d2acc48dfc09b2940a1f766b`.
- Último lote terminado: B · Artefactos científicos. A y B reúnen 47 referencias integradas.
- Último commit de arte: `git log -1 --format=%H -- www/objetos-cientificos/arte`.
- Próximo trabajo inmediato: ilustrar y conectar los seis componentes del Lote C.

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

## Auditoría y recuperación

La [matriz MEC-06](referencias-mec06.csv) registra las 73 referencias comprobadas. El laboratorio de OBJ-05 está protegido por autenticación. Se cotejaron el registro, los candidatos y los archivos de OBJ-05 conservados en OBJ-11. La rama `main` remontaba a `9006b53b2cf5dcda9b0f6e3acbaa330f0e0b28b3`, cuya cabecera informa V5.6.0 Beta.

La [matriz de la beta](coleccionables.csv) confirma 431 IDs, con 300 coincidencias de ID y nombre con OBJ-11. Los [131 registros incorporados](coleccionables-v56-pendientes.csv) se revisaron aparte. `NUM-09` identifica el estátero lidio en la beta y un birr etíope archivado en OBJ-11.

## Reproducir

```bash
mkdir -p /tmp/atlas-obj11
git archive 952d9c0 docs/objetos-cientificos/catalogo-300.json docs/objetos-cientificos/preparar-arte.py docs/objetos-cientificos/materiales-futuros.tsv www/objetos-cientificos | tar -x -C /tmp/atlas-obj11
node scripts/build-art-obj-12.cjs /tmp/atlas-obj11
node scripts/build-naturalist-release.cjs
```

La orden de recuperación es `node scripts/build-art-obj-12.cjs /tmp/atlas-obj11 --recover=A`. Las maestras PNG y el plan de cortes se guardan en este directorio. La exportación opcional de las once láminas usa `python scripts/prepare-art-obj-12.py /tmp/atlas-obj11 A`.

El punto de entrada del laboratorio es `www/art-obj-12/index.html?lote=A`. El juego y el laboratorio leen el mismo manifiesto de WebP.
