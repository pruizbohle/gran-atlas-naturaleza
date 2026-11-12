#!/usr/bin/env python3
"""Refuse publication without real device evidence for the exact candidate."""
import sys
from android_release import read,verify_candidate,verify_physical
apk,run_id,manifest_path,run_path,source=sys.argv[1:]
manifest=read(manifest_path);run=read(run_path)
if int(run_id)!=run['id']:raise SystemExit('Candidate run ID mismatch')
verify_candidate(manifest,apk,run,source)
verify_physical(read('docs/android/restoration-validation.json'),manifest)
print('Physical restoration evidence matches this exact APK hash, source commit, run and permanent certificate.')
