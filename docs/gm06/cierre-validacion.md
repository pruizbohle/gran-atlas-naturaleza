# Validación del candidato 3.44.0 — 17 de noviembre de 2026

Se retomó el worktree `feat/gm06-cartografia-naturalista` con sus cambios locales, sin reconstruirlo. `origin/main` se volvió a consultar: continúa en `41a4bbd` (3.43.0). La biblioteca artística de coleccionables permanece en su rama separada `feat/coleccionables-arte-240`, referencia `451e844`; no se regeneraron ni fusionaron sus SVG.

## Totales confirmados con el motor

| Contenido | Main 3.43.0 | Candidato |
|---|---:|---:|
| Especies | 945 | 997 |
| Regiones ordinarias | 113 | 125 |
| Asociaciones zoológicas | 1.744 | 1.829 |

Rapa Nui queda fuera de esos recuentos: destino documental especial, sin prestigio, descubrimientos ni recompensas nuevos.

## Estado del encargo original

| Área | Estado y evidencia |
|---|---|
| Cartografía continental y nombres | Ejecutada en el candidato. Se revisaron visualmente Europa, Asia, África, Norteamérica, Sudamérica, Oceanía y referencia mundial; capturas en `pruebas/reauditoria/`. No se alteraron otra vez las coordenadas durante esta validación. |
| Patagonia / Bosques templados | Patagonia conserva ID, acceso y progreso; se traslada al extremo austral. El nuevo bosque ocupa la celda anterior y recibe las asociaciones de pudú, zorro y ranita de Darwin. |
| Nuevas regiones y fauna compartida | Ejecutadas; tablas de nombres, coordenadas, hábitats, fauna y requisitos en `regiones-revision.tsv` y `asociaciones-nuevas.tsv`. |
| Zoología | 997 nombres científicos distintos y cero especies huérfanas. Se revisaron identidades/sinónimos prioritarios de las incorporaciones, endemismos insulares y el concepto explícito de tortuga de Santa Cruz occidental. |
| Accesibilidad | Las 1.829 asociaciones se comprobaron con funciones reales de presencia, horarios, estaciones y métodos de muestreo. Todas tienen una combinación válida; no basta la intersección de etiquetas de hábitat. |
| Monografías nuevas | Las 52 especies recorren encuentros manuales y automáticos, cinco etapas y publicación única. Esta validación usa RNG controlado y probabilidad ordinaria, sin la bandera de encuentro garantizado. |
| Arte | Se revisaron las cinco páginas de la galería. Se corrigieron albatros y tití; los 945 sprites anteriores permanecen iguales. La homologación mundial sigue fuera de alcance. |
| Continuidad | Partida 3.43 con perfil, región visitada, logros y diploma acreditados y cuatro colas pendientes conservados mediante guardado e importación/exportación. Comparación adicional de retorno offline de 72 horas contra la base. |
| Campamento / Inventario / Museo / Sociedad | Se mantienen sus sistemas, objetos y reglas; la prueba de navegador incluye sus accesos y los del Atlas, Cuaderno y Bestiario. |
| Coleccionables y comercio | Solo planificación y matriz de referencias. No se añadieron piezas, rutas, costes, recompensas ni sistemas económicos. |
| Rapa Nui | Presentación y expediente preparados. El evento operativo continúa pendiente: la infraestructura actual no ofrece ese flujo documental sin recompensas. |
| Laboratorio | Actualizado con arte corregido y resultados visibles en «Cambios y fuentes». Sigue siendo autónomo y aislado del guardado real. |
| Integración / publicación | Pendiente de aprobación expresa del laboratorio. La entrada pública, la versión del paquete, el service worker y la firma Android siguen intactos. |

## Correcciones de esta validación

- Albatros de Galápagos: cuerpo, ala plegada alargada, cuello claro y pico largo con gancho; sustituye una base demasiado similar a un ave terrestre. Referencia: [Galapagos Conservation Trust](https://galapagosconservation.org.uk/species/waved-albatross/).
- Tití de Geoffroy: cuerpo oscuro/marrón, nuca y cola rojizas, extremo de cola oscuro y corona blanca; deja de depender de un recoloreado genérico de mono araña. Se conserva Callitrichidae según la referencia taxonómica moderna ya documentada. La ficha antigua de [Animal Diversity Web](https://animaldiversity.org/accounts/Saguinus_geoffroyi/) se utiliza aquí para la descripción externa, no para reemplazar la taxonomía moderna.
- Se amplió la verificación al grafo completo de asociaciones y al retorno offline comparado, y se añadió Inventario al navegador del laboratorio.
- Las 33 asociaciones cuyos hábitats globales no intersectan de manera directa **no son 33 errores**: ya existen en la base y usan sobreescrituras de presencia polar, marina o de sondeo. El examen del motor real confirma que son accesibles. Evidencia: `pruebas/reauditoria/accesibilidad.json`.

## Revisión científica y límites

Los recortes regionales y los sinónimos prioritarios están en `zoologia.md` y `especies-revision.tsv`. *Nannopterum harrisi* / *Phalacrocorax harrisi* es una sola identidad. Los epítetos iguales de géneros diferentes no se fusionan: por ejemplo, *Saguinus geoffroyi*, *Ateles geoffroyi* y *Leopardus geoffroyi* no son sinónimos. El concepto de *Dromiciops gliroides* continúa siguiendo MDD 2.5 y su incertidumbre documentada.

No se afirma una nueva revisión bibliográfica individual de las 945 distribuciones antiguas ni una reconstrucción completa de rangos de 1842. La inaccesibilidad del XLSX de AviList en la etapa anterior sigue declarada; no se presenta como fichero auditado. Las comprobaciones móviles son de navegador, no de Android físico.

## Decisión de publicación

El paso 7 del nuevo encargo condiciona la integración a que «el laboratorio ha sido aprobado por el usuario». Esa aprobación expresa todavía no consta en la conversación. Por eso no se crea commit, no se integra `main` y no se publica 3.44.0. No se propone otra redistribución cartográfica: lo que queda para aprobar es el candidato revisado.

Una vez aprobado, faltan la incorporación de los módulos a la entrada pública, la actualización coherente de versión/precache/manifiestos, la verificación de release y el despliegue web con comprobación offline. No se iniciará GM-07 ni se generará APK.

Resultado actualizado: **27/27 pruebas focalizadas** y suite completa **573/783**, con los mismos **210 fallos preexistentes**, sin fallos adicionales por título frente a la base. Los cinco anchos pasaron la prueba de navegador y el arranque sin red.

Los resultados actuales se conservan en `pruebas/validacion-final.json`; la lista detallada de pruebas históricas y su comparación se adjunta por separado. Los fallos preexistentes se declaran, no se convierten en una suite verde.
