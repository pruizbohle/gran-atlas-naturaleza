# El Gran Atlas — Beta 3.15.1 · Corrección de búsquedas automáticas y diario

## Problema observado
En Desierto del Sáhara, la exploración automática mostraba repetidamente «0 avistamientos · +0 conocimiento». El equipo automático aplicaba exclusivamente los filtros de hábitat y horario de la búsqueda manual: en una región con pocas especies compatibles, estas alcanzaban rápidamente sus límites horarios. Al agotar las especies elegibles, los siguientes intentos no producían registros ni conocimiento, y el diario parecía no actualizarse.

## Corrección
- **Exploración automática regional:** el equipo busca especies válidas de **todos los hábitats y horarios propios de la región**, conservando la estación elegida. Los filtros manuales no se modifican.
- **Cupos conservados:** cada especie mantiene el máximo de **100 avistamientos automáticos por hora**. Los encuentros múltiples y censos respetan el mismo cupo.
- **Pausa al agotar el cupo:** se detienen los intentos ficticios cuando todas las especies de la región han llegado a su límite horario, en vez de registrar indefinidamente búsquedas «0/0». La indicación muestra que el equipo está en pausa y que se reactiva en la siguiente hora.
- **Diario actualizado:** el registro se refresca en cuanto cambia el contenido, sin la espera artificial de 800 ms. El mensaje de saturación se registra **solo una vez por hora**.
- **Observación manual intacta:** sigue usando el hábitat, horario y estación seleccionados por el jugador, sin compartir el cupo automático.
- **Guardados intactos:** misma clave `gran_atlas_v05`, mismos IDs de especies y regiones, sin restablecer ni modificar contadores anteriores.
- **Android:** se conserva la identidad `com.elgranatlas.naturaleza.beta314`; se mantiene el respaldo/exportación previo como medida prudente.

## Pruebas
`tests/research-v315.test.cjs` comprueba en particular el escenario del Sáhara con los cupos manuales saturados, el acceso a especies adicionales con la búsqueda automática, la compatibilidad de filtros y el límite máximo de 100 avistamientos por especie y hora.

## Alcance de la corrección
No se cambia la probabilidad base de encuentro, el balance de rarezas, los precios de investigación ni la cantidad de fauna. En una región totalmente saturada, los avistamientos automáticos siguen en pausa hasta el siguiente periodo horario: ese comportamiento **es intencional**.
