# El Gran Atlas V4.9.3 · Peces de arrecife y cierre del catálogo mundial

GM-07-P04 completa **1.000 fichas activas**, con **950 ilustradas**, **1.622 láminas científicas** y los **12 ejemplares legendarios**. Las 14 láminas nuevas corresponden a **12 peces de arrecife** y a dos mamíferos incorporados al catálogo. [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio](https://pruizbohle.github.io/gran-atlas-naturaleza/naturalist-art/) · [Actualizador PWA](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-atlas.html)

## Catálogo

| Alta | Clasificación | Encuentros en Campo | Escala |
| --- | --- | --- | ---: |
| Murciélago abejorro · *Craseonycteris thonglongyai* | Chiroptera · Craseonycteridae | Sudeste Asiático, bosque al amanecer o al atardecer | 0,35 |
| Pichiciego menor · *Chlamyphorus truncatus* | Cingulata · Chlamyphoridae | Pampas, pradera seca al atardecer o de noche | 0,40 |

Las dos fichas se agregaron como **Muy rara** con categoría Notable. El murciélago se representa en las áreas boscosas donde se alimenta cerca de las cuevas calcáreas. La ficha del pichiciego usa la pradera como representación del terreno abierto y arenoso en la franja semiárida de Argentina. Las altas reutilizan las zonas existentes y el recorrido de investigación, publicación y exhibición. [Actividad del murciélago](https://thesiamsociety.org/wp-content/uploads/2020/04/NHBSS_038_2g_Duangkhae_EcologyAndBehav.pdf) · [Ficha del pichiciego](https://sib.gob.ar/index.php/especies/chlamyphorus-truncatus)

La auditoría verificó 1.000 identificadores y 1.000 nombres científicos completos únicos, todos con presencia en alguna de las 125 regiones. El catálogo histórico distingue subespecies en cinco grupos de mamíferos. Se revisaron las discrepancias entre fuentes para conservar esas identidades y los guardados que las usan. Los cuatro candidatos a futuros récords quedaron documentados. [Auditoría taxonómica](auditoria-taxonomica.json) · [Gigantes en miniatura](gigantes-en-miniatura.md)

## Ilustración y recursos

El laboratorio ofrece tres comparativas de arrecife a 64 y 128 px. Los perfiles comprimidos se distinguen por el hocico, las bandas y el pedúnculo caudal. El mero se separa del pez loro y el napoleón por su boca y su perfil cefálico. El pez volador conserva las pectorales largas y la cola asimétrica, el caballito su cola prensil, y el pez león y el pez piedra presentan espinas y radios con contornos diferenciados. El murciélago conserva el hocico porcino y las orejas prominentes. El pichiciego muestra las uñas excavadoras, el vientre de pelaje claro y la coraza rosada. [Inventario de arrecife](../cientifica-v492/plan-v493.md) · [Descripción del pez volador](https://biogeodb.stri.si.edu/sftep/en/thefishes/species/895) · [Ficha del pez león](https://ciesm.org/atlas/fishes_2nd_edition/Pterois_miles.pdf)

Las 14 láminas se revisaron sobre fondos claros y oscuros. Se exportaron a WebP de 64, 128, 256 y 512 px con calidades 82, 83, 86 y 90 y alfa a calidad 100. Se conservaron byte a byte los 6.432 WebP anteriores, los 16 paisajes y las referencias del laboratorio. El halo se aplica desde el juego. [Pesos exactos](mediciones.json) · [Legendarios](legendarios.json)

| Resolución | V4.9.2 en MB | Nuevas láminas en MB | V4.9.3 en MB |
| --- | ---: | ---: | ---: |
| 64 px | 3,26 | 0,03 | 3,29 |
| 128 px | 7,80 | 0,06 | 7,86 |
| 256 px | 22,06 | 0,18 | 22,24 |
| 512 px | 67,68 | 0,60 | 68,28 |
| **Total** | **100,80** | **0,87** | **101,67** |

El caché básico pasa de **125,36 MB** a **126,27 MB** y reúne 6.730 recursos. Las referencias opcionales ocupan 11,70 MB. También se midieron las aperturas de Campo en la escena de arrecife antes y después de sustituir el SVG del pez payaso. [Medición de Campo](rendimiento.md)

## Validación

Pasaron las **26 pruebas de publicación** y las **62 del verificador Android**. La suite histórica ejecutó **819 pruebas**, con **592 aprobadas** y los mismos **227 fallos** que V4.9.2. [Comparación de fallos](regresion.json)

Se verificaron las migraciones PWA de V4.3.0, V4.8.1, V4.8.2 y V4.9.2, incluido el enlace histórico de V4.3.0. La prueba desde V4.9.2 comprobó el aviso después de recuperar el foco, la descarga autorizada, el rechazo de un WebP con SHA-256 incorrecto, la recuperación de una transferencia cortada y el respaldo exacto de la partida. [Migraciones PWA](migraciones-pwa.json)

Una PWA de V4.9.2 instalada en Chromium se actualizó en su propia ventana y volvió a abrir sin conexión. Ambos mamíferos se registraron mediante búsquedas manuales y automáticas y se comprobaron en Campo, Cuaderno, Bestiario y Museo. Sus láminas de Campo midieron aproximadamente 46 y 53 px de ancho, respectivamente, en la ventana instalada. En el laboratorio se comprobaron las comparativas de arrecife a 64 y 128 px y se verificaron los 21 modos a 320 y 1280 px. [Pruebas de módulos](pwa-modulos.json) · [Aletas y espinas](arrecife-fin-shapes-1280.jpg) · [Perfiles y color](arrecife-compressed-profiles-1280.jpg) · [Lábridos y mero](arrecife-wrasses-and-grouper-1280.jpg) · [Murciélago en Campo](asia_esp_craseonycteris_thonglongyai-campo.jpg) · [Pichiciego en Campo](sa_esp_chlamyphorus_truncatus-campo.jpg)

Android se sincronizó con **versionCode 40903** y los 7.380 archivos web empaquetados coincidieron con el candidato. La restauración de una partida en un dispositivo Android físico es la validación pendiente para la distribución estable. [Flujo de firma](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml)

## Continuidad

V4.9.5 tiene inventariados 14 peces de aguas profundas. El cierre artístico posterior reunirá 16 peces costeros, pelágicos y de plataforma y 20 cefalópodos. [Plan V4.9.5](plan-v495.md)
