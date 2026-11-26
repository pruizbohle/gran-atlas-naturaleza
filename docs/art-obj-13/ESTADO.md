# ART-OBJ-13 · Continuidad

Rama `art-obj-13` desde `3ddb30bdb897a7cbdf211a68da8ae636dc7d4b89` de ART-OBJ-12. La punta mecánica verificada es `d7cc4cb30b44656f922c2413a020ea93ee03c989` de `mec-09d/consolidation`, ancestro de la rama artística.

La auditoría inicial cotejó los 129 IDs del inventario de ART-OBJ-12 con el catálogo activo y el manifiesto OBJ-11, el material de OBJ-05 conservado allí y el catálogo vectorial ART-COL-01. La lámina archivada bajo NUM-09 representa el birr etíope. Las frondas HOJ-07 y HOJ-10 son de otras especies. Se mantienen las 302 ilustraciones integradas, incluida RAR-07.

[Laboratorio](https://el-gran-atlas-art-obj-12.muddyroadrunner17.chatgpt.site/art-obj-12/?lote=coleccionables)

| Lote | Piezas | Estado |
| --- | ---: | --- |
| 1 · Botánica | 31 | Integrado, validado y publicado |
| 2 · Geología | 20 | Integrado y validado |
| 3 · Oceanografía | 16 | Integrado y validado |
| 4 · Historia | 23 | Integrado y validado |
| 5 · Daguerrotipos | 20 | Integrado y validado |
| 6 · Historia natural y rarezas | 19 | Integrado y validado |

## Lote 1 · Botánica

- Nuevas e integradas BOT-13, BOT-15 a BOT-20, MAD-01 a MAD-12 y HEL-01 a HEL-12.
- Recuperadas y corregidas 0. La cobertura del catálogo llega a 333 de 431.
- Pasaron 26 pruebas y la revisión de Chromium móvil. [Informe](CALIDAD.md)
- Commit `b18d46ad16a3f1a0b2f783dd0ef2115cd0c06eb8`.
- [Vista filtrada de Botánica](https://el-gran-atlas-art-obj-12.muddyroadrunner17.chatgpt.site/art-obj-12/?lote=coleccionables&family=Bot%C3%A1nica)

## Lote 2 · Geología

- Nuevas e integradas GEM-13 a GEM-20 y MTR-01 a MTR-12.
- Recuperadas y corregidas 0. Cobertura de 353 de 431.
- Pasaron 26 pruebas. Se revisaron todas las láminas a 64 y 128 px.
- Commit `6ec92f96746b4da9ac8f659e654c2d8a3b072a57`.

## Lote 3 · Oceanografía

- Nuevas e integradas CON-13 a CON-20 y COR-13 a COR-20.
- Recuperadas y corregidas 0. Cobertura de 369 de 431.
- Pasaron 26 pruebas. Se revisaron ambas planchas y los recortes de los corales.
- Commit `1eaa43abd30c83b858b1c000d459c3d66eb4e801`.

## Lote 4 · Historia

- Nuevas e integradas NUM-09, NUM-14 a NUM-20, CIV-13 a CIV-20 y MUN-01 a MUN-07.
- Recuperadas 0. Corregidas durante la revisión NUM-15 y MUN-06. Cobertura de 392 de 431.
- Pasaron 26 pruebas. Revisadas las 23 piezas en ambas planchas.
- Commit `6b54d476ed58d58516c132f550c32f93f4b6ad2c`.

## Lote 5 · Daguerrotipos

- Nuevas e integradas DAG-01 a DAG-20.
- Recuperadas y corregidas 0. Cobertura de 412 de 431.
- Pasaron 26 pruebas y la revisión de las dos planchas.
- Commit `2cde95e0b699fdfb7ec0dcb4b0d16664607ddc82`.

## Lote 6 · Historia natural y rarezas

- Nuevas e integradas HUE-13 a HUE-20, RAR-01 a RAR-06 y RAR-08 a RAR-12.
- Recuperadas 0. Corregida durante la revisión RAR-05. Cobertura final de 431 de 431.
- Se conserva RAR-07 con la ilustración de diente fósil aprobada en ART-OBJ-12, compartida con FOS-05.
- Pasaron 26 pruebas del lote. Se revisaron ambas planchas y se verificó la revisión offline en Chromium. [Informe de calidad](CALIDAD.md)
- Commit `beef378a30c4f2f35cd156525e4e5361fdbc6e2b`.

## Entrega

Último lote terminado. Historia natural y rarezas. Se integraron las 129 láminas nuevas y sus 516 WebP. Las 302 láminas ya integradas siguen usando sus archivos de ART-OBJ-12. El inventario de pendientes está vacío. [Matriz de 431 piezas](coleccionables.csv) · [Pendientes](pendientes.csv)

Despliegue privado completado. Revisión web `gran-atlas-v5.6.9-naturalist-cec44a6343ba`, versión 5 de Sites, despliegue `appgdep_6b08bd8b580081919629ff98b9fddb42`. [Laboratorio consolidado](https://el-gran-atlas-art-obj-12.muddyroadrunner17.chatgpt.site/art-obj-12/?lote=coleccionables) · [Beta experimental](https://el-gran-atlas-art-obj-12.muddyroadrunner17.chatgpt.site/) · [Rama de trabajo](https://github.com/pruizbohle/gran-atlas-naturaleza/tree/art-obj-13)

La última revisión de continuidad se identifica con `git log -1 --format=%H -- docs/art-obj-13/ESTADO.md`. La punta remota de MEC-09D volvió a comprobarse al cierre.

Próximo paso. Revisar la biblioteca publicada y registrar los ajustes concretos que se soliciten por ID.

## Recuperar el trabajo

Git conserva los WebP definitivos, las maestras PNG y la asignación de cada celda en `planchas.json`. Para reproducir un lote, extraer primero la referencia OBJ-11 como indica [ART-OBJ-12](../art-obj-12/ESTADO.md).

```bash
python scripts/prepare-art-obj-13.py /tmp/atlas-obj11 5
node scripts/build-art-obj-12.cjs /tmp/atlas-obj11
node scripts/build-naturalist-release.cjs --write
python scripts/check-art-obj-12.py todos --reference /tmp/atlas-obj11
```

Para revisar la copia local en el navegador, ejecutar `python -m http.server 8000 --directory www` y abrir [el laboratorio local](http://localhost:8000/art-obj-12/?lote=coleccionables).
