#!/usr/bin/env python3
import json,sys
from android_release import candidate_manifest
apk,run,commit,destination=sys.argv[1:]
with open(destination,'w') as file:json.dump(candidate_manifest(apk,int(run),commit),file,indent=2)
print('Candidate manifest binds the exact APK, source commit, run, certificate and payload.')
