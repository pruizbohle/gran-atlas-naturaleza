# ART-CAMP-03 · Continuidad

Rama `art-camp-03` desde ART-CAMP-02 `d3deb113ea0a0b5b3c546e65cd555f5e5c8751c3`. La punta remota de MEC-09D es `d7cc4cb30b44656f922c2413a020ea93ee03c989` y ya está en la historia de la rama.

La revisión de los adjuntos, la carpeta compartida, la biblioteca y las imágenes generadas en el espacio encontró el encargo ART-CAMP-03 y las maestras entregadas de las fases anteriores. Los originales de Astillero I–V y Caravana I–IV no estaban disponibles. El encargo autoriza ilustrar estos nueve IDs.

Próximo paso. Integrar los nueve recortes, medir las 30 instalaciones y probar la composición completa antes de generar el fondo.

## Nueve etapas recuperadas por producción

Maestras nuevas `shipyard-1-4.png`, `shipyard-5.png` y `caravan-1-4.png`. Las 30 etapas ya tienen archivo. La secuencia naval conserva el acceso por la derecha y amplía muelles, grúa, cobertizo y embarcaciones. La secuencia comercial conserva el carro y añade toldo, convoy y depósito. Dieciocho WebP nuevos, registrados en la PWA. Pasaron las tres pruebas ART-CAMP-02.

## Auditoría de proporciones

Se registró una medida por etapa en [medidas.csv](medidas.csv). Las lecturas se hicieron sobre la variante de 384 px. Las dimensiones físicas son referencias de diseño estimadas a partir de vanos, mobiliario, herramientas, ruedas y aparejos visibles. No se dispone de planos verificados de las edificaciones ilustradas.

Las 21 láminas de ART-CAMP-02 conservan sus píxeles y sus maestras. Las correcciones se aplican al encuadre de cada etapa en la composición. Puertas de unos 2 m, bancos de unos 0,9 m y ruedas de unos 1,1 m ayudan a comprobar que el crecimiento responde a naves, terrazas y equipamiento.

## Homologación

El mapa de 900 px de referencia usa 14,5 px por metro en la fila central y aplica una corrección de profundidad de 0,94, 1 y 1,06 por fila. Cada etapa calcula su tamaño a partir de su propia medida. Las huellas se toman del canal alfa y comparten los puntos de apoyo con el juego. En Astillero el ancla es el punto de llegada del muelle a tierra. Los otros recortes se apoyan en su base central. [Anclas y escala](anclas.json)

Se reproducen las medidas y huellas en el manifiesto con `python scripts/build-art-camp-03.py`.
