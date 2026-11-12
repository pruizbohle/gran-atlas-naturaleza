# AND-02 · Configuración nativa

Instalación real con npm ci: Capacitor core/android/cli 7.6.10, Filesystem 7.1.9 y Share 7.0.4. package-lock.json fija el árbol y sus integridades; no se usa npm install durante la construcción del candidato. Java local 21.0.13. El proyecto Android se generó y sincronizó sin compilar ni firmar. Capacitor declara minSdk 23 y compile/targetSdk 35.

Se conserva com.elgranatlas.naturaleza.beta314 y se utiliza el nombre visible El Gran Atlas. El script existente, ejecutado realmente sobre build.gradle generado, configura versionName 3.42.0 y versionCode 34200. El instalador registra ambos plugins nativos una sola vez, incluso si solo faltaba AtlasImport. La configuración idempotente fija portrait y prepara pantalla completa con barras recuperables mediante gesto. Su apariencia física sigue pendiente.

Cuatro pruebas automatizadas comprueban identidad/versión, reparación e idempotencia de plugins, orientación/pantalla completa sin firma automática y correspondencia de versiones del lockfile. Generar fuentes no acredita una compilación APK ni una instalación física. El proyecto generado está excluido de Git; se conservan scripts, plugins y lockfile reproducibles.
