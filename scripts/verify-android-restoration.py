#!/usr/bin/env python3
"""Refuse public APK publication without device-restoration evidence for this exact binary."""
import hashlib,json,re,sys
from pathlib import Path
apk,run_id=Path(sys.argv[1]),int(sys.argv[2])
pin=json.loads(Path('docs/android/signing-certificate.json').read_text())
proof=json.loads(Path('docs/android/restoration-validation.json').read_text())
assert proof['version']==json.loads(Path('package.json').read_text())['version']
assert proof['workflowRunId']==run_id
assert proof['apkSha256']==hashlib.sha256(apk.read_bytes()).hexdigest()
assert proof['certificateSha256']==re.sub('[^0-9a-f]','',pin['sha256'].lower())
for field in ['physicalAndroid','backupExportedFrom328','backupValidatedBeforeUninstall','manualReinstall','nativeImportRestored','progressCompared','reopenedOffline','exportedAgain']:
 assert proof.get(field) is True, 'Missing verified device migration: '+field
assert proof.get('testedAt') and proof.get('device') and proof.get('notes'), 'Record device, date and observed comparison without personal save content'
print('Restoration evidence matches the exact candidate APK, run and permanent certificate.')
