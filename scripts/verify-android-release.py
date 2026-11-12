#!/usr/bin/env python3
"""Verify APK reports freshly produced by apksigner and aapt in the same job."""
import json,sys
from pathlib import Path
from android_release import verify_apk
apk,badging,signature=map(Path,sys.argv[1:])
result=verify_apk(apk,badging.read_text(),signature.read_text())
print(json.dumps({k:v for k,v in result.items() if k!='webFiles'}))
