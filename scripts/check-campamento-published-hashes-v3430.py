"""Verify the deployed static bytes against the approved 3.43.0 manifest."""
import concurrent.futures
import hashlib
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

base = 'https://pruizbohle.github.io/gran-atlas-naturaleza/'
folder = Path('docs/campamento-perfil-v3430')
manifest = json.loads((folder / 'release-manifest.json').read_text())
commit = os.environ['ATLAS_DEPLOY_COMMIT']
def check(entry):
    path, expected = entry
    request = urllib.request.Request(base + urllib.parse.quote(path) + '?verify=3430-' + commit, headers={'Cache-Control': 'no-cache'})
    try:
        with urllib.request.urlopen(request, timeout=40) as response:
            actual = hashlib.sha256(response.read()).hexdigest()
        return None if actual == expected else {'path': path, 'expected': expected, 'actual': actual}
    except Exception as error:
        return {'path': path, 'error': str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    mismatches = [row for row in pool.map(check, manifest['files'].items()) if row]
report = {'version': '3.43.0', 'url': base, 'webFilesVerified': len(manifest['files']), 'hashMismatches': mismatches, 'cache': manifest['cache'], 'workflow': os.environ['ATLAS_DEPLOY_WORKFLOW'], 'deploymentCommit': commit}
(folder / 'published-report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
assert not mismatches
