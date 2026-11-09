#!/usr/bin/env python3
"""Independently verify GM-01 source coverage, identity rules and reproducibility.

Usage: python scripts/verify-world-gm01.py /path/to/original.xlsx
Writes only temporary reports, never production files or the source workbook.
"""
import collections
import csv
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unicodedata
import unittest

sys.dont_write_bytecode = True

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
REPORTS = ROOT / 'docs/gm01'
SOURCE = Path(sys.argv.pop(1)).resolve() if len(sys.argv) > 1 else None
spec = importlib.util.spec_from_file_location('audit_gm01', ROOT / 'scripts/audit-world-gm01.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rows(name):
    with (REPORTS / name).open(newline='') as stream:
        return list(csv.DictReader(stream))


def full_name(name):
    return ' '.join(unicodedata.normalize('NFKC', name).casefold().split())


def command(*arguments):
    return subprocess.run([sys.executable, 'scripts/audit-world-gm01.py', *map(str, arguments)],
                          cwd=ROOT, capture_output=True, text=True)


class MatchingRules(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.decisions = json.loads((REPORTS / 'decisions.json').read_text())

    def test_full_scientific_name_is_required(self):
        current = {'panthera pardus tulliana': ['persian'], 'panthera pardus pardus': ['african']}
        self.assertEqual(audit.match_species('Panthera pardus', current, self.decisions),
                         ('', 'sin_correspondencia'))
        self.assertEqual(audit.match_species('Panthera', current, self.decisions),
                         ('', 'sin_correspondencia'))

    def test_whitespace_case_and_unicode_normalization(self):
        self.assertEqual(audit.match_species('  CANIS\u00a0 lupus ', {'canis lupus': ['wolf']}, self.decisions),
                         ('wolf', 'nombre_completo'))

    def test_only_explicit_aliases_match(self):
        for original, decision in self.decisions['aliases'].items():
            current = {full_name(decision['canonical']): ['existing']}
            self.assertEqual(audit.match_species(original, current, self.decisions),
                             ('existing', 'alias_documentado'))
        self.assertEqual(audit.match_species('Canis aureus', {'canis lupaster': ['african']}, self.decisions),
                         ('', 'sin_correspondencia'))
        self.assertEqual(audit.match_species('Canis familiaris', {'canis lupus': ['wolf']}, self.decisions),
                         ('', 'sin_correspondencia'))

    def test_multiple_exact_matches_are_not_arbitrarily_resolved(self):
        self.assertEqual(audit.match_species('Canis lupus', {'canis lupus': ['a', 'b']}, self.decisions),
                         ('', 'ambiguo'))

    def test_reserved_cell_is_not_a_region_even_when_its_id_is_occupied(self):
        cell = {'ID hex': 'HX-06-07', 'Animales cargados': 0}
        self.assertEqual(audit.region_match(cell, {'HX-06-07': {'id': 'HX-06-07'}}, self.decisions)[1],
                         'reservada')

    def test_region_match_requires_continent_and_not_hx_identity(self):
        cell = {'ID hex': 'occupied', 'Animales cargados': 1,
                'Continente / medio': 'Mar', 'Región geográfica': 'Amazonía'}
        current = {'occupied': {'id': 'occupied', 'continent': 'Sudamérica', 'name': 'Amazonía'}}
        self.assertEqual(audit.region_match(cell, current, self.decisions)[1], 'pendiente')

    def test_partial_african_crosswalk_keeps_its_scope(self):
        cell = {'ID hex': 'HX-05-09', 'Animales cargados': 1}
        rid = self.decisions['africa_crosswalk'][cell['ID hex']]['id']
        self.assertEqual(audit.region_match(cell, {rid: {'continent': 'África'}}, self.decisions)[1], 'parcial')


class ReportsAndSafety(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not SOURCE or not SOURCE.is_file():
            raise RuntimeError('Pass the accessible original XLSX as the first argument.')
        cls.before_hash = digest(SOURCE)
        cls.summary = json.loads((REPORTS / 'summary.json').read_text())
        cls.snapshot = json.loads((REPORTS / 'game-snapshot.json').read_text())
        cls.species = rows('species.csv')
        cls.regions = rows('regions.csv')
        cls.presences = rows('presences.csv')
        book = openpyxl.load_workbook(SOURCE, read_only=True, data_only=True)
        cls.source = {sheet: list(book[sheet].values) for sheet in ['Hexágonos', 'Catálogo especies', 'Fauna']}
        book.close()

    def test_all_original_columns_and_rows_survive_each_table(self):
        for sheet, report in [('Hexágonos', self.regions), ('Catálogo especies', self.species),
                              ('Fauna', self.presences)]:
            source = self.source[sheet]
            expected = {i: dict(zip(source[0], row)) for i, row in enumerate(source[1:], 2) if row[0]}
            actual = [r for r in report if r['row_kind'] == 'source']
            self.assertEqual(len(actual), len(expected))
            self.assertEqual(len({int(r['source_row']) for r in actual}), len(expected))
            for record in actual:
                self.assertEqual(record['source_sheet'], sheet)
                for key, value in expected[int(record['source_row'])].items():
                    self.assertEqual(record['source_' + key], '' if value is None else str(value),
                                     (sheet, record['source_row'], key))

    def test_every_effective_id_region_and_pair_is_accounted_for(self):
        species = self.snapshot['species']
        regions = {r['id']: r for r in self.snapshot['regions']}
        self.assertEqual((len(species), len(regions)), (710, 79))
        self.assertEqual(len({full_name(s['latin']) for s in species.values()}), 710)
        self.assertEqual({r['game_id'] for r in self.species if r['game_id']}, set(species))
        self.assertEqual({r['game_id'] for r in self.regions if r['game_id']}, set(regions))
        expected = {(r['id'], sid) for r in regions.values() for sid in r['species']}
        actual = {(p['game_region_id'], p['game_species_id']) for p in self.presences
                  if p['status'] in ['implementada', 'conflicto_equivalencia', 'presencia_juego_sin_fuente']}
        self.assertEqual(len(expected), 1329)
        self.assertEqual(actual, expected)
        for region in regions.values():
            self.assertTrue(all(x['manual'] and x['automaticSeason'] for x in region['reachability'].values()))

    def test_preserved_subarea_decisions_and_aureus_lupaster_distinction(self):
        am04 = json.loads((ROOT / 'docs/sudamerica-v3230/source-presences.json').read_text())
        source_rows = {int(r['source_row']): r for r in self.presences if r['row_kind'] == 'source'}
        for record in am04:
            self.assertEqual(source_rows[record['row']]['existing_AM04_subarea_note'], record['subareaNote'])
        maghreb = source_rows[607]
        self.assertEqual(maghreb['game_species_id'], 'chacal_dorado')
        self.assertEqual(maghreb['different_current_species_NOT_EQUIVALENCE'], 'af_chacal_dorado')
        self.assertEqual(maghreb['status'], 'diferencia_distribucion_taxonomica_documentada')
        self.assertNotIn('chacal_dorado', next(r for r in self.snapshot['regions'] if r['id'] == 'HX-06-09')['species'])

    def test_phase_sets_independently_cover_source_without_double_counting(self):
        decisions = json.loads((REPORTS / 'decisions.json').read_text())
        source = [r for r in self.presences if r['row_kind'] == 'source']
        earlier = set()
        for phase in self.summary['phases']:
            ps = [r for r in source if r['source_Continente / medio'] in phase['media']]
            unmatched = {decisions['aliases'].get(r['source_Nombre científico'], {}).get('canonical',
                         r['source_Nombre científico']) for r in ps if not r['game_species_id']}
            blocked = unmatched & set(decisions['rank_or_identity_ambiguities'])
            self.assertEqual(len(ps), phase['presences'])
            self.assertEqual(unmatched - blocked - earlier, set(phase['new_unrepresented_source_concepts']))
            self.assertEqual((unmatched - blocked) & earlier, set(phase['reused_concepts_from_prior_phases']))
            earlier |= unmatched - blocked
        self.assertEqual(len(earlier), 233)
        self.assertEqual(sum(p['regions'] for p in self.summary['phases']), 34)
        self.assertEqual(sum(p['presences'] for p in self.summary['phases']), 415)

    def test_every_unmatched_source_has_preliminary_art_but_no_approved_new_id(self):
        unmatched = {r['source_species_id'] for r in self.species if r['row_kind'] == 'source' and not r['game_id']}
        art = rows('art-audit.csv')
        self.assertEqual(len(art), 236)
        self.assertEqual({r['source_species_id'] for r in art}, unmatched)
        self.assertTrue(all(r['new_identity_approved'] == 'False' for r in self.species))
        self.assertTrue(all(r['configured_variants'].startswith('Sin ID actual') for r in art))

    def test_reproduction_and_check_are_byte_identical_without_production_writes(self):
        before = {path: digest(ROOT / path) for path in self.summary['production_manifest']}
        report_before = {p.name: (p.read_bytes(), p.stat().st_mtime_ns) for p in REPORTS.iterdir() if p.is_file()}
        result = command(SOURCE, '--check')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(report_before, {p.name: (p.read_bytes(), p.stat().st_mtime_ns)
                                       for p in REPORTS.iterdir() if p.is_file()})
        with tempfile.TemporaryDirectory(prefix='gm01-reproduction-') as tmp:
            result = command(SOURCE, '--output', tmp)
            self.assertEqual(result.returncode, 0, result.stderr)
            generated = list(Path(tmp).iterdir())
            self.assertEqual(len(generated), 10)
            for path in generated:
                self.assertEqual(path.read_bytes(), (REPORTS / path.name).read_bytes(), path.name)
        self.assertEqual(before, {path: digest(ROOT / path) for path in before})
        self.assertEqual(before, self.summary['production_manifest'])
        self.assertEqual(digest(SOURCE), self.before_hash)

    def test_wrong_or_missing_source_cannot_generate_reports(self):
        with tempfile.TemporaryDirectory(prefix='gm01-reject-') as tmp:
            root = Path(tmp)
            source = root / 'wrong.xlsx'
            source.write_bytes(b'not the original source')
            for path in [source, root / 'missing.xlsx']:
                result = command(path, '--output', root / 'reports')
                self.assertNotEqual(result.returncode, 0)
                self.assertFalse((root / 'reports').exists())
            self.assertIn('bloqueada', result.stderr)

    def test_output_cannot_point_to_game_or_other_repository_directories(self):
        for directory in ['www', 'www/js', 'scripts', 'tests', '.git', '.']:
            result = command(SOURCE, '--output', ROOT / directory)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('forbidden', result.stderr)

    def test_all_reported_checks_and_input_hashes_are_current(self):
        self.assertTrue(all(self.summary['checks'].values()))
        for path, expected in self.summary['audit_input_manifest'].items():
            self.assertEqual(digest(ROOT / path), expected, path)
        self.assertEqual(digest(SOURCE), self.summary['source']['sha256'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
