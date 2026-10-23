# Publicar El Gran Atlas en GitHub Pages

1. En GitHub crea un repositorio **public** llamado `gran-atlas-naturaleza` (sin README inicial).
2. Descomprime este paquete y abre la carpeta `gran-atlas-github-pages` en VS Code.
3. Abre una terminal en VS Code (Terminal > New Terminal) y ejecuta:

```powershell
git init
git add .
git commit -m "El Gran Atlas v0.2"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/gran-atlas-naturaleza.git
git push -u origin main
```

Sustituye TU_USUARIO por tu usuario de GitHub. Si Git pide autenticación, sigue el inicio de sesión del navegador. No compartas tokens o contraseñas.

4. Ve a Settings > Pages > Build and deployment > Source > GitHub Actions.
5. En Actions revisa que el flujo `Publicar El Gran Atlas` esté verde.
6. Abre `https://TU_USUARIO.github.io/gran-atlas-naturaleza/`.

Nota: el progreso actual se guarda por navegador/dispositivo y NO se sincroniza entre ellos. GitHub Pages publica el juego en todos los dispositivos, no las partidas.
