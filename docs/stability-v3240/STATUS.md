# Cierre técnico de la serie de las Américas

| Etapa | Versión | Estado y referencia |
|---|---|---|
| AM-01 · Auditoría | 3.21.2 | Completada; [informe](../americas-audit.md), fuente y trazabilidad conservadas. |
| AM-02 · Norteamérica | 3.22.0 | Completada; 14 regiones, 206 presencias, 128 identidades canónicas. |
| AM-03 · Pulido norteamericano | 3.22.1 | Completado; ilustraciones protegidas por regresiones y hashes. |
| AM-04 · Sudamérica | 3.23.0 | Completada; diez regiones, 192 presencias, 131 identidades. |
| AM-05 · Pulido sudamericano | 3.23.1 | Completado; 131 ilustraciones revisadas, evidencia antes/después conservada. |
| AM-06 · Estabilización global | 3.24.0 | Implementada y validada técnicamente: 294 pruebas, regresión global y Bestiario paginado. Publicación sujeta al éxito real de ambos workflows del commit. |

El juego conserva 710 especies, 79 regiones y cinco continentes. No se detectaron fallos críticos pendientes en las pruebas ejecutadas. La comprobación final de despliegue/APK se realiza después del push y se comunica con el SHA y las ejecuciones correspondientes.

## Diferencias esperadas de contratos

- El DOM del Bestiario deja de contener 487/710 tarjetas simultáneas y muestra como máximo 32. El conjunto lógico permanece completo; su cobertura y orden se verifican recorriendo todas las páginas.
- El Jaguar no tiene por qué encontrarse en la primera página alfabética. Su prueba accede a la página correspondiente y conserva las comprobaciones de Cuaderno/publicación.
- Los hashes de código histórico excluyen únicamente las inserciones de presentación AM-06. Ningún fixture previo de catálogo, comportamiento, arte, probabilidades o guardado se altera.
- La página seleccionada es temporal, no un campo nuevo de partida.

## Pendientes no críticos y límites

1. **Android físico:** la validación responsive utiliza Chromium; faltan perfiles en dispositivos reales y pruebas nativas de instalación/selector de archivos. La compilación y contenido del APK se verifican por separado.
2. **Continuidad de firma:** el runner genera firma de depuración. Se compara el APK nuevo con el certificado de 3.23.1; si difieren, no se garantiza actualización directa. Una distribución estable requiere gestionar una clave persistente fuera del repositorio. No se elimina ningún guardado ni se indica desinstalar sin respaldo.
3. **Variación de rendimiento:** la serialización medida aumenta de 2,85 a 3,27 ms, y algunos cambios de módulo calientes varían unos milisegundos. Se registran los valores sin cambiar mecánicas ni atribuir causalidad a código que permanece idéntico.
4. **Evolución visual:** los enlaces históricos del encabezado y las interfaces de Cuaderno/Bestiario se conservan; su renovación profunda pertenece a otra etapa.
5. **Taxonomía/distribución:** siguen vigentes las incertidumbres documentadas de AM-04. Cerrar la expansión técnica no equivale a resolverlas científicamente; no se alteran identidades ni presencias.
6. **Validación remota de Pages:** la red de esta sesión bloquea el acceso directo a github.io. Se confirma el resultado real del workflow y su URL de despliegue, sin afirmar haber navegado remotamente la página publicada.

No se inicia contenido, interfaces nuevas ni mecánicas posteriores en AM-06.
