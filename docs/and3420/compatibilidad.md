# Compatibilidad de partidas y contenido

Se mantiene el guardado gran_atlas_v05 y el motor app.js exacto de 3422b10. No cambian las 945 especies, 113 regiones, 1.744 presencias, 68 objetos, 80 logros, 37 misiones, doce exposiciones, economía ni procesamiento del tiempo. Se conservan Brújula, mapas/Mapamundi, acceso histórico, comercio, contratos, trueques y trabajos activos.

Catorce pruebas actuales ejecutan los exportadores históricos de 3.28 a 3.41, importan sus JSON mediante el gestor actual, comparan fondos, conocimiento, prestigio, inventario, viajes, publicaciones, avistamientos, etapas, compras y equipo, recargan y vuelven a exportar como 3.42. Las partidas avanzadas se comparan además campo por campo y se verifica el pago único de un viaje después de restaurarlo. No se cambian las 720 pruebas originales: se ejecutan sobre sus fuentes históricas exactas; 41 regresiones de orientación/navegación/economía se repiten sobre el candidato actual.

La PWA conserva respaldo exacto previo a la activación y bloqueo si hay otra ventana abierta. La actualización 3.41→3.42 se verifica con rutas de 24 h, expediciones, excavaciones, operaciones profundas, contratos y noventa días offline, sin pagos repetidos. El laboratorio UX aislado permanece disponible y sus escenarios no acceden a partidas personales.

Los plugins SAF originales conservan sus fuentes. El puente de compartir usa la API de registro de Capacitor actual cuando hace falta. En Android se usan recursos empaquetados sin registrar la PWA web; el botón web de actualización permanece oculto en el entorno nativo. Las pruebas del puente son simuladas y la validación de exportación/importación en un teléfono sigue pendiente.

[Procedimiento de respaldo](respaldo-y-migracion.md) · [Prueba física pendiente](prueba-fisica.md).

En la reapertura, el normalizador existente convierte algunos flags continentales 1/true a booleanos. La comparación del navegador acepta únicamente esa equivalencia en los flags de acceso enumerados en su informe; no relaja cantidades, fondos, investigación, inventario ni trabajos.
