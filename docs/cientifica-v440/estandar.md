# Estándar de ilustración científica clásica

Aplicable al arte de la Serie 4 a partir de la candidata V4.4.0. Se conserva la composición por capas y la técnica de exportación establecidas en [V4.2.1](../naturalista-v421/estandar.md).

## Dirección artística

- Dibujar un ejemplar zoológico reconocible con línea fina de tinta o grafito, rayado y punteado donde aporten textura, y coloración natural en acuarela controlada. El texto, la información taxonómica y los indicadores de juego pertenecen a la interfaz.
- Mostrar el cuerpo completo siempre que la especie lo permita. Se admite una pose nueva cuando muestra mejor los rasgos diagnósticos. Una rama, roca o apoyo pequeño puede formar parte de la silueta si la postura lo requiere.
- Verificar perfil, proporciones, pelaje, orejas, hocico, cola y extremidades. Para los ungulados, comprobar pezuñas y dedos visibles, grupa, porte, melena, cornamenta y dimorfismo. Contrastar taxones próximos entre sí.
- Dibujar por separado las variantes con dimorfismo anatómico y los ejemplares legendarios configurados. Las variaciones de pigmentación conservan los rasgos y la textura de la especie. Cuando la lámina normal representa al macho adulto de forma inequívoca, es válida como su lámina para la ruta `male`.
- Mantener un margen transparente alrededor de la silueta. Revisar también los huecos entre patas, la transparencia de detalles finos y la ausencia de restos claros u oscuros del fondo. Comprobar los recursos sobre claro, oscuro y cuadrícula, a 512, 128 y 64 píxeles.

## Archivos y capas

1. La lámina maestra mide 512 × 512 px, con fondo alfa real. Exportar WebP a calidad 90, 86, 83 y 82 para 512, 256, 128 y 64 px respectivamente. Conservar el alfa a calidad 100 y descartar el color oculto por alfa cero.
2. Usar los IDs de especie y las variantes del catálogo vigente para los nombres y las rutas. La capa de halos mantiene las categorías normal, bronce, plata, oro y legendaria. El halo sigue la silueta. El marco clásico está disponible en el laboratorio.
3. Campo emplea el paisaje de la zona con su iluminación vigente. Bestiario selecciona el paisaje por hábitat. Cuaderno y Museo usan papel y vitrina respectivamente. Los cuatro módulos comparten el arte y seleccionan su derivado según el tamaño de presentación.
4. Guardar una comparación de Serie 4.3 en `www/naturalist-art/review/series-4.3/` cuando exista. Las referencias del laboratorio forman un caché opcional.
5. El archivo `www/naturalist-art/review/classical-plates.json` identifica los recursos incorporados con el estándar clásico. La generación de rutas rechaza una lámina registrada sin alfa o sin especie en el inventario.

## Excepciones de escala visual

Registrar el ID de la especie y un factor mayor que 0 y menor que 1 en `visualScales` del generador `scripts/build-naturalist-lab.cjs`. El motor usa 1,00 para los demás IDs. El factor reduce por igual el ancho y el alto de la imagen en todos los módulos y presentaciones habituales. El halo sigue la silueta transformada y la interfaz conserva el espacio original. Para revisar detalle o comparar antes y después, el laboratorio puede invocar el renderizador con `fullSize: true`. Las cuatro resoluciones, las partidas y los parámetros del catálogo quedan fuera de este ajuste.

## Validación

Comprobar identidad y variante, silueta a 64 px y pesos por resolución antes de registrar una lámina. Usar `node scripts/build-naturalist-lab.cjs` para regenerar el inventario y `node scripts/build-naturalist-release.cjs --write` para actualizar la revisión de caché. Ejecutar `npm run release:verify`, la comparación del laboratorio y la prueba de actualización PWA desde V4.3.0. La validación de Android documenta por separado el paquete, su firma y la restauración en dispositivo.

## Pigmentación ocular de variantes especiales · vigente desde V5.0.7

Aplicar esta revisión a futuras variantes de mamíferos, aves, reptiles, anfibios, peces y cefalópodos. Revisar láminas publicadas cuando se detecte un defecto concreto. La categoría jugable conserva sus rutas y su clave de guardado. La descripción biológica distingue albinismo, otras hipopigmentaciones, leucismo, melanismo y pseudomelanismo, y explicita la evidencia disponible.

- **Albinas.** Valorar iris rojo rubí, rojo rosado u oscuro, y apariencias violetas, lilas, lavanda o gris violáceo si encajan con la óptica y el fenotipo. El violeta puede ser un efecto óptico. Los grises perla, azulados o plateados pueden encajar mejor con otras hipopigmentaciones. La piel clara y el color ocular, por sí solos, son insuficientes para clasificar un morfo. Revisar pupila, iris, párpados, tejidos adyacentes y reflejo corneal conjuntamente.
- **Melánicas.** Usar de manera selectiva ámbar intenso, naranja cobrizo o dorado, amarillo miel, dorado o verdoso, y avellana pardo, dorado o ámbar oscuro si son plausibles. El incremento de pigmento en pelo, plumaje o piel permite que el iris conserve su color habitual. Dar prioridad al color documentado y marcar como interpretativa una elección artística.
- **Anatomía.** Conservar la forma anatómica de pupila de la especie, sea horizontal, vertical, redonda o de otra configuración. Usar reflejos discretos con el mismo sentido de iluminación que la lámina. Quedan descartados luminiscencia, colores fluorescentes y reflejos añadidos para suplir una silueta mal definida. A 64 px prima una cabeza legible. El iris, el párpado y el reflejo se valoran en ampliación.
- **Aprobación.** Consultar las referencias zoológicas y anotar el iris de la lámina normal, el tratamiento aprobado, el grado de evidencia y el motivo de cualquier cambio. Comparar normal, anterior y propuesta en crema y carbón a 64, 128, 256 y 512 px. Inspeccionar proporciones, párpados, pupila, textura y transición entre zonas pigmentadas antes de sustituir. Archivar el WebP anterior, registrar los rechazos y dejar constancia del color y de la versión en el laboratorio cuando proceda.

[Banks et al., pupilas y ecología visual](https://doi.org/10.1126/sciadv.1500391) · [GeneReviews, transiluminación e hipopigmentación ocular en humanos](https://www.ncbi.nlm.nih.gov/books/NBK590568/) · [Hofmeester et al., observaciones de probable leucismo en tejones](https://doi.org/10.1002/ece3.8052)
