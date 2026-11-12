#!/usr/bin/env python3
"""Verify generated sources and copied assets; this is NOT APK/device validation."""
import json,re,sys,xml.etree.ElementTree as ET
from pathlib import Path
from android_release import project,web_files,sha,require
info=project();base=Path('android/app/src/main');gradle=Path('android/app/build.gradle').read_text()
for key,value in [('applicationId','"'+info['appId']+'"'),('versionName','"'+info['version']+'"'),('versionCode',str(info['versionCode']))]:require(bool(re.search(r'\b'+key+r'\s+'+re.escape(value)+r'(?:\s|$)',gradle)),'Generated '+key+' mismatch')
files=web_files();actual={p.relative_to(base/'assets/public').as_posix() for p in (base/'assets/public').rglob('*') if p.is_file()}
require(set(files)<=actual,'Generated web files missing');require(actual-set(files)<={'cordova.js','cordova_plugins.js'},'Unexpected generated web files')
for name,digest in files.items():require(sha((base/'assets/public'/name).read_bytes())==digest,'Generated web file changed: '+name)
for name in actual-set(files):require((base/'assets/public'/name).read_bytes()==b'','Unexpected generated Cordova code')
ns='http://schemas.android.com/apk/res/android';activity=ET.parse(base/'AndroidManifest.xml').find("./application/activity[@{%s}name='.MainActivity']"%ns);require(activity is not None and activity.get('{'+ns+'}screenOrientation')=='portrait','Portrait missing')
java=base/'java'/info['appId'].replace('.','/');main=(java/'MainActivity.java').read_text()
for name in ['AtlasExport','AtlasImport']:
 require(main.count('registerPlugin('+name+'Plugin.class)')==1,'Native plugin registration missing/duplicate')
 require((java/(name+'Plugin.java')).read_text()==Path('android-native/'+name+'Plugin.java').read_text().replace('__PACKAGE__',info['appId']),'Generated native source mismatch')
require('WindowInsetsCompat.Type.systemBars()' in main,'Fullscreen setup missing')
strings=ET.parse(base/'res/values/strings.xml');require(strings.find("string[@name='app_name']").text=='El Gran Atlas','Generated visible app name mismatch')
plugins=json.loads((base/'assets/capacitor.plugins.json').read_text());require({p['pkg'] for p in plugins}=={'@capacitor/filesystem','@capacitor/share'},'Native sharing plugins missing')
report={**info,'webFilesVerified':len(files),'emptyCordovaBridgeFiles':len(actual-set(files)),'nativePluginsRegistered':True,'portraitConfigured':True,'fullscreenSourceConfigured':True,'generatedProjectOnly':True,'apkCompiled':False,'physicalAndroid':False}
if len(sys.argv)>1:Path(sys.argv[1]).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
