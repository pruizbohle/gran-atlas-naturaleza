# MEC-09D §7 · Consolidación de funciones redefinidas

## Inventario actual

El inventario está en `funciones-redefinidas.csv`. Se genera con `scripts/audit-mec09a-architecture.py` y se le añade una clasificación heurística de cada redefinición.

- **Envoltura:** captura la versión anterior y la llama.
- **Reemplazo:** no la llama.

| | MEC-09A | MEC-09D (tras C1) |
|---|---|---|
| Funciones redefinidas | 96 | 98 (+2 de MEC-09B/09C) |
| Redefiniciones | 187 | 185 |
| Cadenas de envolturas vivas | – | 62 |
| Reemplazos más envolturas | – | 13 |
| Solo reemplazos | – | 23 |

**Los reemplazos no son código muerto.** Casi todos son la implementación real de una declaración anticipada, por ejemplo `function mec02Action(){}`, o una rama alternativa cuando falta un módulo, como el `else` de MEC-07 en `normalizeMEC01`.

## Cambio aplicado (C1): `taxonomyInfo`

- **Antes:** nueve envolturas, una por entrega (`na3220`, `sa3230`, `oc3290`, `polar3310`, `marine3320`, `deep3330`, `abyssal3340`, `gm06` y los registros A04). Cada una comparaba la procedencia de la especie y delegaba en la anterior. Es una función de uso intensivo: la llaman el Bestiario, los filtros, los logros y el Museo.
- **Ahora:** una sola capa resuelve por procedencia con el conjunto `OWN_TAXONOMY_ORIGINS`. Cada entrega registra su procedencia en el mismo punto de carga donde antes añadía su envoltura. La capa de registros A04 se conserva, porque consulta otra fuente.
- **Por qué es equivalente:**
  - Las procedencias son excluyentes: cada especie tiene una sola.
  - Las procedencias se registran en el mismo orden de carga que las envolturas, así que una llamada en cualquier punto intermedio de la carga da el mismo resultado.
  - Ningún código guardaba una referencia intermedia a `taxonomyInfo`; las únicas capturas eran las de las propias envolturas.
- **Prueba:** `tests/mec09d-consolidation.test.cjs`.
  - Compara las 1000 especies, más identificadores desconocidos, con el motor de partida `1500e42`.
  - Un ensayo de mutación lo confirma: si se elimina el registro de `gm06`, la prueba falla.

## Cadenas prioritarias que no se reescriben

Afectan a `regionRequirementsMet`, `atlasRegionModel`, `continentStatus`, `normalizeMEC01` y `mec02Action`.

Son cadenas de envolturas vivas. Cada capa añade una regla de su entrega, por ejemplo:
- preparaciones 3.30;
- reglas de Polos, Océanos, Profundo y Abisal;
- la compuerta cartográfica de INV 3.40;
- la normalización de cada etapa MEC.

El orden entre capas es semántico. Fundirlas en una sola función sería reescribir reglas de acceso y de guardado, cosa que MEC-09D excluye («sin reescritura de `app.js`»).

En lugar de eso, su comportamiento queda fijado por pruebas de equivalencia con `1500e42`:
- `regionRequirementsMet`, `atlasRegionModel` y `continentStatus`: las 125 regiones en cinco perfiles de progreso, desde partida nueva hasta todo fabricado;
- `normalizeMEC01`: la cadena completa (MEC-01 a MEC-09A) sobre las tres partidas de referencia de MEC-09C; también se comprueba que normalizar dos veces da el mismo resultado.

Cualquier fusión futura de estas cadenas tendrá que mantener verdes esas pruebas.

## Coherencia de publicación

Se cambia `www/js/app.js`. Se regeneraron `www/atlas-integrity.json` y la revisión de caché de `www/sw.js` con `scripts/build-naturalist-release.cjs --write`. La versión sigue siendo 5.6.9.

La Preview 01 no se toca: sigue fijada en su commit `700f983`.
