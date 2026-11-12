"""Synthetic ZIP/report fixtures only. These tests do NOT build, sign or validate an actual APK/device."""
import unittest,tempfile,shutil,json,sys,zipfile,warnings,copy
from pathlib import Path
sys.path.insert(0,str(Path('scripts').resolve()))
import android_release as a
ROOT=Path('.').resolve();TEST_PIN='a'*64;SOURCE='b'*40
class Guards(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
  for folder in ['android-native','scripts']:shutil.copytree(ROOT/folder,self.root/folder)
  for name in ['package.json','package-lock.json','capacitor.config.json','.github/workflows/android-signed.yml','.github/workflows/android-publish.yml','docs/gm02/release-final/previous-apk.json']:
   dst=self.root/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/name,dst)
  (self.root/'docs/android').mkdir(parents=True);self.pin(TEST_PIN)
  (self.root/'www').mkdir();(self.root/'www/index.html').write_text('SIMULATED web fixture');(self.root/'www/sw.js').write_text('SIMULATED worker')
  self.entries={'assets/public/index.html':b'SIMULATED web fixture','assets/public/sw.js':b'SIMULATED worker','assets/public/cordova.js':b'','assets/public/cordova_plugins.js':b'','assets/capacitor.config.json':(self.root/'capacitor.config.json').read_bytes(),'assets/capacitor.plugins.json':json.dumps([{'classpath':'com.capacitorjs.plugins.filesystem.FilesystemPlugin'},{'classpath':'com.capacitorjs.plugins.share.SharePlugin'}]).encode(),'classes.dex':('SIMULATED descriptors only: L'+a.APP_ID.replace('.','/')+'/AtlasExportPlugin; L'+a.APP_ID.replace('.','/')+'/AtlasImportPlugin;').encode()}
  self.archive=self.root/'simulated-container.zip';self.pack()
  self.badging="package: name='%s' versionCode='34200' versionName='3.42.0'\n"%a.APP_ID
  self.signature='Verifies\nSigner #1 certificate DN: CN=SIMULATED UNIT FIXTURE\nSigner #1 certificate SHA-256 digest: '+TEST_PIN+'\n'
  self.run={'id':123,'status':'completed','conclusion':'success','path':'.github/workflows/android-signed.yml','event':'workflow_dispatch','head_branch':'main','head_sha':SOURCE,'repository':{'full_name':'pruizbohle/gran-atlas-naturaleza'},'head_repository':{'full_name':'pruizbohle/gran-atlas-naturaleza'}}
 def tearDown(self):self.temp.cleanup()
 def pin(self,value):(self.root/'docs/android/signing-certificate.json').write_text(json.dumps({'sha256':value}))
 def pack(self):
  with zipfile.ZipFile(self.archive,'w') as z:
   for k,v in self.entries.items():z.writestr(k,v)
 def verify(self):return a.verify_apk(self.archive,self.badging,self.signature,self.root)
 def manifest(self):return a.candidate_manifest(self.archive,123,SOURCE,self.root)
 def check(self,m):return a.verify_candidate(m,self.archive,self.run,SOURCE,self.root)
 def proof(self,m):
  p={k:m[k] for k in ['version','versionCode','appId','workflowRunId','sourceCommit','certificateSha256','apkSha256','payloadSha256']};p.update(schema=2,externalBackupCopies=2,testedAt='2000-01-01T00:00:00Z',device='SIMULATED unit fixture, not a device',androidVersion='SIMULATED',webViewVersion='SIMULATED',sourceVersion='3.28.0',notes='SIMULATED in-memory fixture; never physical evidence',previousCertificateSha256='c'*64,migrationMode='different-certificate',manualReinstall=True,sameCertificateUpdate={'status':'not-applicable-first-permanent','reason':'SIMULATED fixture'})
  for k in FLAGS:p[k]=True
  return p
 def test_missing_pin_stops(self):
  self.pin(None)
  with self.assertRaisesRegex(ValueError,'Pin the real'):self.verify()
 def test_malformed_pin_stops(self):
  for v in ['', 'not-a-certificate','a'*63,'a'*64+' extra','sha256:'+TEST_PIN]:
   self.pin(v)
   with self.assertRaises(ValueError):self.verify()
 def test_retired_debug_pin_stops(self):
  self.pin(a.read(self.root/'docs/gm02/release-final/previous-apk.json')['certificateSha256'])
  with self.assertRaisesRegex(ValueError,'retired debug'):self.verify()
 def test_synthetic_container_matches_expected_bytes(self):self.assertEqual(self.verify()['versionCode'],34200)
 def test_changed_web_file_stops(self):
  self.entries['assets/public/index.html']=b'changed';self.pack()
  with self.assertRaisesRegex(ValueError,'Changed web'):self.verify()
 def test_missing_web_file_stops(self):
  del self.entries['assets/public/sw.js'];self.pack()
  with self.assertRaisesRegex(ValueError,'Missing packaged'):self.verify()
 def test_extra_web_file_stops(self):
  self.entries['assets/public/foreign.js']=b'foreign';self.pack()
  with self.assertRaisesRegex(ValueError,'Unexpected packaged'):self.verify()
 def test_cordova_injection_stops(self):
  self.entries['assets/public/cordova.js']=b'foreign';self.pack()
  with self.assertRaisesRegex(ValueError,'Cordova code'):self.verify()
 def test_duplicate_zip_path_stops(self):
  with warnings.catch_warnings():
   warnings.simplefilter('ignore')
   with zipfile.ZipFile(self.archive,'a') as z:z.writestr('assets/public/index.html',b'duplicate')
  with self.assertRaisesRegex(ValueError,'Duplicate'):self.verify()
 def test_missing_share_plugin_stops(self):
  self.entries['assets/capacitor.plugins.json']=b'[]';self.pack()
  with self.assertRaisesRegex(ValueError,'native sharing'):self.verify()
 def test_missing_import_descriptor_stops(self):
  self.entries['classes.dex']=b'SIMULATED AtlasExportPlugin only';self.pack()
  with self.assertRaisesRegex(ValueError,'native Atlas'):self.verify()
 def test_wrong_packaged_identity_stops(self):
  self.entries['assets/capacitor.config.json']=json.dumps({'appId':'other','appName':'El Gran Atlas'}).encode();self.pack()
  with self.assertRaisesRegex(ValueError,'identity mismatch'):self.verify()
 def test_unsigned_report_stops(self):
  self.signature=self.signature.replace('Verifies','DOES NOT VERIFY')
  with self.assertRaisesRegex(ValueError,'apksigner'):self.verify()
 def test_debug_certificate_subject_stops(self):
  self.signature=self.signature.replace('SIMULATED UNIT FIXTURE','Android Debug')
  with self.assertRaisesRegex(ValueError,'debug signing'):self.verify()
 def test_other_certificate_stops(self):
  self.signature=self.signature.replace(TEST_PIN,'d'*64)
  with self.assertRaisesRegex(ValueError,'certificate does not match'):self.verify()
 def test_multiple_signers_stop(self):
  self.signature+='Signer #2 certificate SHA-256 digest: '+TEST_PIN+'\n'
  with self.assertRaisesRegex(ValueError,'certificate does not match'):self.verify()
 def test_manifest_binds_unchanged_payload(self):self.assertEqual(self.check(self.manifest())['sourceCommit'],SOURCE)
 def test_documentation_only_proof_commit_allowed(self):
  m=self.manifest();(self.root/'docs/physical-notes.md').write_text('Not actual proof, synthetic test');self.check(m)
 def test_changed_binary_stops(self):
  m=self.manifest();self.archive.write_bytes(self.archive.read_bytes()+b'changed')
  with self.assertRaisesRegex(ValueError,'manifest'):self.check(m)
 def test_changed_native_source_stops(self):
  m=self.manifest();(self.root/'android-native/AtlasImportPlugin.java').write_text('changed')
  with self.assertRaisesRegex(ValueError,'manifest'):self.check(m)
 def test_changed_dependency_lock_stops(self):
  m=self.manifest();(self.root/'package-lock.json').write_text('{}')
  with self.assertRaisesRegex(ValueError,'manifest'):self.check(m)
 def test_missing_physical_evidence_stops(self):
  with self.assertRaisesRegex(ValueError,'schema'):a.verify_physical({},self.manifest())
 def test_simulated_physical_schema_in_memory_only(self):
  m=self.manifest();a.verify_physical(self.proof(m),m)
 def test_wrong_proof_binary_stops(self):
  m=self.manifest();p=self.proof(m);p['apkSha256']='f'*64
  with self.assertRaisesRegex(ValueError,'apkSha256'):a.verify_physical(p,m)
 def test_wrong_proof_commit_stops(self):
  m=self.manifest();p=self.proof(m);p['sourceCommit']='f'*40
  with self.assertRaisesRegex(ValueError,'sourceCommit'):a.verify_physical(p,m)
 def test_same_certificate_requires_normal_update(self):
  m=self.manifest();p=self.proof(m);p.update(migrationMode='same-certificate',previousCertificateSha256=TEST_PIN)
  with self.assertRaisesRegex(ValueError,'Same-certificate'):a.verify_physical(p,m)
 def test_two_external_copies_required(self):
  m=self.manifest();p=self.proof(m);p['externalBackupCopies']=1
  with self.assertRaisesRegex(ValueError,'Two external'):a.verify_physical(p,m)
FLAGS=['physicalAndroid','ownerAuthorizedTransition','backupValidatedBeforeTransition','roundtripValidatedBeforeTransition','nativeExport','nativeShare','nativeImportRestored','fileOrTextFallback','tenModules','fieldExplored','closedAndReopened','reopenedOffline','progressCompared','exportedAgain','noDuplicateRewards','touchReviewed']
def missing_flag(flag):
 def test(self):
  m=self.manifest();p=self.proof(m);p[flag]=False
  with self.assertRaisesRegex(ValueError,'Missing observed'):a.verify_physical(p,m)
 return test
for flag in FLAGS:setattr(Guards,'test_physical_requires_'+flag,missing_flag(flag))
def wrong_run(key,value):
 def test(self):
  m=self.manifest();self.run[key]=value
  with self.assertRaises(ValueError):self.check(m)
 return test
for key,value in [('head_sha','e'*40),('head_branch','feature'),('conclusion','failure'),('event','push'),('path','.github/workflows/android-debug.yml'),('repository',{'full_name':'foreign/repo'}),('id',999)]:setattr(Guards,'test_wrong_candidate_'+key,wrong_run(key,value))
def bad_badging(field,value):
 def test(self):
  self.badging=self.badging.replace(field,value)
  with self.assertRaises(ValueError):self.verify()
 return test
for key,old,new in [('identity',a.APP_ID,'foreign.id'),('version','3.42.0','3.41.0'),('code','34200','34100'),('debuggable','\n','\napplication-debuggable\n')]:setattr(Guards,'test_bad_badging_'+key,bad_badging(old,new))
if __name__=='__main__':unittest.main()
