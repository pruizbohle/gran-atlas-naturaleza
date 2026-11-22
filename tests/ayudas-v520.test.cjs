'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const test = require('node:test');
const { make, copy } = require('./helpers/ux3410-game.cjs');
const { guide } = require('../www/js/experience-v3410.js');

test('the contextual guide covers the game modules and its shortcuts only consult the live game', () => {
  const modules = {
    atlas: 'prestigio', field: 'Observar fauna', journal: 'cinco etapas', research: 'prerrequisitos',
    expeditions: 'Astillero', objects: 'Taller', bestiary: 'legendarios', museum: 'indicios',
    society: 'subvenciones', crown: 'saldo'
  };
  const { g } = make();
  const before = copy(g.state);
  for (const [id, term] of Object.entries(modules)) {
    const html = guide(id);
    assert.match(html, /^<details class="ux3410-guide">/);
    assert.ok(html.includes(term), id);
    assert.doesNotMatch(html, /<dialog| open[ >]|field-aid|buy-crown|exchange-crown/);
    const target = html.match(/data-id="([^"]+)"/)?.[1];
    g.open(id);
    assert.ok(g.uxAction3410('ux-open', target), target);
    assert.ok(g.uxBack3410());
    assert.equal(g.tab, id);
  }
  for (const key of ['money', 'knowledge', 'prestige', 'sightings', 'purchases', 'inventory', 'legendaryFound', 'museum']) {
    assert.deepEqual(copy(g.state[key]), before[key], key);
  }
  assert.equal(guide('__proto__'), '');
});

test('Compass, Atlas requirements and recipe navigation restore the source without spending resources', () => {
  const { g } = make();
  g.open('atlas');
  const goal = g.compassModel3410();
  const before = copy(g.state);
  assert.ok(goal);
  assert.ok(g.compassAction3410('ux-compass-go', goal.key));
  assert.ok(g.uxBack3410());
  assert.equal(g.tab, 'atlas');
  assert.equal(g.compassAction3410('ux-compass-go', 'fabricated'), false);

  const frontier = g.REGIONS.find(region => region.id === 'HX-06-08');
  const model = g.atlasRegionModel(frontier);
  const target = model.requirements.find(requirement => requirement.link && !requirement.met)?.link;
  assert.ok(target);
  assert.ok(g.uxNavigate3410('atlas', frontier.id));
  assert.ok(g.uxNavigate3410(target.type, target.id));
  assert.ok(g.uxBack3410());
  assert.equal(g.state.atlasSelectedRegion, frontier.id);
  assert.ok(g.uxNavigate3410('recipe', 'brass_compass'));
  assert.ok(g.uxBack3410());
  assert.equal(g.state.atlasSelectedRegion, frontier.id);
  assert.equal(g.uxNavigate3410('travel', frontier.id), false);
  assert.notEqual(g.state.currentRegion, frontier.id);
  for (const key of ['money', 'knowledge', 'purchases', 'inventory', 'regionUnlocked']) {
    assert.deepEqual(copy(g.state[key]), before[key], key);
  }
});

test('the older development grants and counterfeit currency actions remain absent while the old balance survives', () => {
  const original = execFileSync('git', ['show', '50cdf3c:www/js/app.js'], { encoding: 'utf8' });
  const current = fs.readFileSync('www/js/app.js', 'utf8');
  for (const handler of ['field-aid', 'buy-crown', 'exchange-crown']) {
    assert.ok(original.includes("'" + handler + "'"), handler);
    assert.ok(!current.includes("'" + handler + "'"), handler);
  }
  const seeded = make();
  seeded.g.state.crownCoins = 317;
  seeded.g.persist();
  const { g, elements } = make({ store: seeded.store });
  g.open('crown');
  assert.match(elements.panel.innerHTML, /Saldo histórico: 317 coronas/);
  const before = copy(g.state);
  for (const [action, id] of [['field-aid', 'knowledge'], ['field-aid', 'sightings'],
    ['field-aid', 'guided'], ['buy-crown', '5000'], ['exchange-crown', 'all']]) {
    g.handlePanelAction({ target: { closest: () => ({ dataset: { action, id } }) } });
  }
  assert.deepEqual(copy(g.state), before);
});
