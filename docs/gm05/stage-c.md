# GM-05C · revisión mundial renderizada

Se inspeccionaron las 945 láminas normales en 14 tableros, separados por mamíferos, aves, reptiles/anfibios y peces/cefalópodos. El laboratorio reutiliza la ruta artística exacta del motor en un iframe opaco con almacenamiento solo en memoria, sin ticker, importaciones o escritura de partidas reales. Permite familia/subgrupo, búsqueda, tamaño64/80/120, páginas de 80 y variantes exclusivamente configuradas. El filtro familiar indica cuando el esquema antiguo no contiene una familia explícita.

Se confirmaron28 grupos de dibujos literalmente iguales después de retirar atributos técnicos. Esa igualdad no convierte a los animales en duplicados zoológicos. Se priorizó el grupo de Carcharhinus longimanus, Isurus oxyrinchus, Lamna ditropis y Prionace glauca: perfiles declarados distintos (mako/requiem) desembocaban en exactamente la misma silueta. Ahora tienen diferencias de cuerpo, rostro, dorsal, pectoral, cola y marcas sobrias. Se mantienen paleta, trazos y escala del juego. Son láminas editoriales, no claves diagnósticas exhaustivas ni tamaños reales.

Antes: `art/before-shark-profiles.png`. Después: `art/fish-0.png` y `art/after-mako.png`. La revisión detectó además la clasificación mamífera errónea del pico picapinos; la corrección documentada pertenece al commit GM-05A de clasificación, no a una fusión o rediseño. Su tablero previo se conserva en `art/before-woodpecker-class.png`.

Se comparan2605 rutas configuradas de piel/sexo: **solo cambian cuatro identidades, ocho rutas normal/Notable**. Las otras941 identidades, todas sus pigmentaciones y sexos permanecen literalmente iguales. No se añaden variantes biológicas ni dimorfismos. Las27 coincidencias restantes se registran como diferenciación pendiente, sin justificar un rediseño masivo o borrar identidad alguna.

`art/review-ledger.csv` incluye una fila por identidad. Las capturas y `art/browser-report.json` comprueban SVG XML, búsqueda y familia, variantes configuradas y anchuras320/360/390/412/1280 sin desbordamiento ni errores JavaScript. La inspección normal a 80 px y las pruebas de rutas no se presentan como una certificación anatómica exhaustiva de todas las variantes ni como prueba en Android físico.

Seis pruebas Node de integridad/arte pasan. Las evidencias de GM01 y las auditorías regionales previas se conservan.
