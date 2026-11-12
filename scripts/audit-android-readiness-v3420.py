#!/usr/bin/env python3
"""Report only observed preparation; never build, sign or infer a physical test."""
import json,shutil
from pathlib import Path
from android_release import project,certificate,read
info=project();pin=False
try:certificate();pin=True
except ValueError:pass
installed={}
for name in ['core','android','cli','filesystem','share']:
 p=Path('node_modules/@capacitor')/name/'package.json';installed[name]=read(p)['version'] if p.exists() else None
report={**info,'state':'Android preparado, pendiente de certificado y validación física','permanentPublicCertificatePinned':pin,'remoteSigningSecrets':'not inspected; configure the four named secrets in GitHub Settings','nativeProjectGeneratedLocally':Path('android/app/build.gradle').exists(),'installedCapacitor':installed,'javaRequirement':21,'minSdk':23,'compileSdk':35,'targetSdk':35,'adbInstalled':bool(shutil.which('adb')),'physicalDeviceTestPerformed':False,'candidateWorkflowDispatched':False,'apkCompiled':False,'apkSignatureVerified':False,'apkPublished':False,'actualRestorationEvidencePresent':Path('docs/android/restoration-validation.json').exists(),'pending':['Owner pins the real public permanent certificate SHA-256','Owner configures the four signing secrets privately in GitHub Actions','Generate a candidate from main only after those prerequisites','Owner authorizes any certificate transition after validating two external backups','Record real device results for the exact candidate manifest, hash, run and source commit','Publish the same artifact only after all gates pass']}
Path('docs/and3420').mkdir(parents=True,exist_ok=True);Path('docs/and3420/android-readiness.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
