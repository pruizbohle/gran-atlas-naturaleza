# El Gran Atlas v3.19.9 — Pulido artístico definitivo

Revisión gráfica de 269 mamíferos, 18 peces y rayas, 12 individuos Legendarios y 9 relictos. Se conserva el catálogo completo de 487 especies, sus 32 configuraciones de dimorfismo, los registros históricos y todas las reglas de juego.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Laboratorio antes/después](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-pulido-v3199.html).

## Inventario y alcance

| Grupo | Registros | Revisión |
| --- | ---: | --- |
| Mamíferos | 269, en 68 familias visuales | Cabezas y perfiles por familia, transiciones de cuello y torso, extremidades volumétricas con articulaciones/apoyos distintos, colas y anatomías especializadas. Se conservan perfiles y patrones por taxón. |
| Peces y rayas | 15 peces óseos, 2 tiburones y 1 manta | Perfiles individualizados, opérculos/branquias, bases y radios de aletas, caudales según taxón, adiposa de salmónidos, escudos de esturión y disco de manta con lóbulos cefálicos. |
| Legendarios | 12 | Dibujos exclusivos con posturas conservadas/refinadas, miembros y cabezas mejor integrados; sin cambios en halos ni emblemas. |
| Relictos | 9 | Nuevas láminas zoológicas específicas para los linajes museísticos, conservando fósiles y artefactos. |

El inventario no se deduce de `kind`: el clasificador de mamíferos usa taxones y el de peces nombres científicos. Las aves, reptiles/anfibios y los objetos ilustrados de v3.19.8 conservan sus motores byte por byte.

## Arquitectura e integración

El motor de peces anterior estaba duplicado: `app.js` ejecutaba una copia inline y el laboratorio cargaba `fish-art-v3191.js`. No eran copias idénticas. El juego ahora carga el módulo externo refinado una sola vez, antes de `app.js`, y lo consulta mediante `globalThis` también en Node. La instantánea de comparación conserva la copia inline realmente activa de v3.19.8.

Los módulos históricos de mamíferos y Legendarios conservan sus interfaces y sus identificadores de archivo; sus referencias de caché se actualizan. El nuevo `relict-art-v3199.js` separa las nueve láminas de relictos. `museumCardArt` consulta ese módulo y mantiene las ilustraciones especializadas de reconstrucciones y artefactos. Los fallbacks históricos internos permanecen para consumidores sin los módulos especializados; no se usan como nuevos dibujos en producción.

El laboratorio carga exactamente los motores actuales y el router de sprites puro generado desde `app.js`, sin inicializar el juego. La comparación anterior está fijada al commit `bacffc91dc39fecfbba850f0d4bcfc10ba36398f`. Ninguno de esos módulos de comparación se carga en el juego principal. Los IDs de `clipPath` se prefijan por panel en el laboratorio para impedir interferencias entre dibujos anteriores y actuales.

Incluye selector de grupo, búsqueda por nombre/taxón/ID, familia, tamaño 56/80/120, macho/hembra, Albino/Melánico, fondos claro/oscuro, siluetas y comparación. La paginación conserva un máximo de 24 registros visibles. Cada tarjeta identifica especie/familia, estado anterior, problema, corrección y resultado inspeccionado, utilizando los registros individuales de las auditorías. Se corrigieron desbordamientos de tarjetas en tabletas, controles sin efecto y el prefijado accidental del atributo de identidad legendaria durante la revisión independiente.

## Evidencia y compatibilidad

- Suite final: **197 pruebas aprobadas**, sin fallos, cancelaciones ni pruebas omitidas. [Informe de navegador](docs/polish-v3199/browser-report.json) · [Inventario de las 308 láminas](docs/polish-v3199/catalog-audit.json) · [Revisión independiente de integración](docs/polish-v3199/integration-review.md).
- [Revisión de peces](docs/polish-v3199/fish.md), con las 18 entradas y su comparación renderizada.
- [Auditoría de los 269 mamíferos](docs/polish-v3199/mammals.md) y [registro por especie](docs/polish-v3199/mammals-audit.json).
- [Auditoría individual de los 12 Legendarios y 9 relictos](docs/polish-v3199/legend-relicts.md), con planchas a 56/120 px y verificación adicional a 80 px.
- No quedan ilustraciones pendientes de inspección. La revisión es cualitativa: no se promete distinguir congéneres cercanos sin sus nombres a 56 px.
- Una prueba de integridad fija el código de `app.js` situado fuera de los renderizadores gráficos: no cambian economía, investigación, probabilidades, mapas, inventario, recetas, progreso ni guardado.
- Se comparan exactamente los datos de especies, sexos, nombres/IDs/asociaciones legendarias y relictos con la instantánea anterior.
- Los hashes históricos de ilustración se conservan para grupos fuera del alcance. Los grupos refinados reciben una nueva referencia aprobada; las pruebas de pigmentación siguen comprobando geometría idéntica entre la ilustración normal y sus versiones Albino/Melánico.
- Chromium comprueba XML, coordenadas y no colisión de IDs del laboratorio, filtros, navegación móvil, guardados anteriores con inventario/equipo/Legendarios/relictos y carga del juego y laboratorio sin conexión.
- Las pruebas de Node incluyen el puente simulado de Capacitor. No se ha ejecutado una APK en un dispositivo Android físico.

Reproducir desde la raíz:

```sh
node scripts/build-dimorphism-lab.cjs --check
node scripts/build-polish-lab-v3199.cjs --check
node scripts/build-polish-review-v3199.cjs --check
node --test tests/*.test.cjs
# Con www servido localmente, Playwright y Chromium disponibles:
ATLAS_TEST_URL=http://127.0.0.1:8775 node scripts/check-polish-browser-v3199.cjs
```

El script de navegador guarda resultados y planchas en `/tmp/atlas-polish-v3199` salvo `ATLAS_ARTIFACT_DIR`. El snapshot anterior incluido se comprueba mediante SHA-256 y no requiere historia Git en CI. Reconstruirlo si falta el archivo requiere el commit de referencia; el juego y el laboratorio usan solo recursos locales.

## Publicación

La versión visible, los scripts, el paquete, el nombre de Capacitor y la caché offline se actualizan a 3.19.9. El flujo `Deploy El Gran Atlas` valida los motores y todas las pruebas antes de desplegar `www`. La publicación debe confirmarse para el commit de esta versión; una prueba local por sí sola no confirma el despliegue.
