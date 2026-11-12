# AND-05 · Firma y publicación preparadas

No se ha cambiado `docs/android/signing-certificate.json`: su SHA-256 sigue nulo. No se generan claves, no se usan certificados debug y no se leen valores de secretos remotos. El workflow manual exige main, valida identidad/versión/huella antes de firmar y comprueba privadamente el certificado DER del almacén antes de compilar. Si falta cualquiera de los cuatro secretos, falla indicando su nombre, sin imprimir valores.

Las dependencias se instalan con npm ci y el lockfile. `npm run release:verify` selecciona los controles de esta release sin fijar una versión anterior en el workflow. Se generan/sincronizan Capacitor, plugins, versión, portrait y pantalla completa; únicamente assembleRelease con firma permanente puede producir el candidato.

El candidato incluye un manifiesto que vincula el SHA-256 del APK, commit completo, run, versión, versionCode, paquete, certificado y hashes del contenido web y de las fuentes/configuración nativas. El verificador rechaza archivos web cambiados/ausentes/inesperados, ZIP duplicado, firma distinta o debug, versión/identidad equivocada y plugins ausentes. Los dos archivos Cordova vacíos generados por Capacitor son la única excepción documentada al conjunto exacto de www; no se admite código adicional en ellos.

La publicación exige el run y commit declarados y la evidencia física schema 2 del mismo manifiesto. Un commit posterior de documentación puede incorporar resultados; cambiar contenido compilable, lockfile, verificador o workflow Android invalida el candidato. Se consulta el origen real en GitHub y se vuelve a ejecutar apksigner/aapt sobre el artefacto descargado. No se recompila ni sobrescribe una release anterior. La etiqueta apunta al commit del candidato, no al posterior registro documental.

Los tests de guardas usan contenedores ZIP, descriptores y reportes **sintéticos**, no un APK firmado ni un dispositivo. Sus resultados acreditan rechazos y vínculos de la automatización; no acreditan firma, ejecución nativa o restauración real. El certificado público y la evidencia física reales siguen pendientes.

[Instrucciones privadas en Windows y Settings](../../README_ANDROID_FIRMA_PERMANENTE.md) · [Prueba física](prueba-fisica.md).
