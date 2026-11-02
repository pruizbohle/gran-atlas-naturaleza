# El Gran Atlas Beta 3.7 — África, encargos y Museo

## Cambios
- África: Cuerno de África (HX-07-12, prestigio 83), Delta del Okavango (HX-10-09, 86) y Bosques de Gabón (HX-08-10, 89). Requieren el Mapa de África y no consumen prestigio.
- Diez especies nuevas, con rareza, hábitat, horarios, estaciones y variantes, reutilizando identificadores existentes donde corresponde.
- Siete encargos científicos nuevos: 5 descubrimientos africanos, 3 y 7 zonas africanas visitadas, 2 especies de cada región nueva y 3 muestras en el Museo. Solo se entrega el premio una vez.
- Museo: orden de vitrinas y candidatos por precio de muestra descendente, sin alterar precios e ingresos originales.
- Melánicos más oscuros con ojos y contornos reconocibles, sin cambios geométricos.

## Compatibilidad
- Mantiene la clave gran_atlas_v05, el formato el-gran-atlas-save v1 y la recuperación en vivo.
- Campo opcional regionsVisited: registra visitas efectivas. No presume visitas por haber desbloqueado regiones.
- Android Beta 3.7 utiliza com.elgranatlas.naturaleza.beta37. Instalar separadamente de Beta 3.6.1 e importar JSON para preservar progreso.
- Las pruebas incluyen recuperación, regiones, misiones, Museo y contraste melánico.
