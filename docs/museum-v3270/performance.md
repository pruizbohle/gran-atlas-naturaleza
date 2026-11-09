# Rendimiento real · 3.26.0 frente a 3.27.0

Chromium emulado, 390 × 844, ralentización CPU ×4. No es un teléfono Android físico. Mismo navegador, contexto, sesión CDP y partida de prueba con 710 especies publicadas, 12 vitrinas animales y las 26 piezas científicas catalogadas. Cuatro ensayos por versión en secuencia ABBA repetida dos veces; tres reaperturas calientes por sala y ensayo. El informe conserva todas las muestras, sin eliminar valores desfavorables.

La apertura inicial mide el controlador real de la pestaña. “SVG frío” vacía la caché de sprites antes de seleccionar la sala, con la aplicación ya cargada; no significa arranque del navegador. Las mediciones incluyen el controlador síncrono y el layout forzado, no el pintado completo de la pantalla. Solo en el banco de pruebas se pausan los intervalos y se bloquean workers para eliminar actividad ajena; el funcionamiento de ambos se prueba por separado.

| Operación | 3.26.0, ms | 3.27.0, ms | Variación |
| --- | ---: | ---: | ---: |
| Apertura inicial del Museo | 551.85 | 216.70 | -60.7 % |
| Exposiciones · SVG frío | 399.75 | 108.50 | -72.9 % |
| Exposiciones · caliente | 322.10 | 75.50 | -76.6 % |
| Muestras · SVG frío | 2334.10 | 204.85 | -91.2 % |
| Muestras · caliente | 1765.80 | 124.20 | -93.0 % |
| Fósiles · SVG frío | 215.75 | 56.40 | -73.9 % |
| Fósiles · caliente | 93.90 | 40.50 | -56.9 % |
| Relictos · SVG frío | 115.40 | 70.80 | -38.6 % |
| Relictos · caliente | 65.65 | 66.95 | +2.0 % |
| Artefactos · SVG frío | 35.35 | 42.80 | +21.1 % |
| Artefactos · caliente | 45.30 | 26.35 | -41.8 % |

La apertura inicial mejora 60.7 %. Muestras mejora 91.2 % en frío: se construyen 32 tarjetas frente a 710, sin reducir el catálogo elegible. Las 23 páginas siguen siendo alcanzables.

No todas las operaciones mejoran: Artefactos en frío aumenta de 35.35 a 42.80 ms (unos 7,45 ms); Relictos caliente aumenta de 65.65 a 66.95 ms. Se conservan estos resultados. No se altera ninguna mecánica para mejorar una cifra.

| Operación nueva | Mediana, ms |
| --- | ---: |
| Cambiar página de Muestras | 169.95 |
| Filtrar Muestras | 127.45 |
| Abrir ficha | 58.30 |
| Cerrar ficha y restaurar foco | 75.70 |
| Abrir componentes por primera vez | 123.30 |

La memoria retenida tras GC, medida en la misma sala final Exposiciones, pasa de 4.63 a 5.08 MiB (+0.45 MiB). El límite de página, las fichas individuales y los tokens de catálogo acotados evitan construir el catálogo mundial completo en el DOM. No se afirma una reducción de memoria: la nueva presentación conserva más estado temporal y controladores.

El guardado de esta partida mide **75,889 bytes en ambas versiones**. La serialización mediana es 3.415 / 3.105 ms; no cambió su estructura ni se añadieron filtros al guardado. Estas mediciones sintéticas no predicen exactamente el rendimiento de cada móvil.

[Datos crudos, llamadas SVG, tiempos y memoria por ensayo](performance-report.json) · [Reproducción](reproduce.md).
