#!/usr/bin/env python3
"""Configure the generated project, never build, sign, install or uninstall."""
import json,re,sys,shutil,xml.etree.ElementTree as ET
from pathlib import Path
cap=json.loads(Path('capacitor.config.json').read_text())
assert cap['appId']=='com.elgranatlas.naturaleza.beta314'
assert cap['appName']=='El Gran Atlas'
ns='http://schemas.android.com/apk/res/android';ET.register_namespace('android',ns)
p=Path('android/app/src/main/AndroidManifest.xml');tree=ET.parse(p)
activity=tree.find("./application/activity[@{%s}name='.MainActivity']"%ns)
assert activity is not None
activity.set('{'+ns+'}screenOrientation','portrait');tree.write(p,encoding='utf-8',xml_declaration=True)
p=next(Path('android/app/src/main/java').rglob('MainActivity.java'));s=p.read_text()
if '// AND3420 immersive' not in s:
 assert 'void onWindowFocusChanged(' not in s,'Revisar la implementación existente de pantalla completa'
 i=s.rfind('}')
 s=s[:i]+'''    // AND3420 immersive: system bars remain available with an explicit swipe.
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            androidx.core.view.WindowInsetsControllerCompat bars =
                androidx.core.view.WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
            bars.setSystemBarsBehavior(androidx.core.view.WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            bars.hide(androidx.core.view.WindowInsetsCompat.Type.systemBars());
        }
    }
'''+s[i:];p.write_text(s)
if '--signing' in sys.argv:
 shutil.copyfile('android-native/atlas-signing.gradle','android/app/atlas-signing.gradle')
 p=Path('android/app/build.gradle');s=p.read_text();line="apply from: 'atlas-signing.gradle'"
 if line not in s:p.write_text(s+'\n'+line+'\n')
print('Identidad, orientación vertical y pantalla completa configuradas; validación física pendiente.')
