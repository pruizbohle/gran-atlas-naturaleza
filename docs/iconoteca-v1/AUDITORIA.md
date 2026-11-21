# Auditoría inicial de emojis — El Gran Atlas

Fecha: 2026-11-21. Base de trabajo: `main` en `c8af26e7c5d8862fc14f36bf23798bae02229f3c` (actualización de laboratorio de variantes, 20/11/2026). Versión mostrada en la interfaz: **4.9.6**.

## Alcance auditado

Se revisaron 17 archivos seleccionados de la interfaz y lógica jugable, incluyendo `www/index.html`, `www/js/app.js`, `www/js/mobile-ui.js`, los módulos de campo, sociedad, encargos, inventario, bestiario y museo.

Resultado exploratorio sobre esos archivos: **146 símbolos pictográficos distintos, 561 apariciones**. La cifra no significa 146 diseños nuevos: incluye repetición, pictogramas de paisajes, etiquetas de animales, fichas del inventario, textos de registro y estados. Los símbolos no pictográficos (p. ej. ✦, flechas) pueden escapar de la expresión regular usada; se tratarán en fase técnica.

## Decisión gráfica

- **Reemplazar primero la interfaz funcional**: 10 pestañas, indicadores, acciones y gabinete.
- **No sustituir un dibujo existente por otro inferior**: `www/js/item-art-v3198.js` ya genera placas SVG de brújula, mapas, fósiles, morral, monedas, pergaminos, plumas y herramientas.
- **Tratar aparte los paisajes**: abundan 🌲 🌾 🌊 ⛰️ y fauna en `regionLandscape` de `app.js`. Requieren una auditoría iconográfica por bioma o composición panorámica, no 40 pictogramas aislados.
- **Mantener textos de log, estados y datos originales sin cambios** hasta aprobar un plan semántico. El icono decorativo es distinto del icono que comunica error o éxito.
- **Sociedad y Museo necesitan imágenes distintas**: actualmente comparten 🏛️. El prototipo distingue sello académico de vitrina paleontológica.

## Biblioteca V1: 24 iconos

La biblioteca está en `www/iconoteca/index.html`, aislada y sin acceso a partida. `atlas-ui-icons.js` registra 24 identificadores semánticos. Reutiliza 11 ilustraciones de `AtlasItemArt` y añade 13 iconos de interfaz nuevos, con paleta tinta #604a35, pergamino #f0dfb8, bronce #b68a40, verde #738464.

## Estado / integración

- Rama: `arte/iconoteca-1842-v1`.
- **No integrar todavía** `www/iconoteca/*` en `www/index.html`, CSS del juego, APK, versión, caché ni service worker.
- Pendiente: aprobar iconografía a 24, 32 y 48 px; añadir estados activo/inactivo; preparar sustitución de etiquetas en `index.html`, `mobile-ui.js` y vistas de `app.js`; pruebas de contraste/accesibilidad; regresión móvil/desktop.
- Los SVG son imágenes decorativas de la biblioteca. Al integrarlos en botones, conservar texto visible o nombre accesible.
