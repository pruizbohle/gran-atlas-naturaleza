# El Gran Atlas 3.43.0 · Campamento y perfil

Campamento reúne las cinco actividades existentes en un plano naturalista compacto: Astillero, Caravana, Taller, Excavaciones y Prospecciones. Cada instalación tiene un botón visible **← Volver al Campamento**, accesible por teclado y con una altura táctil mínima de 44 px.

El avatar reúne Perfil, Estadísticas, Guardar y restaurar y Sobre el juego. Hay ocho retratos SVG locales, nombre opcional validado y un reconocimiento destacado de los logros obtenidos. El perfil viaja en el JSON de respaldo existente y no exige cuentas ni otro almacenamiento.

Se conservan los diez módulos y el alias interno `expeditions`, los motores de actividades, tiempos, costes, catálogo, recibos y recompensas originales. Inventario y Museo mantienen sus funciones de equipo, colecciones, reconstrucción, catalogación y exposición. El gestor de respaldos conserva sus mecanismos SAF y muestra las advertencias de almacenamiento sobre el avatar.

Las estadísticas usan catálogos y registros reales. No se inventa una fecha de inicio ni un historial completo de prospecciones cuando solo se conservan registros parciales.

[Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/) · [Actualizar conservando la partida](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3430.html) · [Laboratorio aislado](https://pruizbohle.github.io/gran-atlas-naturaleza/laboratorio-campamento-perfil-v3430.html)

[Publicación y hashes verificados](docs/campamento-perfil-v3430/PUBLICACION.md)

## Verificación

- Suite histórica 3.42.0 ejecutada sobre `c9991a5`, sin editar sus pruebas.
- Regresiones actuales de navegación, perfil, respaldos y migración desde partidas 3.28–3.42; controles nuevos de publicación y conservación de SAF.
- Navegador real a 320, 360, 390, 412 y 1280 px: 125 entradas y retornos de instalaciones, persistencia tras recargar, exportación/restauración y avisos de cuota o partida ilegible.
- Recarga sin red con el service worker real; 190 rutas offline.
- No se genera ni publica una APK en esta actualización web. Los workflows de firma y publicación Android conservan sus validaciones originales.

[Implementación y capturas](docs/campamento-perfil-v3430/IMPLEMENTACION-3.43.0.md) · [Validación](docs/campamento-perfil-v3430/validation-report.json) · [Pruebas de navegador](docs/campamento-perfil-v3430/production-report.json) · [Manifiesto](docs/campamento-perfil-v3430/release-manifest.json)

```sh
npm ci
npm run release:verify
python3 -m http.server 8783 --directory www
```

El laboratorio usa datos sintéticos en un iframe aislado y no comparte el almacenamiento de producción. Su motor histórico 3.42.0 queda fijado a la referencia auditada; la integración de producción se ejecuta en el `index.html` real 3.43.0.
