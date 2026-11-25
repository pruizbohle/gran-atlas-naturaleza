'use strict';

const library = globalThis.AtlasIconLibrary530;
const icons = globalThis.AtlasIcons530;
const element = id => document.getElementById(id);
const query = element('library-query');
const category = element('library-category');
const statusFilter = element('library-status');
const size = element('library-size');
const tone = element('library-tone');
const biome = element('library-biome');
const zoom = element('library-zoom');
const board = element('library-map');
const cards = element('library-cards');
const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
const create = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};

for (const label of library.categories) category.append(new Option(label, label));
for (const row of library.items.filter(row => row.id.startsWith('biome-'))) biome.append(new Option(row.name, row.id.slice(6)));

function before(stage, asset) {
  if (asset.text) stage.append(create('span', asset.text, 'library-text'));
  if (asset.object) stage.innerHTML = AtlasItemArt.renderItemArt(asset.object);
  if (asset.biome) stage.innerHTML = '<svg viewBox="-34 -32 68 46" aria-hidden="true">' + AtlasUI.habitatArt(asset.biome, true) + '</svg>';
}

function comparison(row, original) {
  const figure = create('figure');
  const stage = create('div', null, 'library-stage');
  if (original) before(stage, row.old);
  else if (row.icon.startsWith('glyph:')) stage.innerHTML = icons.glyph(row.icon.slice(6));
  else if (row.icon) {
    stage.innerHTML = icons.image(row.icon, 128);
    stage.firstElementChild.loading = 'lazy';
  }
  else stage.append(create('small', 'Lámina vigente'));
  figure.append(stage, create('figcaption', original ? 'Anterior' : row.icon ? 'Propuesta' : 'Conservada'));
  return figure;
}

function render() {
  const term = normalize(query.value);
  const rows = library.items.filter(row => (!category.value || category.value === row.category) &&
    (!statusFilter.value || statusFilter.value === row.status) &&
    normalize([row.name, row.id, row.place, row.category].join(' ')).includes(term));
  cards.replaceChildren();
  for (const row of rows) {
    const tile = create('article', null, 'library-card');
    tile.dataset.state = row.status;
    const sizeInUse = size.value === 'actual' ? row.size : Number(size.value);
    tile.style.setProperty('--mark', sizeInUse + 'px');
    tile.style.setProperty('--stage', (sizeInUse + 12) + 'px');
    const figures = create('div', null, 'library-comparisons');
    figures.append(comparison(row, true), comparison(row, false));
    tile.append(create('h2', row.name), create('p', row.id + ' · ' + row.status, 'status'),
      figures, create('p', row.place), create('p', row.source));
    if (row.detail) tile.append(create('p', row.detail));
    cards.append(tile);
  }
  element('library-result').textContent = rows.length + ' de ' + library.items.length + ' fichas';
}

function renderMap() {
  const examples = [
    ['Bloqueada', 'bloqueada'], ['Disponible', 'disponible'], ['Desbloqueada', 'abierta'],
    ['Visitada', 'abierta'], ['Seleccionada', 'actual'], ['Especial', 'abierta']
  ];
  const habitat = Object.keys(icons.biomes).find(key => icons.biomes[key] === biome.value);
  board.style.width = 606 * Number(zoom.value) + 'px';
  board.style.height = 92 * Number(zoom.value) + 'px';
  board.innerHTML = examples.map(([name, status], i) => AtlasUI.tile({
    id: 'example-' + i, name, status, x: 51 + i * 100, y: 45, terrain: habitat,
    identified: 0, speciesCount: 1, visited: i === 3 || i === 4, markers: i === 5 ? ['Región especial'] : []
  }, i === 4)).join('');
  for (const tile of board.querySelectorAll('.atlas-tile')) {
    tile.removeAttribute('tabindex');
    tile.removeAttribute('role');
  }
}

for (const field of [query, category, statusFilter, size]) field.addEventListener('input', render);
tone.addEventListener('input', () => document.body.dataset.tone = tone.value);
for (const field of [biome, zoom]) field.addEventListener('input', renderMap);
render();
renderMap();
