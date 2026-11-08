# Américas · Plan posterior a AM-01

**Documento de planificación. Ninguna etapa de implementación se ejecuta con esta auditoría.** Catálogo de referencia: 3.21.2, 487 especies y 57 regiones funcionales. [Informe AM-01](americas-audit.md) · [Inventario de especies](americas-species-audit.csv) · [Inventario de regiones](americas-regions-audit.csv).

## Condiciones previas y contrato de datos

Antes de incorporar una fila afectada se deben resolver sus incidencias en [issues.csv](americas-audit/issues.csv), indicando autoridad, referencia consultada, fecha, nombre aceptado, decisión geográfica y relación con la fila original. El Excel conserva 398 presencias americanas; la implementación no puede reducir ese libro de procedencia al filtrar casos dudosos. Si una presencia se rechaza o reasigna después de investigar, registrar el original, el destino o rechazo y su justificación. No equivale a tener que implementar una distribución científicamente incompatible.

Se recomienda un subpaso **AM-01R, resolución de identidades y distribuciones**, para los 14 E, el grupo Pecari/Dicotyles, las siete alertas geográficas altas y las demás subáreas. Puede resolverse por continente antes de AM-02 o AM-04. La auditoría actual no certifica esas decisiones ni reemplaza una revisión zoológica de autoridades actualizadas.

### Identidad estable

- Reutilizar los 26 IDs existentes, incluidos `eu_esp_0267`, `af_xlsx_131_pandion_haliaetus` y `na_esp_puma_concolor` en las Américas que correspondan.
- Una especie puede tener múltiples presencias. El registro canónico no se duplica por continente, región, nombre común, sexo ni pigmentación.
- El candidato `Pecari tajacu → Dicotyles tajacu` conservará los IDs de origen ESP-0411/ESP-0167 y las cinco presencias. La combinación aceptada dependerá de la autoridad elegida.
- Las propuestas `am_<género>_<especie>` del CSV son solo nombres de planificación. Tras aprobarlos deben congelarse; no renombrar IDs de partida porque cambie el género científico. Los 14 E no reciben un ID definitivo aquí.
- Las regiones norteamericanas piloto mantienen sus IDs actuales. Las restantes propuestas norteamericanas solo usan IDs HX libres como identificadores, nunca como coordenadas.
- Sudamérica usa propuestas semánticas `sa_*` y un campo independiente de procedencia `sourceHexId`. **HX-06-07 ya pertenece al Sáhara; Amazonía no puede apropiárselo.**

### Campos que deberá contener la preparación de datos

| Entidad | Campos y origen |
| --- | --- |
| Taxón | ID estable; nombre científico original/aceptado; nombres comunes/alias; grupo y subgrupo de fuente; clase/familia revisadas; categoría AM-01; referencias de decisión |
| Perfil de juego | Rareza normalizada al vocabulario actual; `kind`/clasificación correcta; hábitats, horarios y estaciones justificados; color/perfil SVG; configuraciones de variantes y sexo explícitas |
| Presencia | ID de taxón + ID de región; hoja/fila e IDs originales; bioma original; subárea cuando proceda; estado de revisión; decisión de conservar/reasignar/rechazar documentada |
| Región | ID estable; nombre y continente; hábitats como máximo cuatro; lista única de IDs canónicos; requisitos aprobados; enlace a procedencia; ubicación conceptual separada de la celda |

Ni familias formales ni horarios/estaciones, pigmentación, dimorfismo o costes provienen de la planilla. No inventar que son datos del Excel. La estructura anterior es un **contrato lógico**, no obliga a introducir ahora una biblioteca, migración de base de datos o capa adicional en producción. La forma final puede adaptarse a los objetos actuales manteniendo su trazabilidad.

### Separación de cartografía y juego

El diseño visual del Atlas está pendiente de aprobación. AM-01 no lo modifica. AM-02/AM-04 deben distinguir la preparación de datos de su publicación jugable: convertir una celda de contexto o enlazar una región nueva requiere una relación aprobada entre región y celda. Si esa aprobación todavía falta, mantener los datos preparados fuera del catálogo de producción; no publicar regiones sin un acceso jugable coherente ni rediseñar el mapa silenciosamente.

Norteamérica ya tiene 14 celdas de referencia. No se reconstruyen las 209 del Excel, no se rellenan continentes ni se altera la separación de las islas africanas. Para Sudamérica la disposición compacta y su enlace a las diez regiones necesitarán una solicitud cartográfica independiente si exceden la aprobación disponible.

## AM-02 — Norteamérica: regiones y fauna

**Alcance previsto:** doce regiones funcionales nuevas, las catorce del Excel contando las dos actuales; 206 presencias originales. Los 129 binomios de fuente representan provisionalmente 128 identidades tras agrupar el pecarí: 26 existentes y **102 candidatas nuevas**, dos de ellas E.

### División recomendada

1. **AM-02A, normalización e identidad.** Resolver las dos E norteamericanas (`Dasypus novemcinctus`, `Spilogale gracilis`), la sinonimia del pecarí y las alertas norteamericanas. Preparar un lote de datos revisable fuera de producción, con correspondencia entre 206 filas fuente y sus identidades/destinos. Registrar coincidencias y alias; normalizar solo la escritura de la rareza, manteniendo los tiers actuales de los reutilizados.
2. **AM-02B, norte y centro.** Incorporar, cuando el vínculo cartográfico esté aprobado, Bosques boreales de Canadá, Yukón, Montañas Rocosas, Grandes Llanuras y Región de los Grandes Lagos. Preservar Alaska y Columbia Británica; introducir una especie compartida solo en su primer lote.
3. **AM-02C, costa y Mesoamérica.** Costa del Pacífico, Bosques del este norteamericano, Sonora, Sierra Madre, Yucatán, Costa del golfo de México y América Central. Aplicar las decisiones de Xochimilco, Cozumel, tortuga del desierto y subáreas correspondientes. Completar las 14 regiones y 206 presencias trazadas.

La distribución de candidatos nuevos entre lotes se calculará por identidad canónica al ejecutarlos; no sumar listas regionales como especies diferentes. Los lotes con nuevas anatomías deben coordinarse con AM-03 antes de publicarse: no mostrar animales de familias incorrectas como reemplazo temporal.

### Requisitos y aceptación

- Conservar `nuevo_mundo_1`, `norteamerica_1`, sus compras/flags, recetas y objetos. Alaska sigue con prestigio 125 y Columbia con 128. No consumir el mapa al desbloquear ni perder visitas históricas.
- Aprobar mínimos para las doce regiones nuevas tras revisar el tramo 125/128, las rutas de prestigio y una partida avanzada. No fijarlos copiando números HX ni aumentar los de las regiones ya ganadas.
- No cambiar las cinco rarezas actuales discrepantes. La importación de Muy raro se normaliza a Muy rara para no usar el peso por defecto del motor.
- Validar que cada especie regional tenga al menos un hábitat/horario/estación alcanzable. Evitar que un bioma de región sustituya los hábitats específicos de todos sus animales.
- Los 28 registros de los pilotos y sus 24 identidades permanecen iguales; los IDs de avistamientos, investigación y publicación se conservan.
- Una vez resueltas las incidencias, demostrar cobertura de las 206 filas; cada excepción debe tener decisión documentada. Sin duplicados especie × región ni IDs que no existan.

**Fuera de alcance:** nuevos sistemas económicos, ampliaciones del Museo, cambios de botín o expediciones, rediseño continental y una progresión sudamericana implementada anticipadamente.

## AM-03 — Norteamérica: sprites y pruebas

**Carga estimada por identidad:** 25 dibujos existentes reutilizables, uno existente a revisar, **59 adaptaciones** y **43 perfiles específicos nuevos**. Estas cifras cuentan especies, no motores ni bases únicas, y dependen de resolver las dos E y el alias.

Se recomienda dividir en AM-03A mamíferos, AM-03B aves y AM-03C reptiles/anfibios/peces y verificación conjunta. Se pueden desarrollar los motores en paralelo temporal con los datos, pero esta fase no autoriza delegación automática ni publicar un lote incompleto.

- Extender las familias correctas para cánidos, felinos, ungulados, mustélidos y roedores; el berrendo no es un ciervo y los pecaríes no se aceptan como jabalíes sin anatomía propia.
- Crear perfiles de mapaches/coatíes, zorrillos, zarigüeyas, primates americanos, perezosos, osos hormigueros y manatí, además de aves y herpetofauna nuevas.
- Revisar el búho nival existente para confirmar ausencia de penachos ajenos. Evitar la ruta Uromastyx para Ctenosaura, Andrias para Dicamptodon y tortuga terrestre para Chrysemys.
- El ajolote necesita branquias externas y clase Amphibia/orden caudado; no una rana ni un reptil. Las serpientes de cascabel necesitan su anatomía y cascabel, no solo cambiar el color de otra serpiente.
- Aprobar dimorfismo por especie y estación; los tipos actuales de alce/reno se conservan. No añadir entradas a `SEXUAL_DIMORPHISM` sin dibujos y flujo de observación correspondientes.
- Revisar cada variante configurada, contornos, ojos, patrones y legibilidad a 56/80/120 px; sexo y pigmentación no cambian la identidad zoológica.

**Aceptación:** motor, clase, familia zoológica y perfil correctos para todas las identidades del lote; ningún fallback de familia ajena; encuentros manuales/automáticos y filtros alcanzables; especie compartida dibujada por el mismo ID; pigmentación/sexo conservan anatomía; guardado/restauración y progreso de pilotos sin pérdidas. Los contratos actuales de mecánicas y arte siguen pasando salvo cambios expresamente aprobados en el alcance gráfico.

## AM-04 — Sudamérica: regiones y fauna

**Alcance de fuente:** diez regiones, 192 presencias y 131 nombres científicos. Hoy solo el puma existe: 130 identidades todavía ausentes si se analiza Sudamérica aisladamente. Tras completar Norteamérica se reutilizarían **diez identidades** y quedarían **121 altas adicionales**, incluidas las doce E sudamericanas.

### División recomendada

1. **AM-04A, taxonomía y preparación.** Resolver las doce E; cerrar las alertas de Andes, Amazonía/Pantanal, Atacama y Patagonia; preparar IDs `sa_*`, procedencia y perfiles sin tocar el juego. Confirmar que ningún ID colisiona con África, en particular Amazonía/Sáhara.
2. **AM-04B, norte y cordillera.** Caribe sudamericano, Llanos del Orinoco, Andes del Norte y Andes Centrales. Diferenciar llanura, vertientes, piedemonte y altura. No trasladar una especie de selva baja a toda la cordillera.
3. **AM-04C, cuencas y sabanas.** Amazonía, Pantanal y Cerrado. Reutilizar las identidades del lote anterior y de Norteamérica. Distinguir cuencas y presencia nativa/introducida; cerrar la decisión sobre Colossoma en Pantanal.
4. **AM-04D, sur y ambientes áridos.** Pampas, Atacama, Patagonia/Tierra del Fuego. Precisar complejos de felinos, litorales, bosques y altiplano. Conservar la trazabilidad de todas las presencias originales.

### Progresión propuesta, por aprobar antes de activar

Mantener la cadena Europa → Asia → África → Nuevo Mundo → Norteamérica. Una futura Cartografía de Sudamérica podría requerir `norteamerica_1` y un mapa sudamericano fabricado con piezas obtenibles antes de acceder a Sudamérica. Definir su abastecimiento en una solicitud separada que autorice una ruta nueva o una fuente concreta; no modificar expediciones existentes en este trabajo documental.

Revisar qué mide la progresión (prestigio acumulado, publicaciones y tiempo real) con partidas representativas. No exigir completar el continente norteamericano entero por defecto ni fijar dinero, conocimiento, piezas o mínimos sudamericanos en este plan. No reutilizar los flags ni mapas de Norteamérica para saltarse la investigación nueva. La persistencia debe reconstruir el nuevo flag desde su compra como hacen los actuales.

**Aceptación:** diez regiones con IDs propios, las 192 filas con destino/decisión trazable, sin duplicados de las diez especies compartidas; acceso y viajes con condiciones explícitas, sin caer en el fallback genérico de prestigio; contenido anterior sin bloqueos retroactivos; relación con el Atlas aprobada y jugable antes de publicar. Las cifras definitivas se actualizan si las revisiones taxonómicas cambian el concepto de especie.

## AM-05 — Sudamérica: sprites y pruebas

Carga analizada aisladamente: un dibujo existente, 59 adaptaciones y 71 perfiles nuevos. Tras terminar AM-03, cinco de esos perfiles y cuatro adaptaciones ya pertenecerían a especies compartidas. Por ello el trabajo adicional previsto es **66 perfiles y 55 adaptaciones**, no repetir 130 tratamientos nuevos.

Dividir preferentemente en AM-05A mamíferos, AM-05B aves, AM-05C reptiles/anfibios y AM-05D peces y regresión conjunta. La carga de los E es provisional; resolver identidades antes de dibujar rasgos de una especie que podría resultar otra.

- Mamíferos: jaguar/Leopardus correctamente diferenciados, primates americanos, perezosos, armadillos, osos hormigueros, capibara/mara/coipo, camelinos sin joroba, oso de anteojos, nutria gigante y delfines de río.
- Aves: tucanes, guacamayos, colibríes, gallito de las rocas, ñandúes, cóndor, hoacín, chajá y aves ribereñas; no aceptar cálaos por tucanes ni avestruces por ñandúes.
- Herpetofauna: boas/anacondas con perfil propio, caimanes, ranas de familias correctas, tegu e iguanas; no copiar solo patrones de pitón o varano.
- Peces: perfiles propios de arapaima, tambaqui/piraña, surubí, dorado, pejerrey, tetra, disco y Electrophorus; un pez eléctrico no se representa como serpiente.

**Aceptación:** todas las identidades habilitadas tienen ilustración correcta y variantes revisadas; los dibujos de compartidas no se duplican; no cambia la identidad por sexo/pigmentación; registro de encuentros y filtros permite recorrer todas las presencias aprobadas; revisión de familias/morfología a escala móvil y sin fallbacks zoológicamente ajenos. Los dibujos existentes reutilizados mantienen sus contratos de arte.

## AM-06 — Integración y estabilización

1. **Integridad final:** recalcular catálogo, IDs y presencias a partir de las decisiones reales. La previsión actual es 710 entradas/79 regiones, condicionada a resolver los E; no forzar ese número si la ciencia justifica otro. Demostrar que ninguna fila original quedó sin decisión.
2. **Progresión:** recorrer Europa → Asia → África → Norteamérica → Sudamérica desde partidas representativas; comprobar mapas conservados, fuentes accesibles antes del bloqueo y ausencia de ciclos. Verificar los accesos actuales de Alaska y Columbia.
3. **Guardados:** importar/exportar partidas antiguas, avanzadas, offline y con regiones norteamericanas ya ganadas. Comparar dinero, conocimiento, prestigio, especies, sexo, variantes, inventario y regiones; preservar la clave `gran_atlas_v05` y todos los IDs históricos. Un alias de fuente sin ID previo no requiere migrar avistamientos existentes.
4. **Rendimiento:** medir filtros y navegación del Cuaderno, escenas de Campo, SVG/cachés y tiempos/tamaño de guardado con el catálogo ampliado. Mantener la generación bajo demanda y revisar el crecimiento de cachés según medidas, sin cambiar economía o probabilidades como optimización.
5. **Android y PWA:** validar compilación, persistencia nativa, respaldo/restauración, revisión offline completa y actualización desde una instalación antigua. Activar una revisión solo cuando todos los recursos estén disponibles; no borrar datos del navegador como procedimiento de actualización.
6. **Atlas aprobado y responsive:** comprobar vínculos región/celda, selección, viaje, continente completo visible, celdas unidas y controles en móvil, respetando la cartografía expresamente autorizada. Mantener las dos islas africanas separadas y las 14 celdas norteamericanas de referencia.
7. **Regresión:** ejecutar los contratos actuales de mecánicas, economía, arte, Museo y expediciones; añadir pruebas de identidad compartida, colisión Amazonía/Sáhara, normalización de rareza, accesibilidad y guardado ampliado. No actualizar snapshots indiscriminadamente para ocultar diferencias.

**Salida:** informe con conteos finales, decisiones taxonómicas y geográficas, cobertura de fuente, medidas de rendimiento, resultados Android/PWA y evidencia de conservación de partidas. Cualquier actualización de versión jugable corresponderá a una fase implementada y probada; AM-01 no la requiere.

## Entregables y criterios para cada solicitud independiente

| Fase | Entregable concreto | Condición de cierre |
| --- | --- | --- |
| AM-01R | Decisiones trazadas de taxonomía/distribución | Ningún caso afectado se importa sin decisión; originales conservados |
| AM-02 | Datos e integración de 14 regiones norteamericanas | 206 presencias trazadas; pilotos y desbloqueos conservados; arte y vínculo cartográfico aprobados |
| AM-03 | Arte americano del norte y validación | Familias correctas, variantes y encuentros revisados; cero duplicación de compartidas |
| AM-04 | Datos e integración de diez regiones sudamericanas | 192 presencias trazadas; IDs sin colisiones; acceso explícito y aprobado |
| AM-05 | Arte sudamericano y validación | Perfiles correctos; reutilización de las diez compartidas; sin fallbacks ajenos |
| AM-06 | Estabilización y evidencia de plataformas | Progresión completa, guardados preservados, rendimiento y actualización offline verificados |

Cada solicitud debe enumerar los lotes, las decisiones de AM-01 que incorpora y la cartografía aprobada disponible. Esto permite revisar y ejecutar las etapas sin convertir la auditoría en una autorización implícita para cambiar el juego.
