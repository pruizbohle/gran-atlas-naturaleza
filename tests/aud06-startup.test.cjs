'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const { make } = require('./helpers/gm06-game.cjs');

function game() {
  const read = name => fs.readFileSync('www/js/' + name + '.js', 'utf8');
  const hooks = 'catalogueTaxonomy, legendaryForSpecies, bestiaryData3260, get bestiaryIndex(){return bestiaryCatalog3260}';
  const app = read('app').replace(/\n\}\)\(\);\s*$/, '\nwindow.__aud06={' + hooks + '};\n})();');
  const { g, window } = make({ app: [read('gm07-p04/catalog'), read('gm07-a04/catalog'), app].join('\n') });
  return { ...g, audit: window.__aud06 };
}

test('AUD-06 El índice del Bestiario se difiere hasta su uso y comparte la taxonomía ya resuelta', () => {
  const { audit, taxonomyInfo, SPECIES } = game();
  assert.equal(audit.bestiaryIndex, null);
  const id = 'zorro_rojo';
  const taxonomy = audit.catalogueTaxonomy(id);
  assert.deepEqual(taxonomy, taxonomyInfo(id));
  assert.equal(audit.bestiaryIndex, null);
  const index = audit.bestiaryData3260();
  assert.equal(index.entries.length, 1000);
  assert.deepEqual(Array.from(index.ids), Object.keys(SPECIES));
  assert.equal(index.entries[index.ids.indexOf(id)].taxonomy, taxonomy);
  assert.equal(audit.bestiaryData3260(), index);
});

test('AUD-06 El índice de especímenes conserva precedencia, alias taxonómicos y variantes en las 1000 fichas', () => {
  const { audit, SPECIES, SPECIMEN_CATEGORIES, LEGENDARY_SPECIMENS, configuredSpecials } = game();
  const canonical = entry => (entry?.latin || '').toLowerCase().trim().split(/\s+/).slice(0, 2).join(' ');
  assert.equal(LEGENDARY_SPECIMENS.length, 12);
  for (const [id, entry] of Object.entries(SPECIES)) {
    const expected = LEGENDARY_SPECIMENS.find(specimen => canonical(entry) &&
      canonical(SPECIES[specimen.speciesId]) === canonical(entry));
    assert.equal(audit.legendaryForSpecies(id), expected, id);
    assert.deepEqual(Array.from(configuredSpecials(entry)),
      [...new Set([...entry.special, ...SPECIMEN_CATEGORIES[id]])], id);
  }
  assert.deepEqual(Array.from(configuredSpecials({ special: ['Leucístico'] })), ['Albino']);
});
