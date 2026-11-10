#!/usr/bin/env python3
"""Build an isolated, non-approved Oceania runtime candidate from the existing GM-02A contract."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent

def dumps(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,indent=2)+'\n'
def build():
    source=json.loads((ROOT/'docs/gm02/source-contract.json').read_text())
    design=json.loads((ROOT/'docs/gm02/ecology-profiles.json').read_text())
    decisions={d['id']:d for d in json.loads((ROOT/'docs/gm02/scientific-decisions.json').read_text())['decisions']}
    species={};dimorphism={};categories={}
    for sid,taxon in source['taxa'].items():
        config=design['profiles'][sid]
        if config['dimorphism']:dimorphism[sid]=config['dimorphism']
        categories[sid]=config['categories']
        species[sid]=dict(name=taxon['common'],latin=decisions.get(sid,{}).get('acceptedScientific',taxon['scientific']),rare=taxon['rarity'],
                         origin='oc3290',sourceScientific=taxon['scientific'],sourceSpeciesIds=[taxon['sourceSpeciesId']],
                         taxonomy=config['taxonomy'],family=config['family'],kind=config['kind'],color=config['color'],
                         habitats=config['habitats'],times=config['times'],seasons=config['seasons'],special=config['special'],
                         dimorphism=bool(config['dimorphism']),artProfile=config['artProfile'],
                         taxonomicStatus=config['scientificStatus'],ecologyNote=config['ecologyNote'])
    order=['oc_norte_tropical_australiano','oc_costa_nordeste_australiana','oc_australia_oriental','oc_desierto_australiano','oc_australia_occidental','oc_tasmania','oc_nueva_guinea','oc_nueva_zelanda']
    regions=[dict(id=r['id'],name=r['name'],code='OC-'+str(i+1).zfill(2),continent='Oceanía',sourceHexId=r['source']['source_hex_id'],unlock={'prestige':197+3*order.index(r['id'])},habitats=design['regionHabitats'][r['id']],species=r['species']) for i,r in enumerate(source['sourceRegions'])]
    reachable=[]
    for r in regions:
        for sid in r['species']:
            sp=species[sid];compatible=[h for h in sp['habitats'] if h in r['habitats']]
            assert compatible,(r['id'],sid)
            reachable.append(dict(regionId=r['id'],speciesId=sid,habitat=compatible[0],time=sp['times'][0],season=sp['seasons'][0]))
    pending=sorted(s['latin'] for s in species.values() if s['taxonomicStatus']=='pending-authority-review')
    assert len(pending)==0 and len(regions)==8 and len(species)==97 and len(reachable)==131
    data=dict(status='validated-release-candidate',approvedForProduction=not pending,species=species,regions=regions,
              dimorphism=dimorphism,categories=categories,pendingScientificReviews=pending,
              access=dict(researchId='oceania_1',requires='sudamerica_1',money=3800,knowledge=3400,prestigeMin=197,prestigeMax=218,newItems=[]),
              inputs={p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in ['docs/gm02/source-contract.json','docs/gm02/ecology-profiles.json','scripts/build-oceania-runtime-v3290.py','docs/gm02/scientific-decisions.json']})
    module='/* GM-02B isolated candidate. No production approval or automatic installation. */\n(function(root){"use strict";\nconst data='+dumps(data).strip()+';\n'
    module+='function freeze(v){if(v&&typeof v==="object"){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}\nfreeze(data);\nif(typeof module==="object"&&module.exports)module.exports=data;else root.AtlasOceaniaRuntime3290=data;\n})(typeof globalThis!=="undefined"?globalThis:this);\n'
    return {ROOT/'www/js/oceania-runtime-v3290.js':module,ROOT/'docs/gm02/ecology-reachability.json':dumps(reachable)}

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--check',action='store_true');args=p.parse_args()
    for path,content in build().items():
        if args.check:
            if not path.exists() or path.read_bytes()!=content.encode():raise SystemExit('Candidate differs: '+str(path))
        else:path.write_text(content,encoding='utf-8',newline='')
    print('97 candidate profiles; 8 regions; 131 compatible presence configurations; 0 scientific reviews pending; scientific approval complete; deployment requires release validation.')
