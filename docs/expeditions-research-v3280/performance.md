# Rendimiento comparativo real

Chromium emulado, 390 × 844 y CPU ×4, catálogo real de 710 especies. Misma sesión de navegador, contexto, página y CDP; partida equivalente con astillero, dos viajes —uno con inicio registrado y otro histórico—, mapas y acceso a las ocho rutas. Secuencia ABBA repetida dos veces: cuatro ensayos por versión y tres reaperturas calientes por módulo y ensayo. Se conservan todas las muestras.

Los workers y callbacks periódicos se pausan solo para la medición. Se ejecutan los controladores reales con layout forzado; no se mide el pintado completo ni el tiempo de arranque del navegador. Los ensayos responsive y offline se ejecutan por separado.

| Operación | 3.27.0, ms | 3.28.0, ms | Diferencia, ms |
| --- | ---: | ---: | ---: |
| Expediciones · primera apertura | 46.150 | 49.850 | +3.700 |
| Expediciones · reapertura | 15.150 | 21.900 | +6.750 |
| Investigaciones · primera apertura | 45.100 | 38.350 | -6.750 |
| Investigaciones · reapertura | 30.400 | 21.550 | -8.850 |
| Cambio de rama | 27.300 | 21.950 | -5.350 |
| Contadores y layout | 0.100 | 0.750 | +0.650 |
| Serialización | 0.008 | 0.040 | +0.032 |

Investigaciones mejora de 45.10 a 38.35 ms en primera apertura y de 30.40 a 21.55 ms al reabrir. No se afirma la misma mejora para Expediciones: su primera apertura aumenta de 46.15 a 49.85 ms y la reapertura de 15.15 a 21.90 ms. La nueva presentación incorpora símbolos, previsiones y tarjetas activas; los incrementos se mantienen en el informe.

Las funciones económicas y de contadores conservan sus cálculos. Las mediciones de contadores incluyen también el layout del módulo, que ahora contiene más elementos; no demuestran un cambio en la fórmula. La serialización pasa de 0.0075 a 0.0400 ms en esta partida pequeña: son tiempos próximos a la granularidad del reloj y no permiten atribuir una regresión estable a la estructura de guardado. Se registra el resultado, sin ocultarlo.

| Función nueva | Mediana, ms |
| --- | ---: |
| Filtro de investigación | 22.40 |
| Abrir bonificaciones efectivas | 58.50 |
| Sincronizar tiempos y ficha seleccionada | 6.05 |

Abrir el desplegable incluye la espera del evento `toggle` y un frame; no es comparable a un bloque estático anterior. En 3.27.0 no existía la actualización viva del contador de viajes, por lo que no se presenta una mejora frente a una operación inexistente. El nuevo sincronizador trabaja solo sobre viajes y ficha visibles, sin reconstruir la pantalla, generar SVG ni recalcular los 52 proyectos cada segundo.

Memoria retenida tras GC, en la misma sala final Expediciones: 2.486 → 2.627 MiB (+0.142 MiB). DOM: 227 → 248 elementos. El guardado de comparación mide **3143 bytes en ambas versiones**; los filtros no se persisten. Las partidas futuras que reciban un regreso incorporan su historial compacto autorizado, hasta doce registros.

Estos resultados son mediciones sintéticas de Chromium, no pruebas físicas de Android ni garantías para todo dispositivo. [Datos íntegros](performance-report.json) · [Reproducción](reproduce.md).
