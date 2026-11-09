# Ensayos del juego candidato en Chromium

Este directorio contiene una sesión aislada del juego real, con inserciones de candidato de `tests/helpers/oceania-review.cjs`. La entrada pública, sus archivos anteriores, guardados y service worker no se modificaron. No son pruebas físicas de Android ni un despliegue 3.29.0.

## Navegación y mecánicas

`check-oceania-game-review-v3290.cjs` sirve un origen local privado, carga la interfaz vigente y compra **Cartografía de Oceanía desde el proyecto del Instituto 3.28**. Comprueba que la investigación no abra automáticamente regiones; luego selecciona, desbloquea sin gastar prestigio y visita cada una de las ocho regiones en 320×640, 360×740, 390×844 y 412×915: **32 recorridos** de Atlas → Campo → Cuaderno. El mapa completo, la acción y el último animal quedan dentro del área útil; no hay desbordamiento horizontal ni errores de página. Capturas `atlas-*.png` y `field-*.png`.

El ensayo completo también registra rendimiento. `--benchmark-only` conserva los 32 resultados funcionales previos y repite solo las mediciones; se utilizó al separar correctamente generación SVG en frío y consulta repetida de caché. El primer selector del ensayo se ajustó al flujo real de proyectos del Instituto 3.28: no se cambió la interfaz para que el botón apareciera.

## Rendimiento antes/después

Mismo Chromium, 390×844 y CPU ×4; tres contextos nuevos por catálogo. Todas las identidades están descubiertas con etapa 5 para el caso exigente; el DOM renderiza **32 tarjetas**, nunca 807 simultáneamente. Valores reales en `results.json`:

| Medida (mediana) | Base: 710 | Candidato: 807 |
| --- | ---: | ---: |
| Primera apertura Bestiario | 134,4 ms | 144,4 ms |
| Reapertura/render caliente | 30,1 ms | 34,1 ms |
| Generación SVG en frío, muestra | 0,1 ms | 0,1 ms |
| Consulta repetida de caché | bajo resolución del temporizador | bajo resolución del temporizador |
| Serialización de partida | 1,9 ms | 2,3 ms |
| Tamaño de la partida de prueba | 56.022 bytes | 65.788 bytes |

La apertura aumenta aproximadamente **7,4 %** y la reapertura **13,3 %**; no se presenta como una mejora. Los catálogos y las primeras tarjetas cambian, por lo que mide el impacto del escenario ampliado, no el mismo conjunto de animales. Hay tres muestras de apertura fría y 21 por medida caliente/serialización/SVG. Las muestras SVG usan siete identidades base y siete nuevas, respectivamente; no equivalen a perfilar los 97 dibujos. Los tiempos cercanos a cero tienen poca precisión. El heap final observado se conserva como dato aproximado, sujeto al recolector, no como pico de memoria ni garantía Android. No se midió batería ni dispositivo físico.

## Offline

`check-oceania-offline-review-v3290.cjs` usa otro origen privado, permite el worker de producción y sirve allí el candidato con sus módulos nuevos integrados en la respuesta JS. Instala caché, corta red, recarga y conserva Nueva Zelanda, su desbloqueo, investigación y 42 avistamientos previos; también ejecuta un encuentro sin conexión. Véanse `offline.json` y `offline-candidate.png`.

Este ensayo demuestra el comportamiento offline del candidato autocontenido con el worker existente. **No valida el empaquetado final de módulos separados, caché ni actualizador 3.29**, todavía no preparados porque falta el cierre científico y de publicación. El ensayo funcional/rendimiento bloquea service workers para no mezclar las dos revisiones en una caché de comparación.

```sh
node scripts/check-oceania-game-review-v3290.cjs
node scripts/check-oceania-game-review-v3290.cjs --benchmark-only
node scripts/check-oceania-offline-review-v3290.cjs
```
