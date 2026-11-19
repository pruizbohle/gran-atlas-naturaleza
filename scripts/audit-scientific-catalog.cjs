'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { harness } = require('../tests/helpers/live-game.cjs');
const { aquaticMammal } = require('./terrestrial-mammal-families.cjs');
const art = require('../www/js/naturalist-art-v400.js');

const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'app'];
const gameSource = modules.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
const game = harness({}, null, { gameSource }).window.__atlasTest;
const pigments = { Albino: 'albino', Melánico: 'melanico' };

function describe(id, species) {
  const specials = game.configuredSpecials(species);
  const pigmentation = specials.filter(label => Object.hasOwn(pigments, label));
  const dimorphism = Boolean(game.SEXUAL_DIMORPHISM[id]);
  const legendary = specials.includes('Legendario')
    ? game.LEGENDARY_SPECIMENS.find(item => item.speciesId === id)
    : null;
  if (specials.includes('Legendario')) assert.ok(legendary, id + ' · identidad legendaria');
  return { id, name: species.name, latin: species.latin, habitats: [...species.habitats],
    historicalGroup: game.taxonomyInfo(id).subClass, pigmentation, dimorphism, legendary: legendary || null };
}

function members(className) {
  return Object.entries(game.SPECIES).filter(([id]) => game.taxonomyInfo(id).className === className);
}

if (process.argv.includes('--birds')) {
  console.log(JSON.stringify(members('Aves').map(([id, sp]) => describe(id, sp)), null, 2));
} else {
  const { catalog, migrationProgress } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,migrationProgress});');
  const entries = new Map(catalog.map(sp => [sp.id, sp]));
  const mammals = members('Mammalia').map(([id, sp]) => {
    const animal = describe(id, sp);
    const entry = entries.get(id);
    assert.ok(entry, id + ' · registro del laboratorio');
    assert.equal(entry.name, animal.name);
    assert.equal(entry.latin, animal.latin);
    const expected = ['normal', ...animal.pigmentation.map(label => pigments[label])];
    if (animal.dimorphism) expected.push('male', 'female');
    if (animal.legendary) expected.push('legendario');
    const routes = Object.fromEntries(entry.records.map(record => [record.key, record.src]));
    assert.deepEqual(Object.keys(routes).sort(), expected.sort(), id + ' · variantes configuradas');
    for (const [key, file] of Object.entries(routes)) {
      assert.ok(file, id + ' · falta ' + key);
      if (key === 'legendario') assert.equal(file, 'plates/' + id + '--' + animal.legendary.id + '.webp');
    }
    return { ...animal, group: entry.group, family: entry.family, routes };
  }).sort((a, b) => a.latin.localeCompare(b.latin, 'en'));

  const newAquatic = mammals.flatMap(sp => {
    const taxonomy = aquaticMammal(sp.latin);
    if (!taxonomy) return [];
    const regions = game.REGIONS.filter(region => region.species.includes(sp.id))
      .map(({ id, name, habitats }) => ({ id, name, habitats }));
    const habitat = art.preferredHabitat(sp.habitats);
    assert.ok(habitat, sp.id + ' · hábitat del Bestiario');
    if (taxonomy.family === 'Iniidae') {
      assert.equal(habitat, 'rio', sp.id);
      assert.ok(regions.every(region => region.habitats.includes('rio') && !region.habitats.includes('oceano_abierto')), sp.id);
    }
    return [{ ...sp, taxonGroup: taxonomy.group, habitat, bestiaryLandscape: art.landscapeKey(habitat), regions }];
  });
  assert.equal(migrationProgress.mammalsMigrated, mammals.length);
  const summary = {
    mammalia: mammals.length,
    migrated: mammals.length,
    pending: 0,
    pigmentation: mammals.reduce((sum, sp) => sum + sp.pigmentation.length, 0),
    dimorphicSpecies: mammals.filter(sp => sp.dimorphism).length,
    legendary: mammals.filter(sp => sp.legendary).map(sp => sp.legendary.name)
  };
  console.log(JSON.stringify({ version: require('../package.json').version, summary, migrationProgress, newAquatic, mammals }, null, 2));
}
