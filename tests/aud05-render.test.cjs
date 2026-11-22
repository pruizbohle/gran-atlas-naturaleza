'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const sandbox = {};
vm.runInNewContext(fs.readFileSync('www/js/journal-ui-v3250.js', 'utf8'), sandbox);
const { updateRail } = sandbox.AtlasJournalUI;

function makeRail(items, selectedSlot) {
  const children = items.map(item => {
    const attributes = new Map();
    const classes = new Set();
    if (selectedSlot === item.slot) {
      classes.add('selected');
      attributes.set('aria-current', 'true');
    }
    const nodes = {
      '.j25-animal-name': { textContent: item.name },
      '.j25-animal-progress': { textContent: item.stage + '/5 · ' + item.sightings },
      '.j25-avatar': { innerHTML: item.discovered ? item.sprite : '?' }
    };
    return {
      dataset: { journalSlot: String(item.slot) },
      get nextElementSibling() { return children[children.indexOf(this) + 1] ?? null; },
      hidden: false,
      querySelector: key => nodes[key],
      classList: {
        contains: key => classes.has(key),
        toggle: (key, enabled) => enabled ? classes.add(key) : classes.delete(key)
      },
      getAttribute: key => attributes.get(key),
      setAttribute: (key, value) => attributes.set(key, value),
      removeAttribute: key => attributes.delete(key)
    };
  });
  return {
    children,
    get firstElementChild() { return children[0] ?? null; },
    insertBefore(button, next) {
      children.splice(children.indexOf(button), 1);
      children.splice(next ? children.indexOf(next) : children.length, 0, button);
    }
  };
}

const known = { slot: 0, name: 'Zorro', discovered: true, stage: 1, sightings: 10, sprite: '<svg></svg>' };
const unknown = { slot: 1, name: 'No identificado', discovered: false, stage: 0, sightings: 0 };

test('AUD-05 El Cuaderno conserva nodos e ilustraciones al reordenar la lista y actualiza el progreso', () => {
  const rail = makeRail([known, unknown], 0);
  const [first, second] = rail.children;
  let drawn = 0;
  const updated = { ...known, sightings: 24, get sprite() { throw Error('The existing illustration should be retained'); } };
  const discovered = { ...unknown, name: 'Ánade', stage: 1, sightings: 42, discovered: true,
    get sprite() { drawn++; return '<svg data-species="private"></svg>'; } };
  updateRail(rail, { query: 'anade', items: [discovered, updated], selected: { slot: 1 } }, new Map([[0, known], [1, unknown]]));
  assert.deepEqual(rail.children, [second, first]);
  assert.equal(drawn, 1);
  assert.equal(first.querySelector('.j25-avatar').innerHTML, '<svg></svg>');
  assert.equal(second.querySelector('.j25-avatar').innerHTML, '<svg></svg>');
  assert.equal(first.querySelector('.j25-animal-progress').textContent, '1/5 · 24');
  assert.equal(second.querySelector('.j25-animal-name').textContent, 'Ánade');
  assert.equal(second.getAttribute('aria-label'), 'Ánade, 42 avistamientos, 1 de 5');
  assert.equal(second.getAttribute('aria-current'), 'true');
  assert.equal(first.getAttribute('aria-current'), undefined);
  assert.equal(first.hidden, true);
  assert.equal(second.hidden, false);
});

test('AUD-05 Un respaldo con menos descubrimientos vuelve a ocultar la identidad y la ilustración', () => {
  const previouslyKnown = { ...known, slot: 1, name: 'Ánade' };
  const rail = makeRail([known, previouslyKnown], 1);
  updateRail(rail, { query: 'anade', items: [known, unknown], selected: { slot: 1 } }, new Map([[0, known], [1, previouslyKnown]]));
  const button = rail.children[1];
  assert.equal(button.querySelector('.j25-animal-name').textContent, 'No identificado');
  assert.equal(button.getAttribute('aria-label'), 'No identificado, 0 avistamientos, 0 de 5');
  assert.match(button.querySelector('.j25-avatar').innerHTML, /j25-unknown/);
  assert.equal(button.hidden, true);
});
