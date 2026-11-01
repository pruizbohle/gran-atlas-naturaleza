#!/usr/bin/env python3
"""Instala el plugin local de guardado SAF tras npx cap sync android."""
from pathlib import Path
import re

roots=list(Path("android/app/src/main/java").rglob("MainActivity.java"))
if len(roots)!=1:
    raise SystemExit(f"Se esperaba una MainActivity y se encontraron {len(roots)}")
main=roots[0]
body=main.read_text(encoding="utf-8")
match=re.search(r"^package\s+([\w.]+);",body,re.M)
if not match:
    raise SystemExit("No se encontró el paquete de MainActivity")
source=Path("android-native/AtlasExportPlugin.java").read_text(encoding="utf-8")
source=source.replace("__PACKAGE__",match.group(1))
(main.parent/"AtlasExportPlugin.java").write_text(source,encoding="utf-8")
marker="public class MainActivity extends BridgeActivity {"
if marker not in body:
    raise SystemExit("No se encontró la clase MainActivity")
if "registerPlugin(AtlasExportPlugin.class)" not in body:
    body=body.replace(marker,marker+"""
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(AtlasExportPlugin.class);
        super.onCreate(savedInstanceState);
    }
""",1)
    main.write_text(body,encoding="utf-8")
print("AtlasExportPlugin integrado en",main)
