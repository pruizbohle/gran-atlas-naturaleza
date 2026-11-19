'use strict';

const fs = require('node:fs');
const vm = require('node:vm');
const { harness } = require('../tests/helpers/live-game.cjs');
const { terrestrialMammal, aquaticMammal } = require('./terrestrial-mammal-families.cjs');

const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'app'];
const gameSource = modules.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
const game = harness({}, null, { gameSource }).window.__atlasTest;
const { catalog, migrationProgress } = vm.runInNewContext(
  fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,migrationProgress});');
const byId = new Map(catalog.map(species => [species.id, species]));
const pigments = { Albino: 'albino', 'Melánico': 'melanico' };
const terrestrial = [];
const aquatic = [];
const missingTerrestrial = [];
const migrated = [];
const legendariosPendientes = [];
const legacyTaxonomy = new Map();

for (const [id, sp] of Object.entries(game.SPECIES)) {
  const taxonomy = game.taxonomyInfo(id);
  if (taxonomy.className !== 'Mammalia') continue;
  const landTaxon = terrestrialMammal(sp.latin);
  const waterTaxon = aquaticMammal(sp.latin);
  const plate = byId.get(id);
  const special = game.configuredSpecials(sp);
  const expected = ['normal', ...special.flatMap(label => pigments[label] ? [pigments[label]] : [])];
  if (game.SEXUAL_DIMORPHISM[id]) expected.push('male', 'female');
  if (special.includes('Legendario')) expected.push('legendario');
  const pending = expected.filter(key => !plate?.records.some(record => record.key === key && record.src));
  const entry = { id, name: sp.name, latin: sp.latin, historicalGroup: taxonomy.subClass, pending };
  if (pending.includes('legendario')) legendariosPendientes.push(id);
  legacyTaxonomy.set(id, taxonomy.subClass);
  if (landTaxon) terrestrial.push({ ...entry, ...landTaxon });
  if (waterTaxon) aquatic.push({ ...entry, ...waterTaxon, environment: waterTaxon.family === 'Iniidae' ? 'agua dulce' : 'marino o costero' });
  else if (pending.length) missingTerrestrial.push(entry);
  if (!pending.includes('normal')) migrated.push({ id, name: sp.name, latin: sp.latin, group: plate.group, family: plate.family });
  if (!plate && !waterTaxon) throw Error('Mamífero sin clasificación gráfica: ' + id);
}

const observations = [
  ['af_lobo_marino_cabo', 'Otariidae', 'El lobo marino del Cabo figura en el grupo histórico de mustélidos.'],
  ['sa_esp_inia_boliviensis', 'Iniidae', 'El delfín boliviano es un cetáceo de agua dulce.'],
  ['af_xlsx_rata_topo', 'Spalacidae', 'La rata topo gigante es un roedor, aunque figura entre los insectívoros.'],
  ['asia_esp_0414', 'Leporidae', 'El conejo de Amami figura en el grupo histórico de roedores y pequeños mamíferos.'],
  ['af_xlsx_cerdo_hormiguero', 'Orycteropodidae', 'El cerdo hormiguero pertenece a Tubulidentata.'],
  ['af_tenrec', 'Tenrecidae', 'El tenrec pertenece a Afrosoricida.'],
  ['sa_esp_lontra_felina', 'Mustelidae', 'El chungungo costero conserva su lámina migrada. La nutria marina reservada es Enhydra lutris.']
].map(([id, family, note]) => ({ id, historicalGroup: legacyTaxonomy.get(id), family, note }));

const sort = (a, b) => a.latin.localeCompare(b.latin, 'en');
const byFamily = Object.fromEntries([...new Set(terrestrial.map(sp => sp.family))].sort().map(family =>
  [family, terrestrial.filter(sp => sp.family === family).sort(sort)]));
const variantsPending = aquatic.flatMap(sp => sp.pending.filter(key => key !== 'normal')
  .map(key => ({ id: sp.id, variant: key })));
console.log(JSON.stringify({
  version: require('../package.json').version,
  progress: migrationProgress,
  mammals: { migrated: migrated.length, terrestrialPending: missingTerrestrial.length, aquaticReserved: aquatic.length },
  newTerrestrialByFamily: byFamily,
  migratedMammals: migrated.sort(sort),
  terrestrialPending: missingTerrestrial.sort(sort),
  aquaticForV460: aquatic.sort(sort),
  variantsPendingForV460: variantsPending,
  legendaryMammalsPending: legendariosPendientes,
  observations
}, null, 2));
