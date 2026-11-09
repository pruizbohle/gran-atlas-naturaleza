#!/usr/bin/env python3
"""Prepare GM-02A's source contract from the frozen GM-01 reports, not the XLSX.
No catalog installation, probability, access, sprite or save changes.
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIT = ROOT / 'docs/gm01'
OUT = ROOT / 'docs/gm02'
MODULE = ROOT / 'www/js/oceania-data-v3290.js'


def read_rows(name):
    with (AUDIT / name).open(newline='') as stream:
        return list(csv.DictReader(stream))


def encode(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + '\n'


def build():
    summary = json.loads((AUDIT / 'summary.json').read_text())
    phase = next(p for p in summary['phases'] if p['phase'] == 'GM-02')
    decision = json.loads((OUT / 'dingo-decision.json').read_text())
    authority = json.loads((OUT / 'authority-mdd.json').read_text())
    accepted = next(r for r in authority['rows'] if r['sciName'] == 'Canis_familiaris')
    assert accepted['id'] == '1005940' and 'includes dingo as a synonym' in accepted['taxonomyNotes']
    assert decision['scientific'] == decision['sourceScientific'] == 'Canis familiaris'
    assert decision['sourceSpeciesId'] == 'ESP-0076'
    regions = [r for r in read_rows('regions.csv') if r['row_kind'] == 'source' and r['source_medium'] == 'Oceanía']
    presences = [r for r in read_rows('presences.csv') if r['row_kind'] == 'source' and r['source_Continente / medio'] == 'Oceanía']
    source_ids = {r['source_ID especie'] for r in presences}
    species = [s for s in read_rows('species.csv') if s['row_kind'] == 'source' and s['source_species_id'] in source_ids]
    issues = read_rows('issues.csv')
    art = {a['source_species_id']: a for a in read_rows('art-audit.csv')}
    current = json.loads((AUDIT / 'game-snapshot.json').read_text())
    region_by_hex = {r['source_hex_id']: r['proposed_id_NOT_IMPLEMENTED'] for r in regions}
    taxa = {}
    for sp in species:
        scientific = sp['source_scientific']
        sid = sp['game_id'] or ('oc_esp_' + scientific.lower().replace(' ', '_'))
        assert not sp['game_id'], 'Unexpected reusable identity: reconcile GM-01 explicitly'
        assert scientific not in {x['latin'] for x in current['species'].values()}
        assert sid not in current['species']
        notes = [i for i in issues if i['source_species_id'] == sp['source_species_id']]
        taxa[sid] = dict(id=sid, scientific=scientific, common=sp['source_common'],
                        sourceSpeciesId=sp['source_species_id'], sourceCatalogRow=int(sp['source_row']),
                        group=sp['source_group'], subgroup=sp['source_subgroup'],
                        sourceRarity=sp['source_rarity'], rarity=sp['source_rarity'].replace('Muy raro', 'Muy rara'),
                        reused=False, identityTreatment='dingo-MDD-explicit' if scientific == 'Canis familiaris' else 'source-concept-retained',
                        sourceIssues=notes, artProposal=art[sp['source_species_id']],
                        productionProfileReady=False)
    by_source = {t['sourceSpeciesId']: t['id'] for t in taxa.values()}
    linked = []
    for p in presences:
        linked.append(dict(source=p, speciesId=by_source[p['source_ID especie']],
                           regionId=region_by_hex[p['source_ID hex']],
                           ecologyStatus='pending-explicit-habitat-time-season-configuration'))
    prepared_regions = []
    for r in regions:
        rid = region_by_hex[r['source_hex_id']]
        assert rid not in {x['id'] for x in current['regions']}
        prepared_regions.append(dict(id=rid, name=r['source_region'], continent='Oceanía',
                                     source=r, species=[p['speciesId'] for p in linked if p['regionId'] == rid],
                                     accessStatus='not-installed', geographyStatus='not-installed'))
    assert (len(prepared_regions), len(linked), len(taxa)) == (8, 131, 97)
    assert len({(p['regionId'], p['speciesId']) for p in linked}) == 131
    assert {t['scientific'] for t in taxa.values()} == set(phase['new_unrepresented_source_concepts']) | {'Canis familiaris'}
    dingo = [p for p in linked if p['source']['source_ID especie'] == 'ESP-0076']
    assert sorted(int(p['source']['source_row']) for p in dingo) == decision['sourceFaunaRows']
    assert {p['speciesId'] for p in dingo} == {decision['id']}
    paths = ['docs/gm01/' + p for p in ['implementation-plan.md', 'summary.json', 'species.csv', 'regions.csv', 'presences.csv', 'issues.csv', 'art-audit.csv', 'game-snapshot.json']]
    paths += ['docs/gm02/authority-mdd.json', 'docs/gm02/dingo-decision.json', 'scripts/build-oceania-gm02.py']
    contract = dict(schema='gm02-source-contract-v1', status='GM-02A prepared; GM-02B not installed',
                    productionReady=False, baseCommit='564c63c341465f79b556a0a589e0515ef8361e6a',
                    originalWorkbookSha256=summary['source']['sha256'],
                    sources={p:hashlib.sha256((ROOT / p).read_bytes()).hexdigest() for p in paths},
                    sourceRegions=prepared_regions, taxa=taxa, presences=linked, dingoDecision=decision,
                    counts=dict(regions=8, presences=131, proposedConceptsFromGM01=96,
                                resolvedDingoConcepts=1, preparedIdentities=97, reusedCurrentIds=0,
                                currentlyInstalledNewIdentities=0))
    module = '/* GM-02A: prepared source contract ONLY. Not loaded or installed by production. */\n(function(root){\n"use strict";\nconst data=' + encode(contract).strip() + ';\nfunction freeze(value){if(value&&typeof value==="object"){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}\nfreeze(data);\nif(typeof module==="object"&&module.exports)module.exports=data;else root.AtlasOceaniaSource3290=data;\n})(typeof globalThis!=="undefined"?globalThis:this);\n'
    outputs = {MODULE:module, OUT / 'source-contract.json':encode(contract)}
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    outputs = build()
    for path, content in outputs.items():
        if args.check:
            if not path.is_file() or path.read_bytes() != content.encode('utf-8'):
                raise SystemExit('Contract differs: ' + str(path.relative_to(ROOT)))
        else:
            path.write_text(content, encoding='utf-8', newline='')
    print('GM-02A: 8 source regions, 131 presences, 96 proposed concepts + 1 explicitly resolved dingo. Production integration pending.')


if __name__ == '__main__':
    main()
