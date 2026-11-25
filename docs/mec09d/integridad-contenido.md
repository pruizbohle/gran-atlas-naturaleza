# MEC-09D §4 · Integridad de contenido

**Alcance.** Se audita el catálogo completo tal como lo carga `www/index.html`, con el motor real. Las pruebas están en `tests/mec09d-integrity.test.cjs`; las de legendarios y relictos, en sus propios archivos.

## Recuento

| Elemento | Total | Detalle |
|---|---|---|
| Especies | **1000** | 490 base, 102 Norteamérica, 121 Sudamérica, 97 Oceanía, 21 polares, 95 marinas, 20 profundas, 2 abisales, 52 GM-06 |
| Rareza | – | 384 comunes, 274 poco comunes, 268 raras, 74 muy raras |
| Regiones | **125** | Europa 10, Asia 23, África 25, Norteamérica 18, Sudamérica 14, Oceanía 9, Polos 7, Océanos 19 |
| Presencias especie-región | 1833 | – |
| Legendarios | **30** | 12 históricos y 18 solo legendarios (LEG-02) |
| Relictos | **20** | – |

## Comprobaciones

Todas pasan.

| Comprobación | Resultado |
|---|---|
| Identificadores de especie y región duplicados | 0 |
| Nombres científicos duplicados entre especies | 0 |
| Nombres comunes duplicados entre especies | 0 |
| Presencias regionales a especies inexistentes o repetidas | 0 |
| Especies sin región | 0 |
| Especies sin hábitat, turno o estación | 0 |
| Especies inaccesibles (sin región con hábitat compatible ni elegibilidad automática) | 0 |
| Láminas ausentes (normal, cada pigmento configurado, ambos sexos con dimorfismo; tamaños 512, 256, 128 y 64) | 0 |
| Legendarios con especie inválida o sin lámina | 0 |
| Láminas legendarias huérfanas | 0 |
| Relictos con región inválida | 0 |
| Relictos sin lámina en los cuatro tamaños | 0 |
| Legendarios encontrables por un encuentro real en Campo (ver §14) | 30 de 30 |

## Observaciones

No son errores funcionales y no se cambia contenido.

- **O1 (P3, decisión del propietario).** El relicto `gabon_dwarf_croc` («Cocodrilo enano africano», *Osteolaemus tetraspis*, HX-08-10) es la misma especie que la ficha ordinaria del Bestiario `af_xlsx_cocodrilo_enano`. Comparten nombre y nombre científico, y la ficha también vive en HX-08-10. El jugador puede tenerlo a la vez como animal común y como relicto «raro».
  - Opciones para el propietario: distinguir el relicto como población o linaje, o sustituirlo.
  - Cualquiera de las dos es un cambio de contenido, excluido de MEC-09D.
  - La prueba I4 fija la observación: si se resuelve, la prueba lo detecta y pide actualizar este informe.
- **O2 (P3, heredada de §5).** El Arco del mar Rojo (`gm06_rojo`) tiene 7 especies, por debajo del mínimo histórico de 8. No se añaden especies.
