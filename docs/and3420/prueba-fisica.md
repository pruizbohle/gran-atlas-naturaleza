# AND-07 · Prueba física del candidato exacto

**Pendiente, sin dispositivo observado por Codex.** Esta lista es un procedimiento, no evidencia aprobada. No crear `docs/android/restoration-validation.json` hasta disponer de resultados reales. Chromium, mocks y ZIP de tests no sustituyen el teléfono.

## Preparación y autorización

- Descargar únicamente el artefacto del workflow manual de main que terminó correctamente. Conservar `atlas-candidate.apk`, `candidate-manifest.json`, `apk-sha256.txt`, `apk-signature.txt` y `apk-badging.txt`.
- Comprobar en PowerShell `Get-FileHash .\atlas-candidate.apk -Algorithm SHA256` y comparar con el manifiesto. Verificar versión 3.42.0, código 34200, ID histórico, run, commit completo y certificado permanente reales. No renombrar otro binario para simularlos.
- Comprobar también la versión visible dentro del juego y el `gameVersion` del JSON exportado: deben corresponder a 3.42.0, no solo la información del paquete Android. Si no coinciden, detener la validación sin borrar datos.
- Registrar privadamente modelo, Android y versión de Android System WebView. Obtener autorización expresa del propietario antes de una transición de certificado.
- Validar al menos dos copias externas del JSON y una restauración/reexportación en un perfil aislado siguiendo [el procedimiento de respaldo](respaldo-y-migracion.md). Comparar todos los campos relevantes. Si falla, conservar la instalación original y detener la transición.
- Comparar certificados. Si coinciden, instalar como actualización sin borrar datos. Si difieren, Android no admite actualización directa: solo el propietario autorizado puede realizar la reinstalación manual después de validar las copias. Ningún script de este proyecto desinstala.

## Comprobaciones observables en el teléfono

| Comprobación | Registrar el resultado real |
|---|---|
| Instalar el candidato exacto | APK hash, versión y certificado; modo de transición |
| Pantalla completa y vertical | Apertura, giro, barras recuperables y controles sin solapamiento |
| Diez módulos | Atlas, Campo, Cuaderno, Investigación, Sociedad, Bestiario, Expediciones, Inventario, Museo y Corona |
| Campo y persistencia | Explorar, guardar, cerrar completamente y reabrir |
| Pantallas extensas | Inventario completo, mapas, Comercio/recibos, logros/misiones, Cuaderno y exposiciones del Museo |
| Offline | Desconectar internet, explorar, cerrar totalmente y reabrir sin conexión |
| Respaldo nativo | Guardar JSON en una carpeta externa y compartir otra copia mediante Android |
| Restauración | Selector nativo, previsualización y confirmación; probar también archivo o texto alternativo |
| Errores y cancelación | JSON inválido/cancelación no reemplazan la partida vigente |
| Progreso | Libras, conocimiento, prestigio, región, accesos, mapas, compras, equipo, especies, publicaciones, variantes, logros, misiones, Museo, comercio y trabajos pendientes |
| Tiempo legítimo | Registrar tiempo transcurrido y recibos/trabajos que concluyeron; no exigir igualdad de dinero si hubo ingresos legítimos |
| Pago único | Reabrir otra vez: no duplicar cobro, recibos, muestras o premios |
| Exportación posterior | Volver a exportar, validar y reimportar una copia en entorno aislado |
| Tacto y rendimiento | Navegar y usar filtros, volver, menús y botones; registrar latencias/problemas observados, sin copiar cifras de Chromium |
| Actualización con la misma firma | Cuando exista otro candidato válido, comprobar conservación por actualización normal y registrar el hash anterior |

Si solo existe el primer candidato permanente, la última prueba se registra como **no aplicable todavía**, con motivo; no como aprobada. Para una transición desde otra instalación permanente de igual certificado es obligatoria la actualización normal observada.

## Registro schema 2, únicamente después de observarlo

Copiar del manifiesto exacto: `version`, `versionCode`, `appId`, `workflowRunId`, `sourceCommit`, `certificateSha256`, `apkSha256`, `payloadSha256`; añadir `schema: 2`.

Registrar datos reales: `testedAt` en ISO 8601 con zona horaria, `device`, `androidVersion`, `webViewVersion`, `sourceVersion`, `previousCertificateSha256`, `migrationMode` (`same-certificate` o `different-certificate`), `externalBackupCopies` (al menos dos) y `notes` sin contenido privado de la partida.

Solo marcar true después de comprobar cada resultado: `physicalAndroid`, `portraitAndFullscreen`, `performanceReviewed`, `invalidImportPreserved`, `ownerAuthorizedTransition`, `backupValidatedBeforeTransition`, `roundtripValidatedBeforeTransition`, `nativeExport`, `nativeShare`, `nativeImportRestored`, `fileOrTextFallback`, `tenModules`, `fieldExplored`, `closedAndReopened`, `reopenedOffline`, `progressCompared`, `exportedAgain`, `noDuplicateRewards`, `touchReviewed`.

Con certificados distintos se requiere `manualReinstall: true` tras la autorización y respaldos. Con el mismo certificado se requiere `normalUpdatePreserved: true`. `sameCertificateUpdate` registra `status: passed` y `previousApkSha256` cuando la actualización se probó; únicamente para la primera transición desde otra firma puede usarse `status: not-applicable-first-permanent` con `reason` real que explique la falta de segundo candidato.

No completar estos campos con resultados supuestos ni incluir el JSON personal, contraseñas o almacenes privados. El verificador rechaza registros incompletos o ligados a otro APK, versión, run, commit o payload.

## Publicación posterior

Añadir los resultados reales a main sin cambiar recursos ni fuentes compilables. Ejecutar Publicar Android validado con el run y commit completos del candidato. Si cambió cualquier archivo incluido en el manifiesto del contenido, generar otro candidato y repetir las comprobaciones. El workflow vuelve a verificar y publica el mismo APK; no compila otro durante la publicación.
