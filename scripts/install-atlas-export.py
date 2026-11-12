#!/usr/bin/env python3
"""Instala el plugin local de guardado SAF tras npx cap sync android."""
from pathlib import Path
import re,json

roots=list(Path("android/app/src/main/java").rglob("MainActivity.java"))
if len(roots)!=1:
    raise SystemExit(f"Se esperaba una MainActivity y se encontraron {len(roots)}")
main=roots[0]
body=main.read_text(encoding="utf-8")
match=re.search(r"^package\s+([\w.]+);",body,re.M)
if not match:
    raise SystemExit("No se encontró el paquete de MainActivity")
if match.group(1)!=json.loads(Path('capacitor.config.json').read_text())['appId']:
    raise SystemExit('La MainActivity no usa la identidad Android configurada')
source=Path("android-native/AtlasExportPlugin.java").read_text(encoding="utf-8")
source=source.replace("__PACKAGE__",match.group(1))
(main.parent/"AtlasExportPlugin.java").write_text(source,encoding="utf-8")
import_source=Path("android-native/AtlasImportPlugin.java").read_text(encoding="utf-8")
(main.parent/"AtlasImportPlugin.java").write_text(import_source.replace("__PACKAGE__",match.group(1)),encoding="utf-8")
marker="public class MainActivity extends BridgeActivity {"
if marker not in body:
    raise SystemExit("No se encontró la clase MainActivity")
missing=[name for name in ['AtlasExport','AtlasImport'] if 'registerPlugin('+name+'Plugin.class)' not in body]
if missing:
    lines=''.join('        registerPlugin('+name+'Plugin.class);\n' for name in missing)
    if 'super.onCreate(savedInstanceState);' in body:
        body=body.replace('        super.onCreate(savedInstanceState);',lines+'        super.onCreate(savedInstanceState);',1)
    elif 'void onCreate(' in body:
        raise SystemExit('Revisar onCreate antes de instalar los plugins: no se encontró super.onCreate')
    else:
        body=body.replace(marker,marker+"""
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
"""+lines+"""        super.onCreate(savedInstanceState);
    }
""",1)
    main.write_text(body,encoding="utf-8")
for name in ['AtlasExport','AtlasImport']:
    assert body.count('registerPlugin('+name+'Plugin.class)')==1,'Registro nativo duplicado o ausente'
print("AtlasExport y AtlasImport integrados en",main)
