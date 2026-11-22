# Retirada de ayudas de desarrollo y coronas de prueba

Cambio preparado para una actualización posterior de consolidación. Las partidas integrales de esta auditoría solo usan las acciones de progresión ordinaria y el saldo inicial de la versión pública.

| Superficie | Identificadores que hay que retirar o aislar |
|---|---|
| Campo | Botones `field-aid` de `fieldViewModel`, delegación en `handlePanelAction` y función `fieldAid`. Las tres rutas conceden conocimiento o búsquedas de prueba. |
| Corona | Dos entradas `data-tab="crown"` de `www/index.html`, renderizador `renderCrown`, acciones `buy-crown` y `exchange-crown`, funciones `buyCrownPack` y `exchangeTrialCrowns`. Revisar rutas de navegación y estilos asociados después de retirar las entradas. |
| Guardado y textos | `crownCoins` en guardados históricos, mensaje de bienvenida que invita a simular libras y pruebas en `tests/live-save.test.cjs` que llaman las funciones antiguas. |
| Laboratorios | Fixtures que validan el comportamiento histórico. Mantenerlos sobre copias aisladas de partidas, con su adaptador histórico donde corresponda. |

## Secuencia propuesta

1. Retirar los puntos de entrada del producto y bloquear sus mutaciones en el motor dentro del mismo cambio. Mantener una ruta de comprobación exclusivamente de desarrollo para los casos históricos que la necesiten.
2. Conservar los saldos e inventarios históricos cargados según el formato vigente. El motor carece de un registro que permita reconstruir con fiabilidad qué libras proceden de conversiones antiguas. El tratamiento de las coronas aún sin convertir queda como decisión de migración.
3. Preservar el saldo inicial de £420 en esta etapa de auditoría. La cuantía inicial forma parte de la revisión posterior de balance. Sustituir entonces el texto de prueba según la decisión de producto.
4. Verificar que las acciones retiradas queden inaccesibles desde todos los módulos en escritorio y móvil. Confirmar que ejecutar sus antiguos identificadores deja intactos el saldo, el conocimiento, los avistamientos y el guardado. Importar partidas con y sin coronas de prueba y repetir la progresión ordinaria sin ayudas.
5. Validar la actualización PWA, el funcionamiento offline y los laboratorios antes de autorizar una publicación. La infraestructura de firma Android queda separada de esta actualización.
