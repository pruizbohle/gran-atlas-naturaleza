# El Gran Atlas V5.1 · LEG-01

La colección alcanza **20 legendarios**. Se revisaron los doce existentes, se aprobaron cuatro rediseños y se conservaron ocho láminas. Los ocho ejemplares nuevos pertenecen a especies ya registradas. [Galería comparativa](comparativas.md) · [Registro de decisiones y huellas](decisiones.json) · [Cobertura de la colección](evidencia/cobertura.json)

## Pausa pigmentaria

El cierre de ART-07 que figura en el encargo registraba 68 variantes correctas y 104 mejorables. Tras ART-08, la pausa queda en **88 correctas, 84 mejorables, 2 insuficientes y 390 sin evaluar**, con 174 examinadas de 564. El león y el zorro ártico melánicos continúan pendientes de revisión biológica. El oso tibetano conserva su sustitución histórica por una variante albina interpretativa. [Método, estado y enlaces de continuidad](../arte-pigmentarias/estado-pausa.md)

## Revisión de las doce láminas

| Ejemplar | Decisión | Rasgo visual |
| --- | --- | --- |
| Ascua · Zorro rojo | Rediseñado | La cola envolvente concentra cobre y bermellón, con el pecho marfil y la punta clara. [Evidencia](evidencia/ascua-comparativa.png) |
| Atlas · Elefante de sabana | Rediseñado | Cuatro patas con apoyos separados. La trompa curva queda libre por delante y los dos colmillos conservan longitudes distintas. [Evidencia](evidencia/atlas-carbon.png) |
| Fenrir · Lobo gris | Rediseñado | El aullido alza el hocico sobre la gorguera plateada. La postura distingue a Fenrir de perfil y en miniatura. |
| Silverback · Gorila de montaña | Rediseñado | La pose sentada deja leer la cresta, los nudillos y la silla plateada del lomo. |
| Ámbar · Tigre siberiano | Conservado | Zancada adelantada y gorguera invernal de rayas anchas. |
| Niebla · Leopardo de las nieves | Conservado | Cola arqueada, rosetas abiertas y apoyo bajo en la roca. |
| Centinela · Águila real | Conservado | Silueta posada y nuca dorada frente al águila normal en vuelo. |
| Basalto · Dragón de Komodo | Conservado | Postura baja de tres cuartos, patas robustas y cola elevada. |
| Seda · Cobra real | Conservado | Cuello erguido, espiras visibles y escamas ventrales ocres. |
| Junco · Cocodrilo del Nilo | Conservado | Escudos dorsales irregulares y hocico marcado en tres cuartos. |
| Áncora · Tortuga gigante de Aldabra | Conservado | Cuello levantado, patas columnares y caparazón de anillos. |
| Remonte · Salmón rosado | Conservado | Perfil reproductivo de macho con joroba y mandíbula ganchuda. |

La revisión consultó las identidades originales, comparó las doce láminas contra el animal base y contra las variantes disponibles, y conservó las referencias de V5.0.12. La boca elevada de Fenrir y la pose sentada de Silverback fueron aprobadas tras descartar las primeras propuestas por su similitud con las láminas vigentes. [Identidades de V3.19.9](../polish-v3199/legend-relicts.md) · [Auditoría de cobertura de V4.9.6](../cientifica-v496/legendarios.json) · [Referencia anterior 1](evidencia/baseline-1.jpg) · [Referencia anterior 2](evidencia/baseline-2.jpg) · [Referencia anterior 3](evidencia/baseline-3.jpg)

## Ocho incorporaciones

La búsqueda en el registro inicial de V3.19.7, los documentos de auditoría, los inventarios de V4.9 y las solicitudes disponibles recuperó doce identidades activas. Los cuatro casos citados como pendientes en V4.7.4 ya habían sido incorporados. Para alcanzar la meta de veinte indicada en LEG-01, se definieron ocho identidades de trabajo. Se partió de especies con lámina científica y regiones existentes. Gran kudú, pangolín gigante y picozapato ya figuraban en la selección histórica de especímenes especiales.

| Nuevo legendario | Especie | Rasgo distintivo |
| --- | --- | --- |
| Espiral | Gran kudú | Cornamenta espiralada, cabeza de frente y barba de borde blanco. |
| Bastión | Pangolín gigante | Postura defensiva en arco y escamas cobrizas superpuestas. |
| Ciénaga | Picozapato | Pico jaspeado inclinado, cresta desflecada y postura agazapada. |
| Alisio | Frailecillo atlántico | Alas alzadas y pies palmeados atrás en el despegue. |
| Filigrana | Ajolote mexicano | Nado en curva con branquias color ciruela y flanco oliváceo. |
| Terracota | Canguro rojo | Salto horizontal, manto rojo arcilla y cola en contrapeso. |
| Orla | Ballena jorobada | Giro en ascenso con aletas largas y manchas ventrales en la cola. |
| Marea | Pulpo gigante del Pacífico | Abanico de ocho brazos con ventosas claras y piel moteada coral. |

Se descartó la primera propuesta de Filigrana porque repetía el ángulo del ejemplar normal. En la primera propuesta de Marea solo se distinguían siete brazos. Las comparativas conservan ambos intentos. [Galería visual](comparativas.md)

## Verificación y acceso

El modo **Colección de legendarios** del laboratorio admite la colección completa, los nuevos, los mejorados y los históricos conservados. Sus tarjetas muestran la normal, los morfos configurados, el original archivado cuando existe y el legendario vigente. La comparación se presenta sin halos. Campo, Cuaderno, Bestiario y Museo conservan la categoría visual del juego.

Se prepararon 48 WebP transparentes en cuatro resoluciones. Se archivaron sin pérdida los 16 originales sustituidos e ingresaron 32 derivados nuevos al manifiesto. El peso de los recursos activos modificados pasó de 337.202 a 890.650 bytes. Se comprobó que las partidas anteriores conservan Ascua y Atlas, que cada incorporación usa el registro de aparición única, y que las tasas históricas y de pigmentación permanecen iguales para cada especie. [Evidencia gráfica de escritorio y móvil](evidencia/) · [Prueba de recursos y partidas](../../tests/leg01.test.cjs) · [Verificación en Chromium](evidencia/laboratorio.json)

Pasaron 37 pruebas de legendarios, variantes y partidas. La suite gráfica registró 20 aprobadas y tres discrepancias históricas de V4.7.3, V4.9.3 y V4.9.5. Las tres se reprodujeron en `ee39bfc` y corresponden a aserciones que aún esperan el oso tibetano melánico retirado en ART-06. [Caso del oso tibetano](../arte-v5010/README.md#oso-tibetano-de-melánico-a-albino)

El laboratorio se abre en `/naturalist-art/?view=legendary` al servir el directorio `www` de la rama de auditoría.

## Próxima etapa

Revisar la lectura de la colección completa en móviles de gama baja durante la próxima ronda dirigida de estabilidad. Los casos biológicos pendientes y el lote pigmentario siguiente quedan registrados para retomar AUD-04 cuando corresponda. [Estado de pausa](../arte-pigmentarias/estado-pausa.md)
