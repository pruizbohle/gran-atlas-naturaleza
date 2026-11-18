# Serie 4 · Capas naturalistas

Candidata sobre El Gran Atlas 4.2.0, commit `5aa6eb0` de la web estable. La rama `feat/serie4-capas-naturalistas` contiene el nuevo tratamiento y el primer lote progresivo de recortes.

| Módulo | Presentación |
| --- | --- |
| Campo | Paisaje de lavado tenue según hábitat y región activa. La iluminación de noche y atardecer se aplica al paisaje. |
| Bestiario | Paisaje genérico por hábitat, suavizado hacia los bordes y cargado de forma diferida. |
| Cuaderno | Base de papel neutra, concentrada alrededor de la lámina en la ficha. |
| Museo | Fondo discreto de vitrina con un foco suave. |

Los animales usan el mismo archivo canónico y los mismos derivados por resolución en todos los módulos. Para la ilustración alfa, los efectos CSS siguen la silueta. Normal tiene filtro neutro. Notable, Épico y Excepcional usan bronce, plata y oro. Legendario combina un contorno cálido con un halo verde. Las láminas opacas pendientes de recorte se muestran sin el marco clásico y señalan las categorías mediante un acento separado. El laboratorio compara las tres presentaciones y abre por defecto sin marco.

## Paisajes y recortes

La biblioteca incluye 16 WebP reutilizables y asigna todos los hábitats del catálogo vigente. Campo resuelve bosque templado, taiga y selva según la región. También reutiliza escenas para costas, arrecifes, plataforma, aguas abiertas, estratos profundos y polos. Los paisajes ocupan 417.488 bytes en total. [Vista de los 16 paisajes](paisajes.jpg)

Se recortaron 16 de 245 láminas, pertenecientes a siete especies, incluidas variantes del zorro rojo, nutria europea y panda rojo e ilustraciones de Ascua, Fenrir y Ámbar. Las 229 restantes siguen disponibles como láminas opacas. Se realizaron comparaciones con recortes de referencia, segmentación sobre el original y revisión de las máscaras. En el petauro se retiró también la rama que el segmentador había tomado por parte de la silueta. Puede quedar un borde tenue bajo las garras o junto al pelaje fino en fondos de mucho contraste.

Para las 16 láminas se comprobó que todos los píxeles RGB visibles del original de 512 px siguen siendo idénticos. Los canónicos se codificaron WebP sin pérdida con máscara alfa. Los derivados de 64, 128 y 256 px usan la misma máscara de origen y compresión optimizada. El lote de cuatro resoluciones pasó de 1.350.876 a 2.308.166 bytes (+70,9 %), principalmente por los canónicos sin pérdida. El peso completo de las láminas pasa de 21,52 a 22,48 MB, más 0,42 MB de paisajes. [Mediciones por lámina](mediciones.json)

## Continuidad y pruebas

Las ilustraciones futuras deben conservar el alfa en la lámina canónica. Para aplicar una máscara gris de 512 px revisada a una imagen existente, ejecuta:

```sh
python scripts/prepare-naturalist-cutout.py www/naturalist-art/plates/id--normal.webp mascara.png
python scripts/build-naturalist-derivatives.py
node scripts/build-naturalist-lab.cjs
node scripts/build-naturalist-release.cjs --write
npm run release:verify
```

El generador detecta alfa en WebP y lo incorpora al inventario. Los paisajes se cachean junto con las láminas y se comparten por clave de hábitat. No hay dependencia de segmentadores en el navegador ni en Android.

Pasaron ocho pruebas de la versión y los once modos del laboratorio a 320 y 1280 px. La prueba PWA compara con la 4.2.0 estable y verifica respaldo exacto, sustitución del caché, funcionamiento offline de animales y paisajes, cambio de hábitat y reutilización del nodo de imagen en avistamientos consecutivos. El WebP de Campo de 128 px sigue ocupando 64 KiB de píxeles decodificados antes de la sobrecarga del navegador. El heap observado es una muestra de Chromium y no mide la memoria total del dispositivo. La batería histórica dio 90 aprobadas de 111 con los mismos 21 fallos previos. [Prueba PWA](prueba-pwa.json) · [Pruebas históricas](pruebas-historicas.json)
