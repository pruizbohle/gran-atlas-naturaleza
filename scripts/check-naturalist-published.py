#!/usr/bin/env python3
"""Compare published web resources against this checkout by SHA-256."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
from urllib.parse import quote, urljoin
from urllib.request import Request, urlopen

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("origin", help="Published site URL, including any project path")
args = parser.parse_args()
root = Path("www")
manifest = (root / "js/naturalist-assets-v400.js").read_text(encoding="utf-8")
assets = json.loads(manifest.split("=", 1)[1].strip().removesuffix(";"))
plates = assets["files"] + assets.get("labFiles", [])
release = json.loads((root / "atlas-release.json").read_text(encoding="utf-8"))
files = [
    "index.html", "atlas-release.json", "sw.js", "manifest.webmanifest",
    f"actualizar-v{release['version'].replace('.', '')}.html",
    "js/app.js", "js/save-manager.js", "js/update-client-v3212.js",
    "js/naturalist-art-v400.js", "js/naturalist-assets-v400.js", "css/naturalist-art-v400.css",
    "naturalist-art/index.html", "naturalist-art/catalog.js", "naturalist-art/lab.js",
    "naturalist-art/lab.css", *plates,
]
origin = args.origin.rstrip("/") + "/"

def verify(file):
    requested = "naturalist-art/" if file == "naturalist-art/index.html" else file
    url = urljoin(origin, quote(requested))
    request = Request(url, headers={"User-Agent": "AtlasReleaseVerification/1.0"})
    with urlopen(request, timeout=30) as response:
        data = response.read()
    digest = hashlib.sha256(data).hexdigest()
    if digest != hashlib.sha256((root / file).read_bytes()).hexdigest():
        raise ValueError(f"El recurso publicado difiere del candidato: {file}")
    return digest

with ThreadPoolExecutor(max_workers=6) as executor:
    hashes = dict(zip(files, executor.map(verify, files)))
print(json.dumps({"version": release["version"], "url": origin, "verifiedResources": len(hashes),
                  "verifiedWebp": len(plates), "sha256": hashes}, indent=2))
