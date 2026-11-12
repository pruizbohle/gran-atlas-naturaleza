#!/usr/bin/env python3
import sys
from android_release import read,verify_candidate
apk,manifest,run,source=sys.argv[1:]
verify_candidate(read(manifest),apk,read(run),source)
print('Candidate identity, source commit, run and unchanged payload verified.')
