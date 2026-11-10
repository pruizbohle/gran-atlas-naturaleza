#!/usr/bin/env python3
"""Validate the built APK against the exact release files, native plugins and version."""
import hashlib,json,re,sys,zipfile
from pathlib import Path
apk,badging,signature=map(Path,sys.argv[1:]);pkg=json.loads(Path('package.json').read_text());cap=json.loads(Path('capacitor.config.json').read_text());version=pkg['version'];major,minor,patch=map(int,version.split('.'));code=major*10000+minor*100+patch
text=badging.read_text()
for field,value in [('name',cap['appId']),('versionName',version),('versionCode',str(code))]:
 assert re.search(r"\b"+field+"='"+re.escape(value)+"'",text),(field,value)
with zipfile.ZipFile(apk) as z:
 for p in Path('www').rglob('*'):
  if p.is_file():
   name='assets/public/'+p.relative_to('www').as_posix()
   assert hashlib.sha256(z.read(name)).digest()==hashlib.sha256(p.read_bytes()).digest(),name
 plugins=json.loads(z.read('assets/capacitor.plugins.json'))
 names={p['classpath'].split('.')[-1] for p in plugins}
 assert {'FilesystemPlugin','SharePlugin'}<=names,names
 dex=b''.join(z.read(n) for n in z.namelist() if re.fullmatch(r'classes\d*\.dex',n))
 assert b'AtlasExportPlugin' in dex and b'AtlasImportPlugin' in dex,'Missing native save plugins'
print(f'APK identity, version {version}/{code}, all web resources and native save plugins verified.')

pin=json.loads(Path('docs/android/signing-certificate.json').read_text())
expected=re.sub('[^0-9a-f]','',(pin.get('sha256') or '').lower())
assert len(expected)==64, 'Pin the permanent public certificate SHA-256 in docs/android/signing-certificate.json before building.'
certs=re.findall(r'certificate SHA-256 digest: ([0-9a-fA-F]+)',signature.read_text())
assert len(certs)==1 and certs[0].lower()==expected, 'APK does not use the pinned permanent signing certificate.'
previous=json.loads(Path('docs/gm02/release-final/previous-apk.json').read_text())
assert expected!=previous['certificateSha256'], 'The old debug certificate is retired.'
print('APK uses the pinned permanent certificate; migration from the old debug installation requires manual backup/reinstall/restore.')
