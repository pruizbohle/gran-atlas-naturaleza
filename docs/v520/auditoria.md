# Auditoría de integración · V5.2

## Producción y ramas

| Referencia | Estado al iniciar el trabajo |
| --- | --- |
| `origin/main` · `50cdf3c` | GitHub Pages servía V4.9.6 con 12 legendarios y nueve relictos. Los cambios posteriores al punto común añadían dos páginas de revisión de la iconoteca y una regeneración del manifiesto. |
| `audit/aud-01-v501` · `7cd5110` | Contenía los 30 legendarios, los rediseños aceptados de Ascua y Atlas, y el cambio de nombre de Filigrana a Nácar con el mismo identificador. También contenía las correcciones de guardado, procesamiento offline y retiro de ayudas de prueba. |
| `feat/relictos-5` · `03bf329` | Incluía lo anterior y añadía los veinte relictos, pistas progresivas y descubrimiento en Campo. Los once nuevos ya usaban WebP. Los nueve originales seguían sirviendo SVG. |
| `feat/experiencia-movil-v3410` · `3422b10` | Sus funciones pertinentes de Brújula, destinos y regreso ya pertenecían a la historia integrada. Campamento interceptaba el botón de vuelta en sus instalaciones. |
| Ramas de iconos y coleccionables | Las dos páginas de revisión de iconos ya publicadas se preservan byte a byte. El desarrollo de coleccionables queda fuera de esta integración. |

El commit `4e039d9` integra el árbol revisado de `feat/relictos-5` sobre `origin/main`. Su ascendencia contiene LEG-01, LEG-02 y la estabilización. Los dos conflictos se limitaron a `www/sw.js` y `www/atlas-integrity.json`. Se conservaron el código del actualizador y los recursos de ambos árboles y se recompilaron las huellas SHA-256. [Auditoría de los veinte relictos en V5.1.2](../relictos-v50/README.md) · [Catálogo de los 30 legendarios](../leg02/inventario.json)

## Ayudas de Campo y Corona

En V4.9.6, el código concedía 500 puntos de conocimiento por clic, cincuenta búsquedas confirmadas con una bonificación adicional, y cinco intentos con 60 puntos por sesión guiada. Corona también podía emitir paquetes ficticios de 100 a 5.000 unidades y cambiarlos por libras. La rama auditada ya había retirado esos puntos de entrada. V5.2 integra esa corrección en la candidata y conserva `crownCoins` como saldo histórico consultable.

La ayuda permanente se obtiene por las reglas ordinarias de contratación, capacitación, equipo, investigación, expediciones y Sociedad. Los saldos existentes y el ritmo de progresión se conservan. La Brújula orienta y enlaza pantallas. Consultar una receta, investigación, regreso o recompensa deja su ejecución en el módulo correspondiente.
