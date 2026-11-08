"""Verify a downloaded Capacitor APK without installing it or requiring Android SDK."""
import hashlib,json,struct,sys,zipfile
from pathlib import Path
apk=Path(sys.argv[1]);out=Path(sys.argv[2]) if len(sys.argv)>2 else None
with zipfile.ZipFile(apk) as z:
 data=z.read('AndroidManifest.xml');strings=[];manifest={};off=8
 while off<len(data):
  kind,header,size=struct.unpack_from('<HHI',data,off)
  if not size:raise ValueError('Invalid binary XML chunk')
  if kind==1:
   count,styles,flags,start,styleStart=struct.unpack_from('<5I',data,off+8)
   def length(pos,utf8):
    v=data[pos] if utf8 else struct.unpack_from('<H',data,pos)[0];step=1 if utf8 else 2;flag=0x80 if utf8 else 0x8000
    if v&flag:return ((v&~flag)<<(8 if utf8 else 16))+(data[pos+step] if utf8 else struct.unpack_from('<H',data,pos+step)[0]),pos+step*2
    return v,pos+step
   for i in range(count):
    pos=off+start+struct.unpack_from('<I',data,off+header+4*i)[0];utf8=bool(flags&0x100)
    n,pos=length(pos,utf8)
    if utf8:n,pos=length(pos,True)
    strings.append(data[pos:pos+n*(1 if utf8 else 2)].decode('utf-8' if utf8 else 'utf-16le'))
  elif kind==0x102:
   ns,name,attrStart,attrSize,attrCount=struct.unpack_from('<IIHHH',data,off+16)
   if strings[name]=='manifest':
    for i in range(attrCount):
     at=off+16+attrStart+i*attrSize;ns,name,raw=struct.unpack_from('<III',data,at);typ=data[at+15];value=struct.unpack_from('<I',data,at+16)[0]
     manifest[strings[name]]=strings[raw] if raw!=0xffffffff else strings[value] if typ==3 else value
  off+=size
 assert manifest['package']=='com.elgranatlas.naturaleza.beta314',manifest
 assert manifest['versionName']=='3.23.1',manifest
 assert int(manifest['versionCode'])==32301,manifest
 assets=[]
 for p in sorted(Path('www').rglob('*')):
  if p.is_file():
   name='assets/public/'+p.relative_to('www').as_posix();packed=z.read(name);assert packed==p.read_bytes(),str(p);assets.append(name)
 dex=b''.join(z.read(n) for n in z.namelist() if n.endswith('.dex'))
 assert b'AtlasExport' in dex and b'AtlasImport' in dex,'Missing native backup plugins'
 report={'version':'3.23.1','manifest':manifest,'apkBytes':apk.stat().st_size,'sha256':hashlib.sha256(apk.read_bytes()).hexdigest(),'allWebFilesMatchProduction':True,'webFilesVerified':len(assets),'nativeImportExportPluginsPresent':True,'physicalDeviceInstallationTested':False,'signing':'Debug build; compatibility with an earlier installation also requires the same signing key.'}
 if out:out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(report,ensure_ascii=False,indent=2))
