import concurrent.futures,hashlib,json,urllib.request,subprocess
base='https://pruizbohle.github.io/gran-atlas-naturaleza/'
m=json.load(open('docs/gm05/release-manifest.json'))
def check(entry):
 path,want=entry
 request=urllib.request.Request(base+path+'?verify=3350-world',headers={'Cache-Control':'no-cache'})
 with urllib.request.urlopen(request,timeout=40) as r:data=r.read()
 actual=hashlib.sha256(data).hexdigest()
 return {'path':path,'match':actual==want,'sha256':actual,'expected':want} if actual!=want else None
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:errors=[e for e in pool.map(check,m['files'].items()) if e]
report={'version':'3.35.0','url':base,'commit':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'webFilesVerified':len(m['files']),'hashMismatches':errors,'workflow':__import__('os').environ['ATLAS_DEPLOY_WORKFLOW']}
open('docs/gm05/published-report.json','w').write(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
assert not errors
