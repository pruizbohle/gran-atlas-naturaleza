# Revisión gráfica y correcciones

La comparación se hizo sobre imágenes RGBA rasterizadas por Chromium, no sobre diferencias de texto en los SVG. Se generaron 960 imágenes: 240 piezas × 24, 48, 80 y 120 px. La revisión visual incluyó las 21 láminas por colección y la comparación de las doce piezas marítimas.

| Pieza o grupo | Hallazgo | Corrección |
|---|---|---|
| FIL-02 / FIL-03 | El perfil de Ceres y el de Franklin eran demasiado próximos: coseno de bordes **0,97063**. | Franklin se redibujó de frente, con frente despejada, cabello lateral y gafas; Ceres conserva el perfil. El indicador bajó a **0,87287**. |
| FIL-01 / FIL-12 | Penny Red y Mauritius compartían demasiado retrato y marco: **0,95403**. | Mauritius recibió otro contorno de retrato, diadema, franja lateral y grabado de fondo. Bajó a **0,88285**. |
| MAR-07 | La rosa de los vientos competía con el albatros y la medalla parecía otra brújula. | Albatros en silueta oscura dominante; rosa reducida a un detalle inferior. |
| COR-07 / COR-08 | Las columnas del coral azul se aproximaban a la estructura del coral tubo de órgano. | Coral azul redibujado como crecimiento lobular continuo; el tubo de órgano mantiene tubos separados. |
| AMB-01…AMB-12 | Un arco inferior repetido y los puntos podían sugerir caras. | Se retiró ese arco y se variaron estrías, burbujas y capas. Hoja y fluorescencia conservan identidades explícitas. |
| PIG-06 / MARV-02 | Hoja lateral y rosa del desierto demasiado próximas al límite del lienzo. | Se ajustaron posición y escala; la medición final no detecta dibujos fuera del margen. |
| Matrices rocosas | Marcas decorativas de una base común quedaban fuera de algunas siluetas especiales. | Se retiraron las marcas fijas; cada espécimen conserva su estructura interior. |
| FOS-11 / FOS-07 | La impresión de pluma podía confundirse con otra hoja. | Se hizo más asimétrica la pluma, con raquis prolongado y barbas dirigidas. |
| NUM-04 / MAR-05 | Los orificios usaban una superficie clara en vez de transparencia real. | Se trazaron huecos con regla par-impar, sin máscaras ni IDs SVG. |
| MAR-11 | El cristal parecía un prisma de cuatro lados. | Se añadió una cara superior de seis vértices y facetas laterales diferenciadas. |
| Controles del laboratorio | Algunos selectores invadían su columna; una comparación móvil podía reducir un tamaño. | Anchos mínimos corregidos y desplazamiento interno; los SVG siguen midiendo exactamente 24, 48, 80 y 120 px, también en móvil. |

Resultado final: **cero duplicados raster exactos**. El par más cercano es FIL-01/FIL-09 (**0,93518**), referencias históricas relacionadas al perfil de Victoria. Comparten el esquema de retrato, con marco, cancelación y tratamiento diferenciados; se conserva como reutilización intencional, no se presenta como réplica exacta.

El coseno se calcula con gradientes de luminancia normalizados, reduciendo la influencia del color. Es una señal para revisar semejanzas, no una prueba de autenticidad ni una medida absoluta de reconocimiento. Se conservan [los pares iniciales](similarity-before.json) y [el informe raster final](raster-report.json).
