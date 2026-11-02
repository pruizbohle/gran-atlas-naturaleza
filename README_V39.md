# El Gran Atlas — Beta 3.9

## Expansión africana
- Montañas del Atlas (HX-06-08, prestigio 98): macaco y ciervo de Berbería, gato montés africano y zorro de Rüppell, con fauna norteafricana compartida.
- Bosques de miombo (HX-09-09, prestigio 101): antílope sable, cálao terrestre sureño, pangolín terrestre e inseparable de Lilian, más fauna compartida.
- Costa de Mozambique (HX-10-12, prestigio 104): dugongo, manta gigante, delfín jorobado del Índico y martín pescador malaquita, con fauna fluvial y costera compartida.
- Tres regiones nuevas (18 de África), doce especies nuevas (377 mundiales), sin alterar los IDs previos.

## Corrección de sprites circulares
- Se elimina el fallback `circle cx=50 cy=50 r=24` y se reemplaza por familias anatómicas (primates, serpientes, lagartos, pangolines, camélidos, rinocerontes, cocodrilos y fauna marina).
- Ocho especies nuevas reciben retratos SVG propios. Normal, leucístico, melánico y notable siguen usando el mismo sistema de color y guardado.
- Pruebas de SVG sobre todas las especies y variantes, para evitar regresiones.

## Compatibilidad
- Sin cambios en clave local `gran_atlas_v05` ni formato JSON `el-gran-atlas-save` versión 1.
- Instalación Android independiente `com.elgranatlas.naturaleza.beta39`: exportar JSON en Beta 3.8 e importar en Beta 3.9; no desinstalar la anterior sin copia.
- Verificación mediante GitHub Actions y pruebas de restauración/tick/África/sprites.
