# Integración ecológica y funcional aislada

Candidato no aprobado ni instalado. Sigue 3.28.0 en la entrada pública. Cuatro tratamientos científicos pendientes conservan su identidad de origen y `pending-authority-review`.

`ecology-profiles.json` contiene decisiones explícitas de configuración por identidad, separadas de la fuente GM-02A inmutable. No son una certificación de ocurrencias. Hay hábitats terrestres y acuáticos diferenciados; los cisnes/pelícanos fuente de Australia Occidental usan las subáreas de ríos, humedales y costa, nunca el desierto para forzar compatibilidad. Se corrige la clasificación de presentación de Morelia viridis a serpiente y de Sphenodon a rincocéfalo, sin cambiar sus identidades ni ningún animal anterior.

El candidato `oceania-runtime-v3290.js` contiene perfiles compatibles con SPECIES, ocho regiones y el acceso propuesto: Cartografía de Oceanía depende de `sudamerica_1`, cuesta £3800 y 3400 de conocimiento; regiones a prestigio 197, 200, 203, 206, 209, 212, 215 y 218. No añade materiales, recetas ni sistemas, no toca investigaciones previas ni consume prestigio. Estos son valores de diseño candidatos, no datos del Excel, y se probaron sin ciclos de materiales propios. Las cuatro estaciones mantienen acceso jugable a las poblaciones residentes representadas, sin inventar migraciones restrictivas.

`tests/helpers/oceania-review.cjs` instala solo en una VM el candidato en el motor real mediante puntos de inserción comprobados. No sustituye encounter, elegibilidad, investigación, recompensas, guardado ni compras. El helper no se sirve en el juego. Las pruebas verifican 807 identidades, 87 regiones y 1460 presencias en esa VM, además de igualdad de los 710 perfiles, 79 regiones, investigaciones previas, objetos, recetas, viajes y Legendarios anteriores.

Ocho pruebas específicas pasan: todos los registros alcanzables en sus estaciones, encuentros manuales/automáticos en ocho regiones, requisitos y viajes bloqueados, avance de las 97 identidades por las cinco etapas, publicación sin doble recompensa, muestra/exposición en el Museo 3.27, igualdad de tasas/intervalos, guardado/reapertura y flujo nativo de exportación/importación en memoria. Los ensayos son aislados; no demuestran aún calidad gráfica, rendimiento móvil u offline del catálogo ampliado.

Variantes candidatas: albinismo configurado únicamente en Macropus giganteus, Osphranter rufus, Vombatus ursinus y Cygnus atratus; no se infiere melanismo de pelajes naturalmente oscuros. Siete perfiles sexuales aviares se preparan para diferencias ornamentales/faciales. Todos conservan Notable; no se añaden Legendarios ni probabilidades. Estas capacidades y dibujos deben verificarse al renderizar antes de aprobarlos.

```sh
python scripts/build-oceania-runtime-v3290.py --check
node --test tests/oceania-runtime-v3290.test.cjs
```

Quedan el arte renderizado, laboratorio y auditoría visual, las cuatro resoluciones científicas, integración web/PWA, ensayos de interfaz/rendimiento y validación de publicación. `approvedForProduction=false`.
