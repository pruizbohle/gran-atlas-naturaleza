# El Gran Atlas — Beta 3.6.1

Iteración visual: 59 sprites pasan por el generador pulido compartido. Se conserva el SVG 100×100, la caché y las interfaces existentes de Campo, Cuaderno y listas.

## Revisión

- África: cocodrilos del Nilo y de hocico estrecho; elefantes de sabana y bosque; rinoceronte blanco; hipopótamo; jirafa, okapi y cebra de llanura.
- Félidos africanos: león con melena, leopardo con rosetas, guepardo con manchas y marca facial, serval con orejas grandes, caracal con pinceles; civeta y fosa diferenciadas.
- Cánidos: base compartida, fénec, licaón, chacales y zorros; hiena con perfil propio. Incluye cánidos europeos frecuentes.
- Bóvidos y antílopes africanos: búfalo, ñu, órix, bongo, duíquer, eland, arruí, gacela y springbok.
- Aves: pigargo vocinglero, águila de Madagascar, secretaria, avestruz, ibis, garza goliat, grulla coronada, loro gris, turaco y abejaruco.
- Tortugas laúd y radiada; suricata y tenrec. Bases compartidas de elefantes, rinocerontes y cocodrilos también mejoran especies asiáticas.
- Variantes: plumaje fijo también se aclara en Albino/Leucístico; contornos melánicos más visibles; marcas Notable delineadas. Se mantiene la anatomía entre variantes.
- Dimorfismo existente: astas palmeadas del alce, cuernas cortas del corzo, orejas y proporciones por sexo. No se agregan sexos nuevos ni requisitos de colección.

## Compatibilidad

Sin cambios en IDs de especies, regiones, economía, prestigio, investigaciones, observación manual/automática, cronograma o gestión de partidas. Se conserva `gran_atlas_v05`, el formato JSON y el package ID Android `com.elgranatlas.naturaleza.beta36`. No se agregan dependencias. Se actualiza la caché web para entregar los nuevos recursos.

## Verificación

- `node --check www/js/app.js`
- `node --test tests/*.test.cjs`: guardado real con tick, recuperación/importación/exportación, África y sprites.
- Sprites: todas las 345 especies, cuatro skins y los sexos configurados; diferenciación geométrica entre especies similares y consistencia anatómica de variantes pulidas.
- `node scripts/preview-sprites.cjs /tmp/atlas-sprites.html`: lámina de revisión a 32, 52 y 80 px, con variantes y dimorfismo. Opcionalmente admite como segundo argumento un `app.js` anterior para comparar.

La revisión visual en Chromium no pudo completarse en el entorno local por restricciones del navegador. Las pruebas de SVG son estructurales; no sustituyen la revisión humana en móvil. La APK debug se genera en GitHub Actions desde `fase4/sprites-v3.6.1`; una compilación exitosa no implica validación en dispositivo físico.
