# Iconoteca 1842 — lote 2 CORREGIDO (solo UI)
**21 de noviembre de 2026.** El usuario precisó el alcance: sustituir **emojis de módulos, funciones, navegación y estados**, como los de Misiones y Cuaderno, **no** crear ilustraciones de los artículos del inventario que ya tienen recursos artísticos en la rama de actualización.

## Exclusión definitiva
- Todos los `plate.*` de `www/js/item-art-v3198.js`: huesos, cráneos, fósiles, monedas, armas? (No; ninguno del inventario), mapas físicos, flores prensadas, plumas, herramientas, materiales, etc.
- Todo el arte de coleccionables ya actualizado, particularmente el trabajo de `feat/coleccionables-arte-240`, y los sprites de especies/variantes.
- No modificar `www/js/item-art-v3198.js`, catálogos de objetos, inventario, guardado, economía ni versión del juego.
- No producir **una segunda versión gráfica de un mismo objeto**. Un icono de sección (por ejemplo Museo > Fósiles) es distinto de la imagen de un fósil individual; aun así esta tanda prioriza otras funciones para evitar confusiones.

## Dónde sí actuar
1. Navegación de escritorio y móvil: Atlas, Campo, Cuaderno, Investigación, Sociedad, Bestiario, Campamento, Inventario, Museo y Corona. **Ya están representadas en la V1 de 24 PNG**; no dibujar otra vez, primero revisar/aprobar.
2. Cabecera: Conocimiento, Libras, Prestigio, Equipo, Tomos. **Ya cubierto V1.**
3. UI interna: subpestañas de Sociedad y Museo, encargos, logros, registro científico, indicios, análisis, avisos, requisitos bloqueados/completados, respaldo/importación/exportación.

## 20 objetivos de la segunda tanda (no son 20 imágenes nuevas)
| # | Sección | Icono actual | Función | Estado |
|---|---|---|---|---|
| 1 | Sociedad | 🎯 | Encargos y misiones | Nuevo diseño pendiente |
| 2 | Sociedad | 🏅 | Logros | Diferenciar del Prestigio V1 |
| 3 | Sociedad | 💷 | Subvenciones | Reutilizar Libras V1 |
| 4 | Sociedad | 📚 | Publicaciones | Reutilizar Tomos V1 |
| 5 | Cuaderno | 📜 | Monografías | Nuevo diseño pendiente, distinto de Conocimiento |
| 6 | Cuaderno | 🌐 | Atlas total | Nuevo diseño pendiente |
| 7 | Cuaderno | 📊 | Registro científico | Nuevo diseño pendiente |
| 8 | Museo | 🖼️ | Exposiciones | Nuevo diseño pendiente |
| 9 | Museo | 🐾 | Muestras | Nuevo diseño pendiente |
| 10 | Museo | 🗿 | Relictos | Nuevo diseño pendiente |
| 11 | Museo | 🗃️ | Conservación | Nuevo diseño pendiente |
| 12 | Museo | 🧬 | Análisis comparativo | Nuevo diseño pendiente |
| 13 | Campo | 🔎 | Indicios de campo | Nuevo diseño pendiente |
| 14 | Campo | ⚓ | Navegación y comercio | Nuevo diseño pendiente |
| 15 | Estados | 🗝️ | Región desbloqueada | Nuevo diseño pendiente |
| 16 | Estados | 🔒 | Requisito pendiente | Nuevo diseño pendiente |
| 17 | Estados | ✅ | Objetivo completado | Nuevo diseño pendiente |
| 18 | Sistema | 💾 | Respaldar partida | Nuevo diseño pendiente |
| 19 | Sistema | 📤 | Exportar respaldo | Nuevo diseño pendiente |
| 20 | Sistema | 📥 | Importar respaldo | Nuevo diseño pendiente |

**Fuentes verificadas**: `www/index.html` (navegación, cabecera y respaldos), `www/js/mobile-ui.js` (textos de ruta), `www/js/app.js` (Sociedad, Cuaderno, Museo, notificaciones, investigación), `www/js/commissions-v3370.js` (Navegación y Comercio), `www/js/society-achievements-ui-v3360.js` (logros). Emoticonos de catálogos de piezas excluidos incluso si aparecen en `app.js`.

## Estado y próximos pasos
- Se corrigió el visor independiente publicado en `main`: `www/iconoteca/lote2-revision.html`. Muestra **emojis de referencia** con filtros y contexto; **no declara nuevas ilustraciones**.
- Se conservaron los 24 PNG ilustrados V1 en `www/iconoteca/index.html` sin alteración.
- Diseñar solo los íconos UI que falten, con estética naturalista 1842, validar lectura a 24/32/48 y fondos contrastados. No redibujar piezas con arte existente.
- Una vez aprobados los archivos concretos, integrar en PR independiente a través de datos centralizados que permitan reemplazo coherente en escritorio/móvil y tengan fallback de texto, sin tocar la partida.
