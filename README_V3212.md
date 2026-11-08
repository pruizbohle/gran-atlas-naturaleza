# El Gran Atlas 3.21.2 · Actualización de navegador y PWA

Una instalación antigua podía conservar el mapa de 406 celdas: su service worker seguía activo mientras otra pestaña o la PWA permanecía abierta. Una recarga normal continuaba sirviendo esa revisión desde la caché. La precarga de archivos frescos corregía la descarga, pero no la activación de una revisión pendiente.

[Actualizar conservando la partida](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar.html?version=3.21.2)

Abrir el enlace en el mismo navegador donde se juega. Cerrar las otras ventanas del Atlas, incluida la PWA, y pulsar **Actualizar conservando la partida**. El acceso descarga y comprueba la revisión completa, copia el guardado original sin modificarlo a `gran_atlas_backup_before_update`, verifica la copia y activa la revisión al confirmar que no quedan otras ventanas del juego abiertas. Ofrece también descargar el respaldo. Si no encuentra una partida en ese navegador o no puede respaldarla, se detiene con una explicación.

No se borra almacenamiento del navegador. La clave de partida `gran_atlas_v05`, los respaldos anteriores y los datos de otros sitios permanecen intactos. Las sesiones abiertas no se recargan automáticamente. El juego incorpora un acceso en Respaldos que guarda primero el estado en memoria y un aviso para futuras revisiones pendientes; se ocultan en la aplicación nativa.

La versión visible pasa a **3.21.2**. La geometría compacta se conserva: Europa 10, Asia 25 (cuatro hielos inertes), África 24 regiones individuales con Madagascar y Seychelles/Aldabra separados, y Norteamérica 14 celdas exactas de la referencia Excel. Total: 73 celdas y 57 regiones jugables. No se cambian fauna, economía, requisitos ni reglas de progreso.

## Verificación

- **232 pruebas automáticas aprobadas**, incluidos los contratos previos de mecánicas, guardado, geometría y arte.
- Chromium con instalación real de la revisión antigua `fc2a4ab`: Europa con 79 celdas; publicación de la nueva revisión y recarga normal todavía con 79. El nuevo acceso recupera Europa con 10 y confirma los cuatro totales continentales.
- La actualización se bloquea mientras otra ventana antigua permanece abierta. Al cerrarla, el respaldo coincide byte por byte con el guardado anterior. Dinero, conocimiento, prestigio, avistamientos, descubrimientos, publicaciones, inventario, desbloqueos y región actual se conservan.
- Datos y caché ajenos al juego conservados; recarga posterior sin conexión correcta; cero errores JavaScript. Un navegador sin partida recibe una explicación y no se redirige a un juego vacío.

[Resultado reproducible](docs/update-v3212/browser-report.json) · [Antes](docs/update-v3212/before.png) · [Después](docs/update-v3212/after.png)

```sh
node --test tests/*.test.cjs
node scripts/build-atlas-lab-v3211.cjs --check
NODE_PATH=/workspace/atlas-tools/node_modules node scripts/check-pwa-upgrade-v3212.cjs
```

La prueba de navegador requiere Playwright, Chromium e historial Git que incluya `fc2a4ab`. Comprueba una actualización real en Chromium; no sustituye una revisión física en cada navegador o teléfono.
