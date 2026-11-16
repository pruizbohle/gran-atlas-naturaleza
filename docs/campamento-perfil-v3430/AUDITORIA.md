# UX-02 · Laboratorio previo a integración

Base comprobada: main remoto y referencia c9991a5854a4d9ea1d8bd7083d8d2e9889e7c16d. Checkout anterior main local 57a2a4d permanece intacto; desarrollo en worktree independiente lab/campamento-perfil-v3430, sin commits, push, PR, merge ni despliegue. La versión del motor sigue siendo 3.42.0; 3.43 es solo la propuesta en revisión.

Expediciones usa internamente tab=expeditions y navigationTab3300; su rama científica conserva AtlasDevelopmentUI y la rama commerce conserva renderTrade3300. Taller es InventoryView=taller y comparte el motor de recetas/inventario. Los trabajos paleontológicos y de relictos se administran en museo/fossils y museo/relicts mediante start/collect originales. Museo conserva sus vistas originales para reconstrucción, catalogación y exhibición.

El adaptador se ejecuta únicamente dentro de un iframe opaco y mantiene tab interno según cada motor para respetar sus guardas. Añade presentación y retorno de Campamento; no copia operaciones económicas. Los enlaces contextuales conservan su ruta histórica y el retorno extiende su contexto con la instalación visible.

El avatar conserva saveManagerOpen como identificador observado por los errores de almacenamiento. Un adaptador de presentación repinta el avatar y conserva aviso/etiqueta accesible después de persistir; Guardar abre el gestor original sin modificar save-manager.js ni los plugins SAF. El perfil opcional solo se añade a la partida sintética en memoria al guardarlo expresamente.

No existe un registro fiable de inicio de la partida: no se infiere del ID ni de la fecha de edición. Prospecciones solo conserva historial limitado; se presenta como registros conservados y no como total histórico inventado. Los totales de catálogos se calculan dinámicamente.
