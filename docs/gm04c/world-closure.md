# Diagnóstico de cierre GM-01–GM-04 · 3.34.0

Generado después de verificar la publicación `bdca479`: [Actions correcto](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42869520485), [154 hashes públicos](published-report.json) y [navegación HTTPS/offline](published-browser.json). GM-04 está implementado; **GM-05 no se ha iniciado**. Este diagnóstico propone prioridades para decidir su alcance, sin modificar taxonomía, economía, datos fuente ni firma Android.

## Balance de fases

| Fase | Altas | IDs reutilizados en esa fase | Regiones añadidas | Presencias fuente incorporadas | Total resultante especies / regiones / presencias |
| --- | ---: | ---: | ---: | ---: | --- |
| GM-01, auditoría de base 3.28.0 | 0 | 710 inventariados | 0 (79 existentes) | 1574 filas inventariadas, sin importación | 710 / 79 / 1329 |
| GM-02, Oceanía 3.29.0 | 97 | 0 | 8 | 131 | 807 / 87 / 1460 |
| GM-03, Polos 3.31.0 | 21 | 1 | 7 | 45 | 828 / 94 / 1505 |
| GM-04A, superficie 3.32.0 | 95 | 18 | 12 | 192 | 923 / 106 / 1697 |
| GM-04B, profundidad 3.33.0 | 20 | 4 | 5 | 44 | 943 / 111 / 1741 |
| GM-04C, fosas 3.34.0 | 2 | 1 | 2 | 3 | **945 / 113 / 1744** |

Comercio 3.30.0 cambió economía y progresión, sin añadir especies, regiones o presencias. Desde la base GM-01 se agregaron **235 identidades, 34 regiones y 415 presencias**. GM-04 aporta 19 regiones y 239 presencias: **117 identidades nuevas y 20 IDs que ya existían antes de GM-04**, 137 identidades efectivas distintas. Los eventos de reutilización de cada subfase incluyen identidades creadas en otra subfase; por eso no se suman para calcular reutilización global.

La reutilización polar corresponde al zorro ártico. Las listas completas de IDs reutilizados, las 415 filas incorporadas y los rangos de prestigio están en [world-closure.json](world-closure.json). En GM-04C se reutiliza íntegramente `deep_esp_bathypterois_grallator`; no existe un segundo pez trípode abisal.

## Fuente cubierta y límites de correspondencia

La fuente conserva **900 filas de catálogo, 1574 filas Fauna y 209 celdas**. Recuento directo de los CSV: **103 celdas con fauna y 106 sin fauna**. Las 103 pobladas tienen destino funcional; los 34 sectores futuros de GM-02/03/04 ya están presentes. Las 106 reservas no se activan como regiones. Las diez regiones africanas adicionales y las cuatro celdas visuales históricas sin función se conservan: 113 regiones funcionales frente a 117 celdas visuales de todos los mapas.

Se verifica cada una de las 415 filas antes pendientes contra un ID de región y una identidad efectivamente incluidos en producción, sin duplicar su fila. Los cuatro CSV GM-01 siguen idénticos a `e060d0f`; el Excel no se abre ni reconstruye. Las 1159 filas de regiones previas conservan sus estados: 1148 correspondencias implementadas, 10 conflictos de rango y una diferencia taxonómica/distributiva documentada. No se presentan estas últimas once como equivalencias nuevas aprobadas.

El catálogo fuente se vincula actualmente con **898 IDs canónicos de producción**. Subsisten dos conceptos sin equivalencia de rango aprobada; otros 47 IDs históricos del juego permanecen sin correspondencia canónica aprobada con una fila fuente. Esa ausencia no prueba un error ni autoriza borrar identidades. La unificación de dos nombres de pecarí y la separación editorial de poblaciones originalmente llamadas Octopus vulgaris explican por qué filas nominales, conceptos e IDs no se deducen por una resta simple.

**Discrepancia documental encontrada:** `docs/gm01/summary.json`, campos `source.populated_cells` y `source.reserved_cells`, conserva 209/0; sus CSV y el resumen Markdown documentan 103/106. El diagnóstico registra ambos valores. No se altera retroactivamente el informe de GM-01 ni se confunde ese contador con la cobertura geográfica final. Normalizar su presentación es una prioridad documental para GM-05.

## Taxonomía y distribución por revisar

- **Gorilla beringei, GM01-0087:** la fuente usa rango especie y el juego conserva el gorila de montaña como subespecie. No se certifica cobertura de todo el gorila oriental. Afecta la fila 1234.
- **Panthera pardus, GM01-0092:** etiquetas persa/especie frente a las subespecies existentes de Asia y África. Nueve presencias fuente mantienen la discrepancia de rango. No se fusionaron ni se añadieron por coincidencia de género.
- El dingo dejó de ser un bloqueo: GM-02 documentó el concepto MDD como **Canis familiaris**, limitado a las poblaciones de dingo indicadas por la fuente; no incorpora todos los perros domésticos. Las revisiones de kiwi, Lophorina, Crocodylus novaeguineae, Petauroides y Trichoglossus tienen decisiones posteriores explícitas; los borradores anteriores que las llaman pendientes son historia, no el estado de publicación.
- Sigue la diferencia documentada del Magreb: fuente Canis aureus frente al Canis lupaster del juego. No es sinonimia ni una instrucción para ampliar al chacal euroasiático. Conservar también los complejos heredados de Arapaima, Electrophorus, gato de pajonal, tigrillos y el concepto caribeño señalado por AM-04. Requieren localidad/autoridad para resolverlos, no cambios automáticos por nombre común.
- Las decisiones oceánicas están trazadas: Aetobatus ocellatus para subáreas indopacíficas, tratamiento edeni/brydei adoptado, rockhoppers orientales, Octopus tetricus neozelandés, Moroteuthopsis ingens y corrección editorial Grimpoteuthis abyssicola en Tasmania. No se certifican distribuciones uniformes dentro de los grandes sectores.
- En fosas se usa Pseudoliparis kermadecensis conservando Notoliparis como nombre fuente. El cambio de género tiene respaldo actual, pero las delimitaciones y distribuciones hadales siguen sujetas a investigación. Los dos peces caracol mantienen localidades conservadoras; Bathypterois no se asigna al interior hadal.

No se declaran resueltas globalmente las 413 incidencias congeladas de GM-01: algunas son diferencias de catálogo, colisiones ya tratadas o advertencias heredadas. GM-05 necesita un registro derivado que enlace cada incidencia con decisiones posteriores y distinga «resuelta», «contexto histórico», «pendiente» y «sin defecto demostrado».

## Sprites y variantes

Las 945 identidades tienen SVG normal presente. Las pruebas actuales comparan literalmente los 943 anteriores y todas sus variantes/sexos configurados. El laboratorio de fosas muestra las tres identidades a 64/80/120 px; los dos peces caracol tienen pectorales y perfiles diferenciados, sin luz biológica. La revisión renderizada incluye corrección y recaptura del disco pélvico.

Las expansiones polares/oceánicas utilizan Notable con tasa existente; GM-04C conserva **1% por espécimen** en las condiciones iniciales del motor. No añade pigmentaciones ni dimorfismos. Oceanía conserva sus variantes y dimorfismos aprobados. La igualdad de SVG y la ausencia de nombres completos duplicados no prueban que todos los perfiles antiguos sean científicamente perfectos: una revisión visual mundial por familia queda como candidata para GM-05.

## Economía, prestigio y rendimiento

La escala de acceso real no se solapa: Europa 0–9; Asia 10–50; África 53–122; Norteamérica 125–177; Sudamérica 182–227; Oceanía 233–275; Polos 282–324; superficie 332–420; profundidad 429–465; fosas 475/485. Prestigio y acreditaciones no se consumen. Las 943 especies anteriores a fosas permiten superar 485 sin depender de las dos nuevas; no hay un ciclo de material o prestigio necesario para entrar.

Persisten las rutas comerciales de 4/8/12/24 h y sus pagos originales. El sondeo extraordinario cuesta £60 y 10 conocimiento por intento de 300 s, frente al muestreo de £30 y 5 por 180 s. No se garantiza identificación. Esto introduce un coste de tiempo y un posible tramo largo hasta el espécimen Notable del quinto nivel; falta medir la progresión completa con distintas mejoras y naturalistas. No se transforma el 1% en un tiempo esperado universal: hay intentos fallidos, censos, grupos y automatización.

**Posibles desequilibrios para medir, sin corregirlos aquí:** tiempos de espera entre tramos de prestigio, ingresos pasivos frente al precio de investigaciones, utilidad relativa de Comercio, coste por identificación profunda y diferencias entre operación manual pagada y clasificación automática con la cadencia heredada. La ausencia de negativos o recompensas duplicadas no demuestra equilibrio de una campaña larga.

Bestiario mantiene 32 tarjetas. La medición actual CPU×4 pasa de 395,0 a 390,4 ms en primera apertura y de 215,8 a 169,8 ms en mediana de reapertura, con dispersión entre muestras. Es una comprobación de emulación, no una mejora atribuible a las dos altas ni una medición de Android físico. No se recibieron métricas de heap; quedan medición de memoria y campaña prolongada en dispositivo.

## Cobertura y prioridades propuestas para GM-05

La publicación pasa **473 pruebas históricas sin cambiar expectativas y 20 actuales**, revisión artística, PWA 3.33→3.34 con respaldo exacto, protección de trabajo científico y viaje comercial pendientes, resolución única, regreso de 72 h, exportación/importación, cuotas de almacenamiento y pantallas 320/360/390/412/1280 px. La web pública tiene sus 154 hashes verificados y navegación/offline comprobados. Las 20 pruebas actuales recorren toda la elegibilidad previa y las tres presencias nuevas; no son una revalidación científica de todas las ocurrencias mundiales.

Propuesta para decidir el siguiente alcance:

1. Resolver intención/rango del gorila y leopardo, y clasificar las incidencias heredadas enlazando las decisiones efectivas posteriores.
2. Conciliar contadores y estados documentales congelados con un resumen vigente, manteniendo los archivos fuente trazables.
3. Revisar primero las distribuciones con incertidumbre AM-04 y las correcciones oceánicas editoriales; separar errores demostrados de sectores amplios y alias válidos.
4. Medir una campaña de economía/prestigio, incluido el quinto nivel de especies de fosa y la relación entre operaciones pagadas, naturalistas y Comercio.
5. Auditar visualmente familias antiguas y medir memoria/reapertura larga en un teléfono real. Android, exportación nativa en dispositivo y firma permanente requieren un trabajo separado expresamente autorizado.

No se ejecuta ninguna de estas acciones de GM-05. Reproducción del diagnóstico: `python3 scripts/summarize-world-close-v3340.py` después de disponer de los informes de publicación verificada.
