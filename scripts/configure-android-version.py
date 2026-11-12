#!/usr/bin/env python3
"""Set the generated Capacitor APK version from the release package without changing its app ID."""
import json,re,sys
from pathlib import Path
version=json.loads(Path('package.json').read_text())['version']
match=re.fullmatch(r'(\d+)\.(\d+)\.(\d+)',version)
if not match:raise SystemExit('Expected a numeric release version')
major,minor,patch=map(int,match.groups())
if minor>=100 or patch>=100:raise SystemExit('Version exceeds the Android version-code layout')
code=major*10000+minor*100+patch
if code>2100000000:raise SystemExit('Android versionCode exceeds its supported range')
if '--print' in sys.argv:
 print(json.dumps({'versionName':version,'versionCode':code}));raise SystemExit(0)
p=Path('android/app/build.gradle');s=p.read_text()
s,n=re.subn(r'\bversionCode\s+\d+',f'versionCode {code}',s);assert n==1,'versionCode must occur once'
s,n=re.subn(r'\bversionName\s+"[^"]+"',f'versionName "{version}"',s);assert n==1,'versionName must occur once'
p.write_text(s);print(f'Android versionName={version}, versionCode={code}')
