# Publicación verificada · El Gran Atlas 3.43.0

La integración y publicación fueron autorizadas por el usuario. El código quedó en `main`, commit `f867e7a4683560f598bd50a714f9fa9c73a3630f`.

- [Juego](https://pruizbohle.github.io/gran-atlas-naturaleza/)
- [Actualizar conservando la partida](https://pruizbohle.github.io/gran-atlas-naturaleza/actualizar-v3430.html)
- [Despliegue Pages correcto](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/runs/43903939247)

El servidor respondió 200 con versión 3.43.0. Los **196 archivos públicos coinciden por SHA-256** con el manifiesto validado. La suite ejecutó **896 pruebas Node y 61 Python**, incluyendo regresiones repetidas; todas pasaron localmente y el workflow de Pages finalizó correctamente.

El botón **← Volver al Campamento** está integrado en las cinco instalaciones. El perfil, las advertencias de almacenamiento y los respaldos se verificaron en navegador local a 320, 360, 390, 412 y 1280 px, con los mismos archivos publicados.

La comprobación visual desde Chromium contra el sitio público quedó bloqueada por `net::ERR_CERT_AUTHORITY_INVALID` en el entorno administrado. No se desactivó la validación de certificados. La comprobación HTTPS mediante la confianza del sistema y la comparación de los 196 archivos sí se completaron. El intento de preparar una actualización real desde la instalación pública anterior quedó impedido por la misma limitación; no se presenta como una prueba realizada.

[Hashes públicos](published-report.json) · [Estado de comprobación visual remota](published-browser.json) · [Validación](validation-report.json) · [Navegador local](production-report.json)

No se generó ni publicó una APK. Las reglas de firma y publicación Android permanecen intactas. Este registro solo añade evidencia de la publicación; no cambia los archivos web desplegados.
