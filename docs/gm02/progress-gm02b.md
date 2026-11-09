# GM-02B · avance verificable, sin publicación

Base de trabajo: `9bf3ebf`, rama `gm02/oceania`. [Solicitud íntegra](request-gm02b.md).

**Oceanía no está todavía jugable.** Se conserva 3.28.0, `gran_atlas_v05` y el catálogo instalado de 710 identidades, 79 regiones y 1.329 presencias. No se modifica el contrato GM-02A de 97 identidades, ocho regiones y 131 presencias; no se repite GM-01.

## Componentes completados en este incremento

- Módulo cartográfico candidato `www/js/oceania-geography-v3290.js`: ocho celdas axiales con los IDs preparados; Australia continental conectada, Nueva Guinea, Tasmania y Nueva Zelanda separadas. Tamaño de hexágono y uniones matemáticas heredados del motor actual. Ninguna celda decorativa nueva.
- Delegación idéntica de layout y auditoría de Europa, Asia, África, Norteamérica y Sudamérica, verificada contra el motor anterior y sus regiones reales.
- `www/laboratorio-oceania-v3290.html`: **laboratorio cartográfico candidato**, con AtlasUI y AtlasMap de producción. Selección, teclado, escala, centrado y consulta de requisitos funcionan sin tocar partidas. No ofrece viajes ni desbloqueos reales. No es todavía el laboratorio artístico comparativo solicitado.
- [Tratamiento de Petauroides](petauroides-decision.json): consulta efectiva al registro MDD `1000351`, revisión fijada y hash coincidente con la autoridad utilizada por GM-02A. Se conserva `Petauroides volans` para Fauna fila 1420 en Australia Oriental, entendida como subáreas compatibles de bosque de eucaliptos del este/sureste. MDD documenta la segregación de `minor` y `armillatus` y la controversia existente. No se inventan registros segregados ni nuevas identidades.

Estos archivos nuevos no se cargan en `index.html` ni se añaden a la caché de producción. Las 115 rutas productivas preexistentes conservan sus hashes. No se activa el continente prematuramente.

## Evidencias y pruebas

**394 pruebas pasan, cero fallos**, incluidas cuatro verificaciones nuevas: integridad geométrica, conexión continental/separación de islas, conservación de las cinco mallas y trazabilidad del tratamiento de Petauroides.

El laboratorio se probó con Chromium/Playwright en **320×640, 360×740, 390×844 y 412×915**. En cada resolución se seleccionan las ocho celdas; funcionan los controles de escala y consulta; el mapa cabe completo, la acción permanece visible y no hay desbordamiento horizontal ni errores de página. La prueba hace fallar cualquier acceso a localStorage/sessionStorage. No son pruebas físicas Android.

Capturas: [320](cartography/map-320.png), [360](cartography/map-360.png), [390](cartography/map-390.png), [412](cartography/map-412.png). Se inspeccionó visualmente la captura de 320 y se corrigió un contador indefinido antes de regenerar las evidencias. Estas capturas solo demuestran la cartografía candidata; no aprueban ilustraciones zoológicas inexistentes.

[Resultados de navegador](cartography/browser-results.json) · [Regresión completa](regression-gm02b.txt) · [Validación y límites](validation-gm02b.json).

```bash
node --test tests/*.test.cjs
node scripts/check-oceania-map-v3290.cjs
python scripts/build-oceania-gm02.py --check
```

## Bloqueo externo concreto

Las consultas HTTPS a `api.gbif.org`, `www.worldbirdnames.org` y `reptile-database.reptarium.cz` fallan con **curl exit 56, CONNECT tunnel failed, response 403**. No se recibió una respuesta científica del servidor de destino. También está bloqueado `api.github.com`, necesario para verificar cómodamente runs/artefactos posteriores. El repositorio científico MDD en `raw.githubusercontent.com` sí está accesible; de ahí procede la decisión de Petauroides, no de una consulta supuesta.

Siguen sin resolver con nueva evidencia consultada: `Apteryx haastii`, `Lophorina superba`, `Crocodylus novaeguineae` y `Trichoglossus haematodus`. No se cambian nombres, rangos, distribuciones ni IDs para sortear este bloqueo.

Se guardó un borrador de configuración de red, conservando los presets y ajustes existentes, con estos seis dominios adicionales: `api.gbif.org`, `worldbirdnames.org`, `www.worldbirdnames.org`, `reptile-database.reptarium.cz`, `api.github.com` y `pruizbohle.github.io`. La herramienta confirmó **saved** y **requires_publish=true**. El borrador necesita revisión/guardado y publicación desde la configuración del entorno; no está aplicado por el simple hecho de guardarlo. Después se debe refrescar el estado y probar conexiones nuevas antes de declarar resuelto el acceso.

## Trabajo que falta para terminar 3.29.0

Resolver las cuatro revisiones; configurar hábitats, horarios, estaciones, clasificación, variantes y perfiles gráficos de las 97 identidades; renderizar e inspeccionar realmente los dibujos; instalar datos y cartografía en el juego con progresión alcanzable; probar viajes y encuentros reales, naturalistas, Cuaderno, Bestiario, muestras y publicaciones; medir rendimiento, guardados, offline y Android; finalmente preparar versión/PWA, verificar web y APK, firmas y workflows.

No se afirma que la red sea el único trabajo pendiente: la integración funcional y artística todavía debe ejecutarse. No hay versión nueva, APK, laboratorio publicado ni fusión a main. La sección 7 del prompt exige mantener 3.28.0 ante un bloqueo científico/técnico, y se respeta.
