import concurrent.futures, hashlib, json, os, urllib.request
base = 'https://pruizbohle.github.io/gran-atlas-naturaleza/'
manifest = json.load(open('docs/and3420/release-manifest.json'))
def check(entry):
    path, expected = entry
    request = urllib.request.Request(base + path + '?verify=3420-android', headers={'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(request, timeout=40) as response:
        data = response.read()
    actual = hashlib.sha256(data).hexdigest()
    return None if actual == expected else {'path': path, 'expected': expected, 'actual': actual}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    mismatches = [row for row in pool.map(check, manifest['files'].items()) if row]
report = {'version': '3.42.0', 'url': base, 'webFilesVerified': len(manifest['files']), 'hashMismatches': mismatches, 'cache': manifest['cache'], 'workflow': os.environ['ATLAS_DEPLOY_WORKFLOW'], 'deploymentCommit': os.environ['ATLAS_DEPLOY_COMMIT']}
open('docs/and3420/published-report.json', 'w').write(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
assert not mismatches
