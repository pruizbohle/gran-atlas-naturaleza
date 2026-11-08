# Decisiones taxonómicas y procedencia

Se reutiliza AM-01 y se contrasta la identidad de mamíferos con ASM Mammal Diversity Database, taxonomía actual publicada el 28-07-2026, commit `749c2de16a949099cfc13ccbd2b86d427641e844`, consultado el 08-11-2026. El [extracto consultado](taxonomy-mdd-extract.json) conserva notas, referencias y países de la autoridad; se incluye su [licencia MIT](MDD-LICENSE.txt). Esto no certifica cada presencia ilustrativa del Excel.

| Nombre de fuente | Nombre utilizado | Estado | Filas Fauna | Decisión |
| --- | --- | --- | --- | --- |
| Pudu mephistophiles | Pudella mephistophiles | accepted-name | 914 | Pudella mephistophiles según MDD; separado de P. carlae y Pudu puda. No se amplía a todos los Andes. |
| Dasypus hybridus | Dasypus septemcinctus | accepted-synonym | 1337 | MDD incluye hybridus como subespecie de Dasypus septemcinctus. Una identidad; se conserva la fila original de Pampas. |
| Conepatus humboldtii | Conepatus chinga | accepted-synonym | 1468 | MDD incluye humboldtii en Conepatus chinga. Se conserva la población patagónica de la planilla sin generalizarla a todo el género. |
| Leopardus colocola | Leopardus colocola | source-concept-unresolved | 1334, 1466 | Se conserva el concepto amplio de la planilla en Pampas/Patagonia. MDD restringe L. colocola a Chile y separa pajeros/fasciatus/garleppi; las filas no permiten determinar un sustituto de forma unívoca. No equivale a afirmar presencia de colocola sensu stricto en todas esas áreas. |
| Leopardus tigrinus | Leopardus tigrinus | source-concept-unresolved | 911, 934 | MDD separa pardinoides y guttulus. La fila Andes del Norte no identifica localidad: se conserva tigrinus sensu planilla, pendiente de determinación. No se fusiona con wiedii ni se inventa una equivalencia con pardinoides. |
| Mazama americana | Mazama americana | accepted-restricted | 918, 950 | MDD reconoce americana y separa rufa/zetta. Se conserva la identidad para las subáreas amazónicas/vertientes bajas de la fuente, con alcance regional no certificado. |
| Saimiri sciureus | Saimiri sciureus | source-concept-unresolved | 755, 946 | MDD restringe sciureus y separa cassiquiarensis/collinsi/macrodon. La fila Caribe no permite elegir un taxón moderno inequívoco. Se conserva el concepto de la planilla, no una distribución costera general. |
| Cyclopes didactylus | Cyclopes didactylus | accepted-restricted | 940 | MDD reconoce varias especies de Cyclopes. Se conserva didactylus restringido al ámbito guayanés/norte oriental; no se atribuye a toda Amazonía. |
| Inia boliviensis | Inia boliviensis | accepted-restricted | 941 | MDD reconoce boliviensis separado de geoffrensis. Subárea: cuenca alta del Madeira, Bolivia/Brasil; no se duplica una localidad entre conceptos amplios. |
| Inia geoffrensis | Inia geoffrensis | accepted-restricted | 931 | MDD reconoce geoffrensis separado de boliviensis, humboldtiana y araguaiaensis. Subárea: cuencas amazónicas compatibles, excluyendo el concepto de boliviensis. |
| Electrophorus electricus | Electrophorus electricus | source-concept-unresolved | 955 | Se conserva electricus sensu fuente. No se añaden voltai/varii ni se asume que toda Amazonía corresponda al concepto restringido; requiere localidad y autoridad ictiológica accesible. |
| Arapaima gigas | Arapaima gigas | source-concept-unresolved | 953 | Se conserva gigas sensu fuente; sin localidad no se reasigna a otras Arapaima descritas. La consulta en línea al Catalog of Fishes fue bloqueada por la política de red del entorno, no por ausencia de la especie. |

Los cinco conceptos pendientes conservan el nombre de fuente y no se presentan como equivalencias modernas demostradas. Los dos Inia permanecen separados siguiendo MDD y con ámbitos de cuenca distintos. Los tres alias no producen especies duplicadas y no renombraron ningún ID histórico. El catálogo norteamericano, incluido Dasypus novemcinctus, no se modifica.

La consulta al Catalog of Fishes de California Academy of Sciences fue bloqueada por la política de red del entorno. No se afirma haber validado allí Arapaima o Electrophorus. Se conservan expresamente los registros y sus incertidumbres en lugar de inventar sustituciones.
