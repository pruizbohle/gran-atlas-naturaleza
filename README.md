# El Gran Atlas v2.3 — Asia completa / Inventario por pestañas

- 11 zonas nuevas de Asia basadas en el Excel original: 21 regiones de Asia (31 regiones totales contando Europa).
- 103 especies únicas nuevas; se conserva el identificador y progreso de especies compartidas.
- Prestigio mínimo 10, 12, 14… 50; **no se consume** y sigue requiriendo Cartografía de Asia.
- Inventario: Equipo (3 slots y fabricación), Animales, Expedición y Coleccionables (mapas y fósiles).
- Preservación de la clave del guardado local y compatibilidad de partidas anteriores.
- Dimorfismo ilustrado en 7 especies asiáticas nuevas con diferencias visuales notorias (pavo real, pato mandarín, faisanes, antílope negro y ciervo sika).\n- Los sprites nuevos utilizan siluetas SVG específicas para varias familias (elefantes, pangolines, cobras, rinocerontes, pavos reales, cálaos, etc.). Algunos animales comparten forma base, con color y detalles de especie.

## Instalación

Sube el contenido de `www/` reemplazando los archivos correspondientes del sitio anterior, sin alterar los datos guardados en el navegador. Es recomendable respaldar la partida antes de publicar.

---

# El Gran Atlas v2.1

- Datos europeos desde Excel: 10 hexágonos, 118 especies únicas y 250 asignaciones regionales.
- Conserva avistamientos de especies anteriores por identificador; migra la selección de zona antigua al hexágono oficial más cercano.
- Avistamientos automáticos ahora visibles en la escena.
- No se reinicia almacenamiento local.

Abrir www/index.html desde Live Server.


## Novedades v1.7
- Revisión amplia de sprites con mejores siluetas base por familia.
- Cuaderno más compacto y con la ficha de especie más visible.
- Resumen de acciones automáticas en el Diario.
- Reincorporación de biomas faltantes en las regiones europeas.


## Novedades v1.8
- Redistribución ecológica de fauna por bioma, horario y estación.
- Máximo 4 biomas jugables por hexágono.
- Clasificación en Bestiario: clase y grupo, revelada con la investigación.
- Revisión premium de sprites y melánicos más oscuros.
- Biomas globales previstos a futuro: bosque, pradera, río, costa, tundra, montaña, humedal, mar abierto, estepa, mediterráneo, desierto, selva y sabana.


## Novedades v1.9
- Pasada centrada solo en sprites.
- Revisión premium de mamíferos, aves, reptiles y anfibios.
- Variantes melánicas reforzadas con siluetas oscuras y contraste interno.
- Mayor diferenciación entre especies frecuentes del atlas europeo.


## Novedades v1.9.1
- Corrección reforzada de sprites melánicos para que se vean negros/grises oscuros.
- Variantes observadas ahora en disposición horizontal.
- Diferenciación cromática adicional en topillos y aves pequeñas.
- Salamandras sin variante melánica; pasan a Leucística/Notable.
- Nuevo objeto Parte de mapa de Asia + receta de Mapa de Asia.
- Nueva investigación Cartografía de Asia.
- Botón de prueba para finalizar expediciones al hacer clic.


## v1.9.2 · Pulido gráfico
- Nuevos sprites diferenciados por especie o familia (aves pequeñas, acuáticas, rapaces, topillos, lirones, mustélidos y anfibios).
- Variante melánica: recoloración consistente del SVG final, incluyendo los colores escritos directamente en las siluetas. Los ojos conservan brillo ámbar.
- Se mantienen intactos los datos de partida, mecanismos de progresión, expediciones y economía.


## v2.0 — Dimorfismo sexual
- Registro de observaciones de macho y hembra para 12 especies con dimorfismo visual evidente.
- En el Cuaderno, dos sprites diferenciados aparecen al observar cada sexo; el ejemplar pendiente permanece oculto.
- La investigación 4/5 puede seguir requiriendo alimentación o dimorfismo completo (ambos sexos).
- Los especímenes raros (leucístico, melánico, notable) son independientes de este mecanismo.
- Guardado local compatible con partidas anteriores: logros antiguos de dimorfismo se migran a comparación completa.
- Sin áreas nuevas ni cambios a Asia, economía, avistamientos o Museo.


## v2.0 — Comienzo de Asia

- Europa permanece íntegra (10 hexágonos). Se suman 2 regiones del atlas de 900 especies:
  - **HX-03-13 — Cáucaso**: 10 especies.
  - **HX-03-15 — Anatolia**: 10 especies.
- Se incorporan 6 especies nuevas (leopardo persa, tur del Cáucaso oriental, gamo, lagarto de cristal oriental, caracal y cabra salvaje); las restantes comparten sus identificadores e investigación con Europa.
- Sprites SVG específicos para las 6 especies nuevas y un nuevo sprite de tortuga griega que también aparece en Europa.
- Dimorfismo sexual: tur, gamo y cabra salvaje (observación macho/hembra mediante el sistema 1.9.3).
- **Desbloquear Asia**: reunir 10 «Partes de mapa de Asia» en expediciones, fabricar «Mapa de Asia» en Inventario e investigar «Cartografía de Asia» (requiere «Cartografía naval II», £800 y 650 conocimiento). Una vez desbloqueado, Cáucaso y Anatolia son accesibles desde Atlas. El prestigio europeo no salta este requisito.
- Se conservan guardado y progreso; los cambios no reinician la partida.

### Comprobaciones recomendadas
1. Antes de la cartografía, Asia debe aparecer cerrada en Atlas.
2. Tras comprarla, ambas regiones deben habilitarse y permitir avistamientos manuales y automáticos.
3. Las especies comunes con Europa deben conservar los contadores previos.
4. En Cuaderno, las nuevas especies con dimorfismo deben revelar macho y hembra por separado.


## v2.1 — Tres nuevas zonas asiáticas

- Siberia Occidental (HX-02-13), Siberia Central (HX-03-14) y Mongolia (HX-04-13), extraídas del atlas de fauna Excel.
- Se comparten especies por nombre científico para conservar avistamientos, investigación y variantes.
- Las cinco regiones asiáticas requieren Cartografía de Asia y un prestigio mínimo acumulado de 1/2/3/4/5 puntos, respectivamente. **No se gastan puntos de prestigio al viajar ni al habilitar una región**.
- Regiones asiáticas ya abiertas en v2.0 se mantienen por compatibilidad, incluso si el prestigio actual es inferior al nuevo mínimo.
- Nuevas siluetas SVG y variantes por especie, incluidos dimorfismos del gallo lira y la gacela de Mongolia.

### Regla de acceso a Asia (definitiva v2.1)
- Cartografía de Asia es obligatoria.
- Tener como mínimo 1/2/3/4/5 de prestigio acumulado habilita respectivamente Cáucaso, Anatolia, Siberia Occidental, Siberia Central y Mongolia.
- **El prestigio nunca se descuenta al acceder a las regiones asiáticas.**
- Partidas antiguas que ya tenían regiones asiáticas habilitadas conservan el acceso.


## v2.2 — Cinco regiones más y herpetofauna
- Cinco hexágonos oficiales del Excel de 900 especies: Urales, Siberia Oriental, Kamchatka, Gobi, Himalaya.
- 57 registros regionales; 29 especies nuevas sin duplicar nombre científico.
- Prestigio mínimo asiático: 10/12/14/16/18/20/22/24/26/28 (sin gastar prestigio).
- Migración automática: las primeras cinco zonas que ya eran accesibles en v2.1 siguen accesibles.
- Mejoras visuales de lagartos, sapos, salamandras y tortugas; sprites específicos adicionales para nuevos animales asiáticos.
- Objetos: Parte de mapa de África (botín de expediciones) y receta de Mapa de África con 10 fragmentos. África aún no está disponible.
- El guardado conserva la misma clave local.


## v2.4
- Ayudas de campo para acelerar avistamientos y conocimiento.
- Atlas por continentes con estados candado / desbloquear / viajar.
- Investigación rediseñada como árbol de habilidades.
- Museo con submódulos de exposiciones, fósiles y relictos.
- Sociedad con Subvenciones, Publicaciones y Misiones.
- Bestiario con ordenamiento por abecedario, rareza y tipo.
- Corona con adquisición estética de moneda premium.

## v2.4.1 — Corrección de carga
- Restaurados datos y funciones de Inventario y Expediciones (ITEMS, VOYAGES, recetas y botín).
- Renderizado diferido por pestaña para impedir que un fallo en una sección bloquee toda la interfaz.
- Sociedad actualizada con sus tres pestañas y Publicaciones con subpestañas.
- Se conserva almacenamiento local `gran_atlas_v05` y el progreso de partidas anteriores.
- Pruebas de humo en Chromium: 10 módulos y subpestañas, nueva partida y partida previa, viajes, intercambio de libras por conocimiento.


## v2.4.2
- Mejora exclusiva de sprites.
- Corrección del Cálao rinoceronte (ya no usa silueta de rinoceronte).
- Corrección del Desmán ibérico (ya no usa silueta de tortuga).
- Nuevo Frailecillo atlántico, más cercano al frailecillo corniculado.
- Erizos renovados.
- Familias homologadas: gatos, jabalíes, liebres/conejos y zorros, con mejor color y patrón.
- Ajustes visuales adicionales de detalle y color.
