# Iconoteca V1 — auditoría visual individual (21/11/2026)

## Alcance y método
Revisión de los 24 PNG incorporados en `www/iconoteca/index.html` (256 × 256 píxeles, PNG RGBA) contra sus nombres, descripciones y usos previstos. Esta revisión es **artística y semántica**; no es un test automatizado de interfaz ni una aprobación para integrar al juego. La colección continúa separada del runtime. 

## Hallazgos generales
- **Correspondencia semántica:** las 24 imágenes ilustradas son reconocibles de acuerdo con sus rótulos (a diferencia del lote SVG alternativo ya retirado).
- **Estilo:** grabado naturalista histórico, papel marfil, tinta sepia, metales envejecidos; visualmente consistente.
- **Recorte:** existen residuos de otras ilustraciones en los bordes de varias piezas; antes de producir derivados hay que limpiarlos sin cambiar el diseño.
- **Escala:** los originales se muestran a 138 px; falta validación real y comparativa a 60, 32 y 24 px. No asumir que un grabado detallado sigue siendo legible.
- **Fondos:** los PNG son RGBA, pero el marfil se aprecia en la previsualización; comprobar específicamente alfa/transparencia efectiva y contraste sobre fondos oscuros, no deducir transparencia de RGBA.
- **Navegación y economía:** los iconos Museo y Sociedad son distintos; no introducir «Corona» como divisa persistente de prueba sin definir su destino real.

## Revisión imagen por imagen
| N.º | Identificador | Referencia visual verificada | Dictamen | Acción |
|---|---|---|---|---|
| 01 | atlas | Mapa antiguo plegado y rosa de los vientos | Conforme provisional | Control de lectura a 32 px |
| 02 | campo | Lupa sobre hojas | Ajuste obligatorio | Retirar pequeño recorte intruso en borde izquierdo |
| 03 | cuaderno | Libro abierto con ave y flor | Conforme provisional | Test a 32 px |
| 04 | investigacion | Microscopio de latón | Conforme provisional | Test a 32 px |
| 05 | sociedad | Sello de cera con edificio académico | Conforme provisional | Diferenciarlo en navegación frente a Museo |
| 06 | bestiario | Búho grabado | Conforme provisional | Test a 32 px |
| 07 | campamento | Tienda y farol | Conforme provisional | Test a 32 px |
| 08 | inventario | Morral de cuero y manta | Ajuste obligatorio | Limpiar fragmento en esquina superior derecha y borde izquierdo |
| 09 | museo | Vitrina arquitectónica con amonite | Ajuste obligatorio | Limpiar fragmento en parte superior |
| 10 | corona | Corona ornamental | Ajuste y decisión funcional | Limpiar fragmentos superiores; confirmar si pertenece a interfaz de producción |
| 11 | conocimiento | Pergamino científico | Ajuste obligatorio | Limpiar fragmento en parte superior y revisar legibilidad |
| 12 | libras | Moneda antigua con retrato | Ajuste obligatorio | Limpiar restos en margen superior; validar lectura a 24 px |
| 13 | prestigio | Insignia con globo y laurel | Conforme con reservas | Verificar si la textura se pierde a 24 px |
| 14 | naturalistas | Grupo de tres exploradores históricos | Conforme con reservas | Mucho detalle facial para 24–32 px; crear derivado simplificado fiel al original |
| 15 | tomos | Tres libros encuadernados | Ajuste obligatorio | Limpiar pequeño fragmento en margen izquierdo |
| 16 | huellas | Huella de mamífero y pisada de ave | Conforme con reservas | Comprobar lectura conjunta a 24–32 px |
| 17 | exploracion | Catalejo extensible | Ajuste obligatorio | Limpiar resto azulado en margen derecho |
| 18 | expediciones | Velero con velas desplegadas | Conforme provisional | Test a 32 px |
| 19 | fosiles | Cráneo fósil sobre matriz rocosa | Conforme provisional | Test a 32 px |
| 20 | excavacion | Pico de campo | Ajuste obligatorio | Limpiar fragmento fósil que asoma por borde izquierdo |
| 21 | coleccionables | Vitrina con mariposa, coral y mineral | Conforme con reservas | Distinguir función respecto de Museo |
| 22 | taller | Martillo y cincel | Conforme provisional | Test a 32 px |
| 23 | misiones | Sobre con sello de lacre | Conforme provisional | Test a 32 px |
| 24 | brujula | Brújula de latón | Conforme provisional | Test a 32 px |

### Resumen de prioridad
- **8 ilustraciones con residuos evidentes de recorte**: Campo, Inventario, Museo, Corona, Conocimiento, Libras, Tomos, Exploración, Excavación (son **9**, revisadas individualmente).
- **1 decisión de producto pendiente**: Corona; no volver a introducir moneda de prueba.
- **Piezas detalladas a comprobar primero en pequeño**: Naturalistas, Prestigio, Huellas, Conocimiento.
- **24/24 imágenes reconocibles por significado**, pendiente la aprobación final del diseño.

## Criterios para pasar a integración
1. Limpiar los bordes de las 9 piezas observadas usando **la misma ilustración**; no regenerar un estilo SVG alternativo.
2. Comprobar 24/32/48/60/138 px y visualización con fondo marfil y oscuro.
3. Resolver semántica de Corona y diferenciar Museo/Coleccionables/Sociedad.
4. Mantener un identificador único por pieza y su correspondencia 1:1 con nombre y uso; no reemplazar recursos del juego hasta aprobarlos.
5. Si se optimizan formatos, preservar proporción, transparencia prevista y reconocimiento; registrar diferencias.
6. Integrar posteriormente mediante PR específico, con pruebas de escritorio/móvil y preservación de partidas.

## Estado de publicación
El visor independiente en `www/iconoteca/index.html` ya existe en `main`. El bloqueo del despliegue provenía de un manifiesto del Service Worker desactualizado; se regeneró con el propio script del proyecto y las pruebas automatizadas pasaron. El estado real de publicación web debe verificarse aparte, después de una ejecución correcta de GitHub Pages.
