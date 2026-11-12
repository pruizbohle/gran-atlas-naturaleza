# AND-06 · Candidato no generado

**Estado observado: Android preparado; candidato firmado pendiente.** La huella pública permanente sigue nula. No se han inspeccionado los secretos remotos ni ejecutado el workflow de firma. No hay APK 3.42.0 compilado, firma real verificada, hash de un candidato real ni evidencia física. Los ZIP de tests no son APK y no se distribuyen.

Acciones concretas del propietario:

1. Si ya tiene un almacén permanente, reutilizarlo y comprobar su certificado público con keytool. Si nunca se creó uno, seguir el procedimiento privado Windows del [README de firma](../../README_ANDROID_FIRMA_PERMANENTE.md); no generar otra clave por versión ni introducirla en el repositorio.
2. Registrar solo la huella SHA-256 pública real en `docs/android/signing-certificate.json`, mediante un commit de main. No es el hash del archivo jks. Puede comunicarse esa huella pública; no se requieren claves o contraseñas en el chat.
3. Configurar privadamente en [Settings → Secrets and variables → Actions](https://github.com/pruizbohle/gran-atlas-naturaleza/settings/secrets/actions): `ATLAS_ANDROID_KEYSTORE_BASE64`, `ATLAS_ANDROID_STORE_PASSWORD`, `ATLAS_ANDROID_KEY_ALIAS`, `ATLAS_ANDROID_KEY_PASSWORD`. No imprimir ni compartir sus valores.
4. Solo después, ejecutar [Android APK firmado · candidato de validación](https://github.com/pruizbohle/gran-atlas-naturaleza/actions/workflows/android-signed.yml) desde main. La ejecución debe pasar y producir `Atlas-Android-candidato-<run ID>`.
5. Descargar ese artefacto y conservar APK, manifiesto y reportes juntos. Completar la prueba física autorizada del candidato exacto; aún no es una distribución estable.

La web se publica independientemente. No se ha sustituido la firma ni se ha pedido desinstalar una aplicación con progreso.
