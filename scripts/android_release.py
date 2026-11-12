"""Pure Android verification: no signing, key generation or installation."""
import hashlib,json,re,zipfile
from pathlib import Path
APP_ID='com.elgranatlas.naturaleza.beta314'
def require(ok,message):
 if not ok:raise ValueError(message)
def sha(data):return hashlib.sha256(data).hexdigest()
def read(path):return json.loads(Path(path).read_text())
def project(root=Path('.')):
 pkg=read(root/'package.json');cap=read(root/'capacitor.config.json');v=pkg['version']
 require(re.fullmatch(r'\d+\.\d+\.\d+',v),'Invalid numeric release version')
 major,minor,patch=map(int,v.split('.'));code=major*10000+minor*100+patch
 require(minor<100 and patch<100 and code<=2100000000,'Invalid Android versionCode')
 require(cap['appId']==APP_ID,'Android identity changed');require(cap['appName']=='El Gran Atlas','Visible Android name changed')
 return {'version':v,'versionCode':code,'appId':APP_ID}
def fingerprint(value):
 require(isinstance(value,str) and bool(re.fullmatch(r'(?:[0-9a-fA-F]{64}|(?:[0-9a-fA-F]{2}:){31}[0-9a-fA-F]{2})',value)),'Pin the real public permanent certificate SHA-256 before signing')
 return value.replace(':','').lower()
def certificate(root=Path('.')):
 value=fingerprint(read(root/'docs/android/signing-certificate.json').get('sha256'))
 require(value!=read(root/'docs/gm02/release-final/previous-apk.json')['certificateSha256'],'The retired debug certificate is forbidden');return value
def web_files(root=Path('.')):return {p.relative_to(root/'www').as_posix():sha(p.read_bytes()) for p in sorted((root/'www').rglob('*')) if p.is_file()}
def payload_files(root=Path('.')):
 paths=[p for folder in ['www','android-native'] for p in (root/folder).rglob('*') if p.is_file()]
 paths += [root/p for p in ['package.json','package-lock.json','capacitor.config.json','.github/workflows/android-signed.yml','scripts/android_release.py','scripts/configure-android-version.py','scripts/configure-android-project.py','scripts/install-atlas-export.py','scripts/verify-android-release.py','scripts/create-android-candidate.py','scripts/verify-android-candidate.py','scripts/verify-android-restoration.py','.github/workflows/android-publish.yml']]
 return {p.relative_to(root).as_posix():sha(p.read_bytes()) for p in sorted(paths)}
def payload_hash(files):return sha(json.dumps(files,sort_keys=True,separators=(',',':')).encode())
def verify_apk(apk,badging,signature,root=Path('.')):
 info=project(root);pin=certificate(root);packages=re.findall(r'^package: (.+)$',badging,re.M);require(len(packages)==1,'Expected one Android package')
 for field,value in [('name',info['appId']),('versionName',info['version']),('versionCode',str(info['versionCode']))]:require(bool(re.search(r"\b"+field+"='"+re.escape(value)+"'",packages[0])),'Wrong '+field)
 require('application-debuggable' not in badging,'Debuggable APK is forbidden');require('Verifies' in signature,'Missing successful apksigner verification');require(not re.search(r'Android\s*Debug',signature,re.I),'Temporary debug signing is forbidden')
 certs=re.findall(r'^Signer #\d+ certificate SHA-256 digest: ([0-9a-fA-F]+)\s*$',signature,re.M)
 require(len(certs)==1 and fingerprint(certs[0])==pin,'APK certificate does not match the pinned permanent certificate');files=web_files(root)
 with zipfile.ZipFile(apk) as z:
  names=z.namelist();require(len(names)==len(set(names)),'Duplicate ZIP paths')
  actual={n[len('assets/public/'):] for n in names if n.startswith('assets/public/') and not n.endswith('/')};extra=actual-set(files)
  require(extra<={'cordova.js','cordova_plugins.js'},'Unexpected packaged web files');require(set(files)<=actual,'Missing packaged web files')
  for name,digest in files.items():require(sha(z.read('assets/public/'+name))==digest,'Changed web file: '+name)
  for name in extra:require(z.read('assets/public/'+name)==b'','Unexpected Cordova code: '+name)
  cap=json.loads(z.read('assets/capacitor.config.json'));require(cap['appId']==APP_ID and cap['appName']=='El Gran Atlas','Packaged Capacitor identity mismatch')
  plugins=json.loads(z.read('assets/capacitor.plugins.json'));require({p['classpath'] for p in plugins}=={'com.capacitorjs.plugins.filesystem.FilesystemPlugin','com.capacitorjs.plugins.share.SharePlugin'},'Missing or unexpected native sharing plugins')
  dex=b''.join(z.read(n) for n in names if re.fullmatch(r'classes\d*\.dex',n))
  for name in ['AtlasExport','AtlasImport']:require(('L'+APP_ID.replace('.','/')+'/'+name+'Plugin;').encode() in dex,'Missing native '+name+' descriptor')
 return {**info,'certificateSha256':pin,'apkSha256':sha(Path(apk).read_bytes()),'webFiles':files}
def candidate_manifest(apk,run_id,source,root=Path('.')):
 require(type(run_id) is int and run_id>0,'Invalid candidate run ID');require(bool(re.fullmatch('[0-9a-f]{40}',source)),'Expected the full candidate source commit');files=payload_files(root)
 return {'schema':2,**project(root),'workflowRunId':run_id,'sourceCommit':source,'certificateSha256':certificate(root),'apkSha256':sha(Path(apk).read_bytes()),'webFiles':web_files(root),'payloadFiles':files,'payloadSha256':payload_hash(files)}
def verify_origin(run,source,repo='pruizbohle/gran-atlas-naturaleza'):
 require(bool(re.fullmatch('[0-9a-f]{40}',source)),'Expected full candidate source commit');require(run.get('status')=='completed' and run.get('conclusion')=='success','Candidate run did not succeed')
 require(run.get('path')=='.github/workflows/android-signed.yml' and run.get('event')=='workflow_dispatch','Wrong candidate workflow/event');require(run.get('head_branch')=='main' and run.get('head_sha')==source,'Candidate source commit or branch mismatch')
 require(run.get('repository',{}).get('full_name')==repo and run.get('head_repository',{}).get('full_name')==repo,'Wrong candidate repository')
def verify_candidate(manifest,apk,run,source,root=Path('.')):
 verify_origin(run,source);expected=candidate_manifest(apk,run['id'],source,root);require(manifest==expected,'Candidate manifest, version, commit, APK or payload changed; build and test a new candidate');return expected
def verify_physical(proof,manifest):
 require(proof.get('schema')==2,'Missing schema 2 physical evidence')
 for key in ['version','versionCode','appId','workflowRunId','sourceCommit','certificateSha256','apkSha256','payloadSha256']:require(proof.get(key)==manifest[key],'Physical proof mismatch: '+key)
 for key in ['physicalAndroid','ownerAuthorizedTransition','backupValidatedBeforeTransition','roundtripValidatedBeforeTransition','nativeExport','nativeShare','nativeImportRestored','fileOrTextFallback','tenModules','fieldExplored','closedAndReopened','reopenedOffline','progressCompared','exportedAgain','noDuplicateRewards','touchReviewed']:require(proof.get(key) is True,'Missing observed device result: '+key)
 require(type(proof.get('externalBackupCopies')) is int and proof['externalBackupCopies']>=2,'Two external backup copies required')
 require(isinstance(proof.get('testedAt'),str) and bool(re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:Z|[+-]\d\d:\d\d)',proof['testedAt'])),'Record real test time with timezone')
 for key in ['device','androidVersion','webViewVersion','sourceVersion','notes']:require(isinstance(proof.get(key),str) and bool(proof[key].strip()),'Missing observed metadata: '+key)
 previous=fingerprint(proof.get('previousCertificateSha256'));mode=proof.get('migrationMode');update=proof.get('sameCertificateUpdate',{})
 if mode=='same-certificate':
  require(previous==manifest['certificateSha256'] and proof.get('normalUpdatePreserved') is True,'Same-certificate update was not verified');require(update.get('status')=='passed','Record the actual same-certificate update')
 elif mode=='different-certificate':
  require(previous!=manifest['certificateSha256'] and proof.get('manualReinstall') is True,'Different-certificate migration requires authorized manual restoration');require(update.get('status') in ['passed','not-applicable-first-permanent'],'Record the same-certificate update status')
 else:raise ValueError('Record the real migration mode')
 if update.get('status')=='passed':require(bool(re.fullmatch('[0-9a-f]{64}',update.get('previousApkSha256',''))),'Record the actual preceding APK hash')
 else:require(bool(update.get('reason')),'Explain why no second permanent candidate exists')
