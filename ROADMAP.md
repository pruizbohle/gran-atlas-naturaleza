# El Gran Atlas — cronograma vivo (1 de noviembre de 2026)

| Etapa | Alcance | Estado |
| --- | --- | --- |
| Android Alpha / móvil | Navegación vertical, offline y persistencia local | Completado |
| Beta 3.0–3.5 | Respaldo JSON, restauración sincronizada, Europa + Asia + África parcial | Implementado; seguir validando con respaldos reales |
| Beta 3.6 | Fondos IV x1000, 5.000 coronas, ayudas Campo +50/+500, tres encargos científicos | Implementado en código; sujeto a pruebas Android |
| Próxima iteración | Más encargos científicos regionales y progresión | Propuesto |
| Próxima fase | Expediciones dirigidas, colecciones científicas y Museo | Propuesto |
| Expansión | África restante, Norteamérica, Sudamérica y Oceanía; completar objetivo de 900 especies | Propuesto |
| Experiencia naturalista | Rastros, estaciones, clima, migraciones y sprites | Propuesto |
| Estabilización | Firma Android estable, actualización sin reinstalar, migraciones y pruebas prolongadas | Prioritario antes de distribución |

## Compatibilidad
- No modificar gran_atlas_v05 ni el-gran-atlas-save formato 1 sin migración.
- Las coronas son ficticias y exclusivas del laboratorio de pruebas.
- Los guardados deben persistir tras reiniciar la app; se preserva la prueba de motor y tick.
- Android Beta 3.6 se instala de forma independiente de Beta 3.5; transferir por JSON.
- El prestigio es acumulado y no se consume al viajar.


## Beta 3.7 — Misiones, África y Museo
- África: tres zonas nuevas (Cuerno 83, Okavango 86 y Gabón 89 de prestigio), diez especies nuevas. 13 zonas africanas y 355 especies globales.
- Sociedad: siete nuevas misiones, incluyendo visitas reales a regiones africanas y colecciones del Museo. Premios únicos.
- Museo: galería y candidatas ordenadas según mayor precio de muestra, sin modificar valores de renta/coste.
- Melánicos: paleta negra carbón global y contornos legibles, sin modificar siluetas ni rarezas.
- Se conserva gran_atlas_v05, formato JSON versión 1. Beta 3.7 usa ID Android independiente para proteger la instalación Beta 3.6.1.
- Próximos avances: Expediciones dirigidas, Fósiles/Relictos y expansión continental.


## Beta 3.8 — África en etapas y expediciones dirigidas
- Dos regiones: Tierras altas de Etiopía (prestigio 92) y Desierto del Namib (95); África llega a 15 regiones.
- Diez especies nuevas; catálogo mundial pasa de 355 a 365.
- Dos reconocimientos dirigidos dentro de Expediciones: con Astillero, Cartografía naval II, Mapa de África y prestigio suficiente. Muestra garantizada, sin visitas ni avistamientos inventados.
- Se conserva formato el-gran-atlas-save v1 y clave gran_atlas_v05; Beta 3.8 se instala de forma independiente en Android.
- Próximos avances: expansión africana gradual y prototipo controlado de fósiles/relictos, sin romper la colección.


## Beta 3.9 — África gradual y eliminación de círculos
- Tres áreas: Montañas del Atlas (98), Bosques de miombo (101) y Costa de Mozambique (104), sujetas al mapa de África.
- 12 especies nuevas: África alcanza 18 regiones, el catálogo mundial 377 animales.
- Se elimina el círculo como sprite de último recurso. Familias sin retrato particular pasan a siluetas genéricas anatómicas. Ocho nuevos animales reciben retratos diferenciados.
- La actualización no toca la economía, guardado gran_atlas_v05, JSON v1 ni progreso acumulado.
- Siguiente versión: completar regiones africanas restantes, refinar sprites basados en familias y primer prototipo de colecciones de fósiles/relictos.


## Beta 3.10 — África y primer gabinete de colecciones
- Dos regiones: Lagos del Rift (prestigio 107) e Islas Seychelles y Aldabra (110); África pasa a 20 regiones.
- Ocho animales adicionales, catálogo mundial de 385 especies. Cinco nuevos retratos SVG propios.
- Museo: Fósiles y Relictos ya permiten catalogar cuatro piezas utilizando materiales de expediciones y conocimiento; premio único por pieza, sin ingresos pasivos.
- Compatible con `gran_atlas_v05`, exportación JSON formato 1 y demás avances; appId Android independiente `com.elgranatlas.naturaleza.beta310`.
- Siguiente: continuar África de manera gradual, mejorar la presentación de colecciones y revisar equilibrio de expediciones.

## Beta 3.10.1 — Ecología de Rift y Seychelles
- Corrección de normalización de hábitats y horarios de las 17 especies de las dos regiones nuevas. Se mantienen intactas las fichas originales ya definidas para esas especies.
- Evita que león y guepardo queden inaccesibles y restaura la distribución correcta del flamenco, pelícano y rapaces, incluso en invierno.
- Sin cambios de rareza, economía, guardado, inventario ni nuevas mecánicas. APK Android independiente, traslado de JSON.


## Beta 3.11 — Cinco salas del Museo
- Cinco pestañas: Exposiciones (vitrinas visuales de todos los tipos), Muestras (especies con monografía 5/5 ordenadas por ingreso/segundo), Fósiles (taller), Relictos (hallazgos excepcionales sin Atlas) y Artefactos (colecciones históricas).
- Los antiguos IDs carta_historica y medallon_viajero se presentan en Artefactos, conservando su registro y sin exigir recompra.
- Materiales: diente fósil y cráneo fósil encontrados por expediciones, misiones y avistamientos; huesos cortos y largos y cráneo carnívoro en el taller.
- Reconstrucción de T. rex: 10 huesos largos + 25 huesos cortos + 1 cráneo carnívoro. Requiere en total 90 fragmentos fósiles, un cráneo fósil y 10 dientes fósiles. Montaje único y exhibible, no figura en Atlas.
- Cuatro relictos regionales de hallazgo muy raro: celacanto, león del Atlas, murciélago de Seychelles y cocodrilo enano de Gabón. No suman avistamientos ni especies a la colección principal.
- Dos encargos científicos de prospección con materiales, una sola vez; botines nuevos en viajes/avistamientos conservan recompensas existentes.
- Continúa sin alterar gran_atlas_v05, JSON v1, cap. de 12 exposiciones animales, ganancias previas y sprites originales. Android Beta 3.11 tiene appId independiente.
- Próximo: ampliar fósiles (especies paleontológicas), mejorar dibujos de relictos y progreso de África.
