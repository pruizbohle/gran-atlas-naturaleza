# El Gran Atlas — Beta 3.13.1 · Conciliación exhaustiva de África

## Resultado
**154/154 taxones únicos de referencia del Excel africano** tienen una ficha de juego asociada y una asignación al hexágono africano correspondiente. El conteo se deriva de la planilla `Atlas_Fauna_Hexagonal_209_900_Especies(2).xlsx` (14 hexágonos terrestres africanos) y se mantiene documentado como `AFRICA_V3131_EXCEL_REFERENCE`.

- **39 fichas de fauna nuevas** añadidas sobre Beta 3.13. Las 38 incorporadas en 3.13 se mantienen.
- Especies ya existentes en el catálogo general se reutilizan por nombre científico (no se duplican para cada continente).
- Dos registros del Excel son de especie amplia y se vinculan a fichas anteriores más específicas: `Pan troglodytes` → `af_chimpance` y `Gorilla beringei` → `af_gorila_montana`. Conviene revisar futuras fichas de subespecies antes de ampliar taxonomía.
- Las **24 regiones africanas** se conservan. Los 14 hexágonos del Excel se conectan mediante correspondencias explícitas a regiones equivalentes de la cuadrícula del juego.
- Se garantiza que los animales incorporados tengan biomas coincidentes con al menos uno de los biomas de la zona en que pueden aparecer.

## Compatibilidad y pruebas
No se cambia la clave local `gran_atlas_v05`, los IDs históricos ni el formato de backup `el-gran-atlas-save` v1. Museo, expediciones, investigaciones y recursos de versiones anteriores se mantienen. Las pruebas `tests/africa-v3131.test.cjs` verifican 154 taxones, 14 hexágonos, 39 fichas nuevas, ausencia de especies sin ficha y biomas de nuevas incorporaciones.

## Alcance pendiente
La conciliación cubre los **14 hexágonos africanos del Excel de referencia**, no una revisión externa de toda la fauna africana ni una validación taxonómica editorial de cada nombre. Las otras diez regiones africanas del juego conservan su fauna y se pueden enriquecer con especies compartidas, sin alterar los IDs ya usados.
