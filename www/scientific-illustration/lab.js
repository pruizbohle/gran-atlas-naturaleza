'use strict';

const { species, svgBaseline } = AtlasScientificMarsupials;
const styles = [
  ['svg', 'SVG · Serie 3'], ['natural', 'Naturalista · Serie 4'], ['scientific', 'Científica · candidata']
];
const scales = [32, 64, 128, 256, 512];
const criteria = [
  ['identity', 'Identidad zoológica'], ['anatomy', 'Precisión anatómica'],
  ['art', 'Calidad artística'], ['legibility', 'Legibilidad'], ['coherence', 'Coherencia con el juego']
];
const byId = id => document.getElementById(id);
const select = byId('species');
const form = byId('review-form');
const board = byId('board');
const storageKey = 'gran-atlas-scientific-marsupials-review-v1';
const escaping = value => String(value).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const bytes = value => value === null ? 'Pendiente' :
  (value / 1024).toLocaleString('es-CL', { maximumFractionDigits: 1 }) + ' KiB';
let evaluations = {};
let mode = 'field';

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) evaluations = saved;
} catch {
  byId('status').textContent = 'No se pudo leer la evaluación guardada.';
}

const allVariants = species.flatMap(sp => sp.variants);
byId('coverage').textContent = species.length + ' especies · ' +
  allVariants.filter(record => record.available).length + ' de ' + allVariants.length + ' candidatas disponibles';
for (const sp of species) select.add(new Option(sp.name, sp.id));
if (window.matchMedia('(max-width: 650px)').matches) byId('size').value = '128';

const makeScore = (key, label, style, title) =>
  '<select name="' + style + '-' + key + '" aria-label="' + escaping(label + ' · ' + title) +
  '"><option value="">—</option>' + [1, 2, 3, 4, 5].map(n => '<option>' + n + '</option>').join('') + '</select>';
byId('scores').innerHTML = '<table><caption>Escala de 1 a 5, donde 5 es la mejor valoración</caption>' +
  '<thead><tr><th scope="col">Criterio</th><th scope="col">Naturalista</th><th scope="col">Científica</th></tr></thead><tbody>' +
  criteria.map(([key, label]) => '<tr><th scope="row">' + escaping(label) + '</th><td>' +
    makeScore(key, label, 'natural', 'Naturalista') + '</td><td>' +
    makeScore(key, label, 'scientific', 'Científica') + '</td></tr>').join('') + '</tbody></table>';

function current() {
  const sp = species[select.selectedIndex];
  return { sp, record: sp.variants.find(item => item.key === byId('variant').value) || sp.variants[0] };
}

function options(field, pairs) {
  const saved = field.value;
  field.replaceChildren(...pairs.map(([value, label]) => new Option(label, value)));
  if (pairs.some(([value]) => value === saved)) field.value = saved;
}

function picture(style, sp, record, px, category) {
  let art;
  if (style === 'svg') {
    art = '<span class="atlas-art-image svg-art" role="img" aria-label="' +
      escaping(sp.name + ' · SVG original') + '">' + AtlasBestiaryUI.illustration(record.svg) + '</span>';
  } else if (style === 'scientific' && !record.available) {
    art = '<span class="missing">Lámina pendiente</span>';
  } else {
    const resolution = Math.max(64, px);
    const prefix = resolution === 512 ? '' : resolution + '/';
    const root = style === 'natural' ? '../naturalist-art/plates/' : 'plates/';
    art = '<img class="atlas-art-image" alt="' + escaping(sp.name + ' · ' + record.label) +
      '" width="' + resolution + '" height="' + resolution + '" decoding="async" src="' + root + prefix + record.name + '">';
  }
  return AtlasNaturalistArt.frame(art, category, 'atlas-art-cutout lab-art');
}

function backdrop(sp) {
  if (byId('backdrop').value !== 'landscape') return '';
  return '<div class="field-environment">' + AtlasNaturalistArt.landscape(
    AtlasNaturalistArt.preferredHabitat(sp.habitats), sp.regions[0]?.id, true
  ) + '</div>';
}

function extract(markup, selector) {
  const template = document.createElement('template');
  template.innerHTML = markup;
  return template.content.querySelector(selector);
}

function sample(style, sp, record, px) {
  const halo = byId('halo').value;
  const image = picture(style, sp, record, px, halo);
  const stage = code => '<div class="sample-stage">' + backdrop(sp) + code + '</div>';
  if (mode === 'scales') return stage(image);
  if (mode === 'field' || mode === 'mixed') {
    const entries = [{ name: sp.name, image, amount: mode === 'mixed' ? 2 : 1,
      variant: record.key === 'albino' ? 'Albino' : '', category: halo === 'Normal' ? '' : halo }];
    if (mode === 'mixed') {
      const companion = species.find(item => item.id === (sp.id === 'oc_esp_macrotis_lagotis' ?
        'oc_esp_setonix_brachyurus' : 'oc_esp_macrotis_lagotis'));
      entries.push({ name: companion.name, amount: 1,
        image: picture('natural', companion, companion.variants[0], px, 'Normal') });
    }
    const field = AtlasFieldUI.encounter({ entries, reward: mode === 'mixed' ? '3 avistamientos' : '1 avistamiento' });
    return '<div class="field-stage">' + backdrop(sp) + '<div class="field-encounter">' + field + '</div></div>';
  }
  if (mode === 'journal') {
    const markup = AtlasJournalUI.sheet({ selected: { slot: select.selectedIndex, stage: 2,
      discovered: true, name: sp.name, latin: sp.latin, rarity: sp.rarity, sprite: image, sightings: 12 } });
    const plate = extract(markup, '.j25-plate');
    const portrait = plate.querySelector('.j25-portrait');
    portrait.innerHTML = stage(portrait.querySelector('.atlas-art-frame').outerHTML);
    return plate.outerHTML;
  }
  if (mode === 'bestiary') {
    const markup = AtlasBestiaryUI.cards({ page: 0, pages: 1, matches: 1, cards: [
      { slot: 0, discovered: true, name: sp.name, latin: sp.latin, rarity: sp.rarity, sprite: image, stage: 2, sightings: 12 }
    ] });
    const entry = extract(markup, '.b26-card');
    const card = document.createElement('div');
    card.className = entry.className;
    card.innerHTML = entry.innerHTML;
    const art = card.querySelector('.b26-card-art');
    const parent = document.createElement('div');
    parent.className = art.className;
    parent.innerHTML = stage(art.querySelector('.atlas-art-frame').outerHTML);
    art.replaceWith(parent);
    return card.outerHTML;
  }
  const markup = AtlasMuseumUI.samples({ page: 0, pages: 1, total: 1, pieces: [
    { token: sp.id, owned: true, name: sp.name, latin: sp.latin, art: image, status: 'Expuesta' }
  ] });
  const plate = extract(markup, '.m27-plate');
  const art = plate.querySelector('.m27-art');
  const parent = document.createElement('div');
  parent.className = art.className;
  parent.innerHTML = stage(art.querySelector('.atlas-art-frame').outerHTML);
  art.replaceWith(parent);
  return plate.outerHTML;
}

function render() {
  const { sp, record } = current();
  byId('specimen-name').textContent = sp.name;
  byId('scientific-name').textContent = sp.latin;
  byId('family').textContent = sp.family;
  byId('previous').disabled = select.selectedIndex <= 0;
  byId('next').disabled = select.selectedIndex >= species.length - 1;
  board.dataset.backdrop = byId('backdrop').value;
  board.dataset.mode = mode;
  const px = Number(byId('size').value);
  byId('size-control').hidden = mode === 'scales';
  for (const button of byId('modules').querySelectorAll('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
  const rows = mode === 'scales' ? scales : [px];
  const columnWidth = mode === 'scales' ? 532 : (mode === 'mixed' ? px * 2 + 52 : px + 32);
  board.innerHTML = '<div class="comparison" style="--column:' + columnWidth + 'px">' +
    '<div class="column-headings">' + styles.map(([, title]) => '<h3>' + title + '</h3>').join('') + '</div>' +
    rows.map(size => '<div class="comparison-row" style="--preview-size:' + size + 'px" aria-label="' + size + ' píxeles">' +
      (mode === 'scales' ? '<p class="scale-label">' + size + ' px</p>' : '') +
      styles.map(([style]) => '<article class="sample" data-style="' + style + '">' + sample(style, sp, record, size) + '</article>').join('') +
      '</div>').join('') + '</div>';
  const resolution = Math.max(64, px);
  byId('weights').textContent = mode === 'scales' ? 'La vista de 32 px usa el derivado de 64 px.' :
    'WebP a ' + resolution + ' px · Naturalista ' + bytes(record.natural[resolution]) +
    ' · Científica ' + bytes(record.scientific[resolution]);
}

const reviewKey = (sp, record) => sp.id + '/' + record.key;
function fillReview() {
  const { sp, record } = current();
  const saved = evaluations[reviewKey(sp, record)] || {};
  byId('review-subject').textContent = sp.name + ' · ' + record.label;
  form.reset();
  for (const [key, value] of Object.entries(saved)) {
    const input = form.elements.namedItem(key);
    if (input) input.value = value;
  }
  byId('status').textContent = '';
}
function changeSpecies() {
  const { sp } = current();
  byId('variant').value = '';
  options(byId('variant'), sp.variants.map(record => [record.key, record.label]));
  const categories = ['Normal', 'Notable', 'Épico', 'Excepcional'];
  if (sp.categories.includes('Legendario') && sp.variants.some(record => record.key === 'legendario')) categories.push('Legendario');
  options(byId('halo'), categories.map(category => [category, category]));
  render();
  fillReview();
}
select.addEventListener('change', changeSpecies);
byId('variant').addEventListener('change', () => { render(); fillReview(); });
for (const id of ['halo', 'backdrop', 'size']) byId(id).addEventListener('change', render);
for (const [id, direction] of [['previous', -1], ['next', 1]]) {
  byId(id).addEventListener('click', () => { select.selectedIndex += direction; changeSpecies(); });
}
byId('modules').addEventListener('click', event => {
  const button = event.target.closest('button[data-mode]');
  if (button) { mode = button.dataset.mode; render(); }
});
form.addEventListener('input', () => {
  const { sp, record } = current();
  const values = Object.fromEntries(new FormData(form));
  const key = reviewKey(sp, record);
  if (Object.values(values).some(Boolean)) evaluations[key] = values;
  else delete evaluations[key];
  try {
    localStorage.setItem(storageKey, JSON.stringify(evaluations));
    byId('status').textContent = 'Evaluación guardada en este navegador.';
  } catch {
    byId('status').textContent = 'Exporta el JSON para conservar la evaluación.';
  }
});
form.addEventListener('submit', event => event.preventDefault());

byId('export').addEventListener('click', () => {
  const records = species.flatMap(sp => sp.variants.map(record => {
    const saved = evaluations[reviewKey(sp, record)] || {};
    const scores = Object.fromEntries(['natural', 'scientific'].map(style => [style,
      Object.fromEntries(criteria.map(([key]) => [key, Number(saved[style + '-' + key]) || null]))
    ]));
    return { speciesId: sp.id, scientificName: sp.latin, variant: record.key, available: record.available,
      scores, preference: saved.preference || null, notes: saved.notes || '' };
  }));
  const payload = { schemaVersion: 1, baseVersion: '4.3.0', svgBaseline, records };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'atlas-evaluacion-marsupiales.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

changeSpecies();
