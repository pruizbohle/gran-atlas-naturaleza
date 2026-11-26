# ART-OBJ-12 · Calidad y pruebas

Base de integración [V5.6.9 Beta en d7cc4cb](https://github.com/pruizbohle/gran-atlas-naturaleza/tree/d7cc4cb30b44656f922c2413a020ea93ee03c989).

## Cobertura de arte

| Lote | Referencias | Nuevas | Composiciones | Recuperadas de OBJ-11 | Históricas conservadas |
| --- | ---: | ---: | ---: | ---: | ---: |
| A · Materiales animales | 27 | 11 | 0 | 8 | 8 |
| B · Artefactos científicos | 20 | 13 | 0 | 7 | 0 |
| C · Componentes | 6 | 6 | 0 | 0 | 0 |
| D · Estudios, demostraciones e instalaciones | 20 | 11 | 9 | 0 | 0 |
| **MEC-06** | **73** | **41** | **9** | **15** | **8** |

Los cuatro tamaños usan el perfil equilibrado de OBJ-11. El juego solicita láminas de inventario a 64 o 128 px y ejemplos de ampliación de 256 o 512 px. El manifiesto de juego y el laboratorio resuelven los mismos archivos. La carga es diferida y usa `srcset` para pantallas de alta densidad.

El cotejo lee resolución, alfa, márgenes, rutas y hash de 1.492 WebP únicos. Suman 29.465.818 bytes. La copia de los recursos recuperados coincide byte por byte con OBJ-11. Las comparaciones conservan los archivos previos de ARM-02, ARM-11 y ARQ-10. Las planchas de [materiales a 64 px](lote-a-64.webp), [artefactos](lote-b-128.webp) y [actividades](lote-d-128.webp) reúnen los archivos reales en claro y oscuro.

Se distinguieron las plumas por perfil, color, barbas y eje. El pelo de guarda, la crin, la lana y la muda conservan texturas propias. La huella de ave en arcilla se distingue del molde histórico de mamífero. El globo celeste, el terrestre y la esfera armilar tienen perfiles y superficies diferentes. La cámara de cajas deslizantes conserva su silueta distinta de la cámara oscura. La referencia de Campamento reutiliza la cámara histórica después de descartar una propuesta de fuelle.

## Fuentes de recuperación

| Fuente | Evidencia |
| --- | --- |
| `docs/mec06/arte.csv` y `www/js/mec06-workshop.js` | 73 claves comprobadas. Los 65 casos de arte nuevo incluían referencias recuperables. |
| `experiment/scientific-illustration-objects`, `952d9c0` | 300 coincidencias de ID y nombre en el catálogo. Se contrastaron el catálogo, el manifiesto, el archivo de sustituciones y las láminas experimentales de OBJ-05. |
| `arte/iconoteca-1842-v1`, `a1d22c7` | 24 candidatos PNG incrustados en la galería de interfaz. |
| `arte/iconoteca-1842-lote2-revision`, `3ce29ec` | Auditoría de 20 iconos funcionales. El manifiesto declara cero láminas nuevas. |
| `feat/v541-objetos-pendientes`, `1d77c7c` | Tres incorporaciones de OBJ-11 en V5.4.1. La beta conserva los 68 iconos funcionales con archivo. |
| `feat/coleccionables-arte-240`, `451e844` | 240 bocetos vectoriales. Se conservaron como comparación los 217 que coinciden en sujeto y en ID. |
| V5.6.9 Beta, `d7cc4cb` | El catálogo, el mapa de iconos, las rutas de presentación y el manifiesto PWA confirman el estado efectivo. |

De los 131 coleccionables nuevos se recuperaron dos. BOT-14 conserva la lámina de la orquídea de vainilla. RAR-07 usa el diente fósil de tiburón bajo su identificación histórica como glosopetra. La comparación de NUM-09 conserva aparte el birr etíope archivado. Los 129 IDs que requieren otra campaña figuran en [el inventario de pendientes](coleccionables-v56-pendientes.csv).

## Validación

La suite de cierre aprobó las 136 pruebas ejecutadas.

- Se comprobaron la ficha y el inventario de materiales, el Museo y sus ampliaciones, el Taller, el Campamento, los estudios y las demostraciones. Las pruebas verifican los modelos de presentación del juego y su correspondencia con el laboratorio.
- La PWA verificó la instalación completa y sirvió offline el laboratorio y muestras de A, B, C, D y del catálogo. La revisión de caché se distingue de otra revisión de V5.6.9.
- Se probó la lectura de partidas anteriores, la restauración, la persistencia y el comportamiento ante un fallo de escritura.
- Se ejecutó la adquisición de las 431 piezas por las rutas de la beta, con registro, inventario y recarga.
- La sesión de Chrome llegó a la autenticación del Site privado. La interacción en un móvil autenticado queda pendiente. La lectura de miniaturas se revisó en las planchas a tamaño real y se aplicó encuadre adaptable al ancho de pantalla.

```bash
node scripts/build-naturalist-release.cjs
python scripts/check-art-obj-12.py todos --reference /tmp/atlas-obj11
node --test --test-isolation=none tests/art-obj-12.test.cjs tests/mec01.test.cjs tests/mec02.test.cjs tests/mec03.test.cjs tests/mec05.test.cjs tests/mec06.test.cjs tests/mec07.test.cjs tests/mec09d-collectibles.test.cjs tests/mec09d-integrity.test.cjs tests/mec09d-persistence.test.cjs tests/mec09d-worker.test.cjs tests/pwa-update-v3212.test.cjs tests/save-roundtrip.test.cjs tests/iconography-v530.test.cjs
```
