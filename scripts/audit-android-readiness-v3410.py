#!/usr/bin/env python3
"""Read-only audit: no keystore, build, signing, install or publication."""
import json,re,shutil
from pathlib import Path
pin=json.loads(Path('docs/android/signing-certificate.json').read_text())
config=json.loads(Path('capacitor.config.json').read_text())
signed=Path('.github/workflows/android-signed.yml').read_text()
publish=Path('.github/workflows/android-publish.yml').read_text()
verify=Path('scripts/verify-android-release.py').read_text()
restore=Path('scripts/verify-android-restoration.py').read_text()
assert config['appId']=='com.elgranatlas.naturaleza.beta314'
assert 'workflow_dispatch:' in signed and 'workflow_dispatch:' in publish
assert signed.index('Fijar la huella')<signed.index('assembleRelease')
assert 'scripts/validate-experience-v3410.cjs' in signed
assert 'scripts/verify-android-release.py' in publish and 'scripts/verify-android-restoration.py' in publish
assert 'actions/download-artifact@v4' in publish and 'assembleRelease' not in publish
assert all(x in verify for x in ['AtlasExport','AtlasImport','sha256','public/'])
assert all(x in restore for x in ['apkSha256','workflowRunId','certificateSha256','physicalAndroid','backupValidatedBeforeUninstall','progressCompared','reopenedOffline'])
report={'targetVersion':'3.41.0','appId':config['appId'],'permanentCertificatePinned':bool(re.fullmatch(r'[0-9a-fA-F:]{64,95}',pin.get('sha256') or '')),'certificateValueChanged':False,'localAdbAvailable':bool(shutil.which('adb')),'physicalCandidateTestPerformed':False,'restorationEvidencePresent':Path('docs/android/restoration-validation.json').exists(),'remoteSigningSecrets':'not inspected; local environment reports no configured secrets','nativeExportImportSourcesPresent':all(Path('android-native/'+name+'Plugin.java').exists() for name in ['AtlasExport','AtlasImport']),'candidateWorkflowManualAndPinGated':True,'publicationRequiresSameArtifactAndPhysicalProof':True,'apkBuilt':False,'apkPublished':False,'status':'pending permanent certificate pin and physical exact-candidate restoration evidence'}
Path('docs/ux3410/android').mkdir(parents=True,exist_ok=True)
Path('docs/ux3410/android/report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
