# Láminas e ilustraciones candidatas de Oceanía

Se crearon perfiles para las **97 identidades preparadas**: 34 mamíferos, 41 aves, 18 reptiles, tres anfibios y un pez. No se añaden identidades ni se resuelven por dibujo las cuatro revisiones científicas abiertas.

El motor puro `oceania-art-v3290.js` acepta únicamente `origin=oc3290`. El dingo, el otárido y Aquila audax reutilizan bases compatibles existentes; el resto recibe perfiles regionales. Las pruebas comparan las ilustraciones anteriores, variantes y sexos: **ninguna de las 710 identidades anteriores cambia de SVG**. No se añade RNG ni trabajo al tick.

## Revisión renderizada

Se inspeccionaron las láminas normales, albinismo y comparaciones sexuales. El [inventario por identidad](review-ledger.json) conserva observación, correcciones del primer candidato, perfil, familia, estado científico y hash del SVG real. La inspección llevó a corregir el quokka (cola/cabeza/cuerpo), las rapaces, albatros, bolsa gular del pelícano, articulaciones de pequeños mamíferos y lagartos, collar del lagarto de volante, rasgos de macrópodos, Petauroides y taipanes. No se presenta una modificación de metadatos como diferencia gráfica: las 97 imágenes normales son distintas incluso quitando sus atributos de identidad.

Son dibujos candidatos, todavía sin aprobación de publicación. Varios perfiles nuevos usan un tratamiento de volumen y textura simplificado; cabe refinar la lectura de dedos, trazos finos, ornamentos y contraste a 64 px. El pase albino conserva anatomía, pero su contraste suave debe formar parte de la revisión final. La incertidumbre de cuatro conceptos sigue indicada en cada tarjeta y registro; no se inventan rasgos exclusivos de taxones segregados.

Las especies nuevas no tenían una ilustración pública anterior: el laboratorio muestra expresamente esa ausencia. Su modo de comparación ofrece **referencias de estilo de otras identidades compatibles** (lobo gris, lobo marino del Cabo y águila real), sin sugerir que sean sinónimos ni mezclar progresos. Las correcciones mencionadas se refieren al primer render candidato, no a supuestos errores del catálogo anterior.

## Laboratorio y evidencias

`www/laboratorio-arte-oceania-v3290.html` es independiente de partidas; no lee ni escribe almacenamiento. Comparte exactamente el catálogo, el router SVG, caché, pigmentación y decoración de especímenes del candidato integrado en el motor. No es una maqueta con otro renderizador.

Permite región, clase, familia, búsqueda sin tildes, orden por morfologías similares, cuatro conceptos pendientes, natural/albino/Notable/macho/hembra, tamaño 64/80/120 y paginación 24/32. El modo 97 se reserva para producir láminas diagnósticas, nunca para la apertura normal del Bestiario.

- [Mamíferos](mammals.png), [aves](birds.png), [reptiles](reptiles.png), [anfibios](amphibians.png), [pez](fish.png).
- [Albinos](albino.png), [machos](male.png), [hembras](female.png), [Notables](alfa.png).
- [Macrópodos similares](similar-macropods.png), [referencia canina compatible](compatible-canid-reference.png).
- Capturas móviles: [320](mobile-320.png), [360](mobile-360.png), [390](mobile-390.png), [412](mobile-412.png).

El navegador validó **212 combinaciones** SVG reales sin errores XML. También verificó filtros, límite inicial de 24 tarjetas, referencias, cuatro revisiones pendientes, siete comparaciones sexuales, cuatro albinos y ausencia de desbordamiento horizontal en cuatro tamaños. El almacenamiento se bloquea en el ensayo para detectar cualquier uso accidental. Esto es Chromium emulado, no un teléfono Android físico ni una certificación zoológica.

```sh
node scripts/build-oceania-art-lab-v3290.cjs --check
node --test tests/oceania-art-v3290.test.cjs
node scripts/review-oceania-art-v3290.cjs
node scripts/export-oceania-art-review-v3290.cjs --check
```

Nada de esto activa los archivos en `index.html` ni en el service worker público. `approvedForProduction` continúa en `false`.
