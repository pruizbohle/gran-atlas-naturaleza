# El Gran Atlas 3.37.0 · Encargos del naturalista

Sociedad → Misiones incorpora **24 encargos nuevos en seis líneas**, además de los **13 originales**. El tablón presenta cadenas, objetivos compuestos, tres destacados, progreso automático, premios explícitos y archivo de reclamados. Se conservan los 80 logros, sus criterios y los títulos de 3.36; no se añaden especies ni regiones.

## El tablón

- Resumen de los 37 encargos, recompensas listas, tareas en progreso y bloqueadas.
- Filtros por estado y temática, incluida una categoría para los 13 encargos originales.
- Hasta tres destacados; seguir un encargo no activa ni bloquea su progreso. También hay recomendaciones desplegables.
- Objetivos desglosados, progreso, condiciones de cadena, premios y atajos al módulo existente.
- Archivo permanente de reclamados. Las tareas pagadas no saturan la vista inicial.
- Indicador en la pestaña Misiones y avisos agrupados discretos, separados de las medallas. Nunca se reclama un premio automáticamente.

Las líneas son Primeros estudios, Expediciones del mundo, Museo y paleontología, Instituto y fabricación, Navegación y Comercio, y Especializaciones y ambientes extremos; cuatro encargos por línea. [Catálogo completo con requisitos y premios](docs/enc3370/catalogue.md).

Los atajos abren Campo, Cuaderno, Museo, Investigación, Expediciones, Inventario, Atlas, Publicaciones o Bestiario. Las localizaciones profundas y abisales solo seleccionan una región en el Atlas: no viajan, desbloquean, fabrican, consumen ni compran automáticamente.

El diseño conserva Sociedad de 3.36. Solo Misiones compacta su cabecera y añade estilos propios. No cambia la navegación principal ni el menú inferior. No hay vencimientos, rachas, tareas diarias, moneda nueva ni obligación de conectarse periódicamente.

## Evidencia, cadenas y compatibilidad

[Auditoría ENC-01](docs/enc3370/enc-01.md). El guardado sigue siendo `gran_atlas_v05`. `state.commissions` añade objetivos satisfechos, premios habilitados, recibos, avisos y destacados; no crea un segundo guardado.

Se aprovechan descubrimientos, etapas, publicaciones, visitas reales, investigaciones, fabricación acreditada, colecciones, exposiciones y contadores fiables existentes. Los catálogos regionales se relacionan por `REGIONS`, nunca por prefijos de ID. Estudiar especies de un catálogo no se presenta como prueba del lugar de cada avistamiento. Desbloquear no prueba visitar; poseer un instrumento no prueba fabricarlo.

Los contadores comerciales se reutilizan desde su inicio en **3.36.0**, indicado en cada encargo. No se inventan retornos anteriores a partir de los doce últimos registros. Los tipos científicos y protocolos se reconocen cuando existe evidencia conservada; no se reconstruyen eventos perdidos. No fue necesario crear un contador de actividad adicional desde 3.37.

Las cadenas se habilitan al cumplir el objetivo anterior, sin exigir reclamar su premio. Los objetivos se comprueban aunque estén bloqueados o no destacados. Si se reunió una reserva de materiales antes de habilitarse el premio, su cumplimiento queda acreditado aunque esos materiales se consuman después. Las tareas nuevas satisfechas no retroceden al retirar una exposición o gastar inventario. Los requisitos de los 13 encargos originales siguen siendo exactamente los anteriores.

La migración reconoce objetivos verificables, pero no paga automáticamente ni inventa fechas históricas. Las tareas reclamadas permanecen registradas; importar o recargar no reproduce avisos.

## Premios y transacciones

Los 13 premios originales conservan literalmente sus IDs, definiciones y función de recompensa, junto con `purchases['mission_'+id]`. Un envoltorio protege tanto sus pagos como los nuevos mediante una única escritura de la transacción. Si falla el guardado, revierten los recursos, el marcador y los recibos, y se puede reintentar.

Al restaurar un respaldo de la **misma `collectionId`**, se conservan los recibos locales de premios ya pagados y los marcadores originales. Un respaldo anterior no vuelve a habilitar esos premios; los demás recursos siguen los valores del respaldo elegido. Las partidas distintas no mezclan recibos. Una instalación nueva que solo recibe un respaldo antiguo no puede conocer un recibo posterior que no se exportó: se recomienda trasladar el respaldo actualizado. No se ofrece una garantía global entre instalaciones sin historial compartido.

Los 24 premios suman **£3.560, 4.750 conocimiento**, 9 pergaminos, 1 flor prensada, 2 guijarros, 2 maderas talladas, 3 fragmentos fósiles, 2 dientes fósiles y 1 fragmento de latón. Son premios únicos distribuidos desde los primeros estudios hasta el catálogo abisal.

La primera entrega es £40 y 50 conocimiento, frente a £420 iniciales. Los 13 premios originales suman £14.450 y 9.000 conocimiento, además de sus materiales; el efectivo nuevo equivale al 24,6 % del original. No se entrega prestigio, no se consumen instrumentos permanentes y no se cambian avistamientos, variantes, rutas, costos ni ingresos pasivos. [Auditoría del conjunto](docs/enc3370/reward-audit.json) · [Interpretación y límites](docs/enc3370/enc-05.md).

## Pruebas

**540 pruebas aprobadas:** las 524 de la versión anterior y 16 nuevas. Las 473 históricas se ejecutan sobre sus commits exactos; las otras 67 comprueban el runtime actual. No se cambian expectativas anteriores para acomodar la funcionalidad nueva. [Log final](docs/enc3370/final-tests.txt).

Las nuevas pruebas cubren conservación literal de los originales y los 80 logros, catálogos, cadenas, condiciones geográficas, retroactividad, destacados, cálculo/render puro, premios únicos, rollback, recibos al importar, separación de partidas, tick inactivo, exportadores reales 3.35/3.36, títulos, trabajos pendientes y navegación sin gasto.

[Testigo de los 24 encargos](docs/enc3370/playability.json), con semilla 3370: acciones reales de fabricación, investigación, estudios, publicación, Museo, excavación, viajes, cuatro plazos comerciales, compras, trueques y protocolos profundos/abisales. Los recursos y observaciones iniciales son fixtures sintéticos; no se afirma un tiempo de campaña humana ni un balance universal.

[Navegador](docs/enc3370/browser/report.json): 320, 360, 390, 412 y 1280 px; 37 tarjetas, 13 originales, filtros, tres destacados, aviso agrupado, reclamación explícita, archivo, persistencia y módulos existentes. Sin errores JavaScript ni desbordamientos. [Sesión de 200 ciclos / 800 cambios de pestaña](docs/enc3370/browser/session-report.json), con 37 misiones y 80 logros: un intervalo activo y nodos estables después de GC. Son ciclos automatizados en Chromium, no horas humanas ni Android físico.

[PWA 3.36→3.37](docs/enc3370/pwa/browser-report.json): copia exacta antes de activar, protección frente a otra ventana abierta, viajes y operaciones pendientes conservados y resueltos una sola vez, medallas intactas, originales ya reclamados conservados, juego y laboratorios offline. El laboratorio de Misiones contiene una partida sintética aislada y permite probar premios sin afectar la partida real.

Se mantienen **945 identidades, 113 regiones y 1.744 presencias**. Las incertidumbres científicas y artísticas documentadas en GM-05 siguen pendientes. Los límites de retrospectividad se explican arriba; esta actualización no inventa su resolución.

## Reproducir

```sh
node scripts/validate-commissions-v3370.cjs
node scripts/build-commissions-release-v3370.cjs
node scripts/check-commissions-pwa-v3370.cjs
# Con www servido en localhost:8767:
node scripts/check-commissions-v3370.cjs
node scripts/check-commissions-session-v3370.cjs
```

## Publicación verificada

[GitHub Actions](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/42943619506) validó y desplegó el commit `07f4688`. Los [169 archivos públicos](docs/enc3370/published-report.json) coinciden con sus hashes. La [prueba Chromium sobre Pages](docs/enc3370/published-browser.json) pasó sin errores JavaScript: caché `gran-atlas-v3.37.0-commissions-f9f7f8ab0083`, juego y laboratorios offline, operación pendiente conservada, catálogo mundial de 945 identidades, 80 medallas y tablón de 37 encargos con reclamación explícita única en su partida aislada. Se declaran 167 archivos únicos offline; la navegación raíz añade una entrada y se observaron 168 en caché.

- [Juego 3.37.0](https://pruizbohle.github.io/gran-atlas-naturaleza/).
- [Actualizar conservando la partida y con respaldo](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3370.html).
- [Laboratorio aislado de Misiones](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-misiones-v3370.html).

Las seis etapas están integradas en `main` y `feat/encargos-v3370`, con sus evidencias. **Android no se compiló y su firma permanente no se modificó.**
