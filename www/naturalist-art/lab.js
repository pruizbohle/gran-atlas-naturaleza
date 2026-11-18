'use strict';

const byId = id => document.getElementById(id);
const content = byId('content');
const search = byId('search');
const species = byId('species');
const group = byId('group');
const family = byId('family');
const context = byId('context');
const scalePlate = byId('scale-plate');
const category = byId('category');
const mixedSvg = byId('mixed-svg');
const storageKey = 'gran-atlas-naturalist-art-review-v1';
const modes = {
  field: 'Campo', mixed: 'Campo mixto', journal: 'Cuaderno', bestiary: 'Bestiario', museum: 'Museo',
  gallery: 'Galería', variants: 'Variantes', frames: 'Ejemplares especiales',
  compare: 'Comparación', scale: 'Escala real', review: 'Revisión artística'
};
const frames = {
  Normal: 'classic', Notable: 'notable', 'Épico': 'epic',
  Excepcional: 'exceptional', Legendario: 'legendary'
};
const statuses = ['Pendiente', 'Aprobada', 'Requiere ajustes', 'Rechazada'];
const text = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const previews = ['field', 'mixed', 'journal', 'bestiary', 'museum'];
let mode = 'field';
let reviewKey = 'normal';
let review = {};
try {
  review = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {
  byId('status').textContent = 'No se pudo recuperar la revisión local.';
}
const percent = (migrationProgress.migrated * 100 / migrationProgress.total).toLocaleString('es-CL', { maximumFractionDigits: 2 });
byId('migration-progress').textContent = migrationProgress.migrated + ' de ' + migrationProgress.total +
  ' especies migradas · ' + percent + ' % · ' + migrationProgress.cutouts + ' de ' + migrationProgress.plates + ' láminas recortadas';
for (const name of new Set(catalog.map(sp => sp.group))) group.add(new Option(name, name));
updateFamilies();
updateSpecies();
for (const sp of mixedFieldSprites) mixedSvg.add(new Option(sp.name, sp.id));

function illustration(sp, record, frame = 'Normal', resolution = 512, eager = false, surface = 'plain') {
  const habitat = AtlasNaturalistArt.preferredHabitat(sp.habitats);
  return AtlasNaturalistArt.render(sp.id, {
    variant: record.key, category: frame, size: resolution, eager, alt: sp.name + ' · ' + record.label,
    surface, habitat, region: sp.regions[0]?.id, classes: 'plate'
  }, () => AtlasNaturalistArt.frame('<span>Lámina pendiente</span>', frame, 'plate'));
}

function figure(markup, caption) {
  return '<figure>' + markup + '<figcaption>' + text(caption) + '</figcaption></figure>';
}

function matchingSpecies() {
  const query = normalize(search.value.trim());
  return catalog.filter(sp => (!group.value || sp.group === group.value) &&
    (!family.value || sp.family === family.value) && normalize(sp.name + ' ' + sp.latin).includes(query));
}

function updateFamilies() {
  const names = [...new Set(catalog.filter(sp => !group.value || sp.group === group.value).map(sp => sp.family))]
    .sort((a, b) => a.localeCompare(b));
  selectOptions(family, [['', 'Todas'], ...names.map(name => [name, name])]);
}

function updateSpecies() {
  const selected = species.value;
  selectOptions(species, matchingSpecies().map(sp => [sp.id, sp.name]));
  if (species.value !== selected) {
    reviewKey = 'normal';
    scalePlate.value = 'normal';
  }
}

function gallery() {
  const shown = matchingSpecies();
  byId('summary').textContent = shown.length + ' de ' + catalog.length + ' especies';
  return shown.length ? '<div class="grid gallery">' + shown.map(sp =>
    '<button type="button" class="gallery-card" data-species="' + text(sp.id) + '">' +
    illustration(sp, sp.records[0], 'Normal', 256) + '<span class="card-title">' + text(sp.name) + '</span><span class="latin">' +
    text(sp.latin) + '</span></button>').join('') + '</div>' : '<p>No se encontraron especies.</p>';
}

function specimenPlate(sp, frame) {
  return sp.records.find(record => record.key === (frame === 'Legendario' ? 'legendario' : 'normal')) || sp.records[0];
}

function specialFrames(sp) {
  const samples = sp.categories.map(frame => figure(illustration(sp, specimenPlate(sp, frame), frame), frame));
  return '<div class="grid frame-grid">' + samples.join('') + '</div>';
}

function selectOptions(select, entries) {
  const selected = select.value;
  select.replaceChildren(...entries.map(([key, label]) => new Option(label, key)));
  if (entries.some(([key]) => selected === key)) select.value = selected;
}

function selectedPlate(sp, frame = 'Normal') {
  const records = sp.records.filter(record => (record.key === 'legendario') === (frame === 'Legendario'));
  selectOptions(scalePlate, records.map(record => [record.key, record.label]));
  return records.find(record => record.key === scalePlate.value) || specimenPlate(sp, frame);
}

function gamePreview(sp) {
  selectOptions(category, sp.categories.map(frame => [frame, frame]));
  const frame = category.value;
  const record = selectedPlate(sp, frame);
  const compact = mode === 'field' || mode === 'mixed';
  const surface = compact ? 'field' : mode;
  const art = illustration(sp, record, frame, compact ? 128 : mode === 'journal' ? 256 : 512, compact, surface);
  const environment = compact ? AtlasNaturalistArt.landscape(
    AtlasNaturalistArt.preferredHabitat(sp.habitats), sp.regions[0]?.id, true) : '';
  const title = '<h3>' + text(sp.name) + '</h3>';
  const latin = '<p class="latin">' + text(sp.latin) + '</p>';
  const occurrence = '<span class="specimen-label ' + frames[frame] + '">' + text(frame) + '</span>';
  const variant = '<p>Variante: ' + text(record.label) + '</p>';
  const zone = sp.regions[0];
  if (mode === 'mixed') {
    const companion = mixedFieldSprites.find(item => item.id === mixedSvg.value);
    const entries = [
      { name: sp.name, image: record.src ? art : sp.sprite, amount: 2, category: frame === 'Normal' ? '' : frame },
      { name: companion.name, image: companion.sprite, amount: 1 }
    ];
    return '<article class="mixed-field" aria-label="Comparación de avistamiento mixto">' +
      environment + AtlasFieldUI.encounter({ entries, reward: '3 avistamientos' }) +
      '<p>' + text(sp.name + (record.src ? ' · WebP' : ' · SVG de respaldo') + ' / ' + companion.name + ' · SVG') + '</p></article>';
  }
  if (mode === 'field') {
    return '<article class="field-card"><header>' + text(zone?.name || 'Avistamiento') + '</header>' +
      '<div class="encounter">' + environment + art + '<div>' + title + occurrence +
      (record.key === 'normal' ? '' : variant) + '</div></div></article>';
  }
  if (mode === 'journal') {
    return '<article class="journal-sheet"><div class="folio">Diario del naturalista</div><div class="journal-entry">' +
      art + '<div>' + title + latin + variant + occurrence + '</div></div></article>';
  }
  const layout = mode === 'museum' ? 'bestiary-entry museum-entry' : 'bestiary-entry';
  const continents = [...new Set(sp.regions.map(region => region.continent))].join(', ');
  return '<article class="' + layout + '">' + art + '<div class="bestiary-details">' + title + latin +
    '<dl><dt>Grupo</dt><dd>' + text(sp.group + ' · ' + sp.family) + '</dd><dt>Variante</dt><dd>' + text(record.label) + '</dd>' +
    (continents ? '<dt>Continente</dt><dd>' + text(continents) + '</dd>' : '') +
    (sp.rarity ? '<dt>Rareza de la especie</dt><dd>' + text(sp.rarity) + '</dd>' : '') +
    '</dl>' + occurrence + '</div></article>';
}

function scale(sp) {
  selectOptions(scalePlate, sp.records.map(record => [record.key, record.label]));
  const record = sp.records.find(item => item.key === scalePlate.value) || sp.records[0];
  return '<div class="scale-list">' + [32, 48, 64, 96, 128, 256, 512].map(size =>
    '<figure class="sample ' + (size === 512 ? 'full' : '') + '" style="--size:' + size + 'px" data-context="' +
    text(context.value) + '">' + illustration(sp, record, 'Normal', [64, 128, 256, 512].find(resolution => resolution >= size)) + '<h3>' + text(sp.name) +
    '</h3><figcaption>' + (size === 512 ? 'Completo · 512 px' : size + ' px') +
    '</figcaption></figure>').join('') + '</div>';
}

function reviewForm(sp) {
  const record = sp.records.find(item => item.key === reviewKey) || sp.records[0];
  const current = review[sp.id + '/' + record.key] || {};
  return '<div class="review">' + illustration(sp, record) +
    '<div class="review-fields"><label>Lámina<select id="review-plate">' +
    sp.records.map(item => '<option value="' + text(item.key) + '"' + (item === record ? ' selected' : '') +
      '>' + text(item.label) + '</option>').join('') +
    '</select></label><label>Estado<select id="review-status" ' + (record.src ? '' : 'disabled') + '>' +
    statuses.map(label => '<option' + (label === current.status ? ' selected' : '') + '>' +
      text(label) + '</option>').join('') +
    '</select></label><label>Observaciones<textarea id="review-note" rows="6">' +
    text(current.note || '') + '</textarea></label></div></div>';
}

function draw() {
  const sp = catalog.find(item => item.id === species.value);
  byId('heading').textContent = modes[mode];
  byId('mixed-control').hidden = mode !== 'mixed';

  byId('species-control').hidden = mode === 'gallery';
  byId('context-control').hidden = mode !== 'scale';
  byId('scale-plate-control').hidden = mode !== 'scale' && !previews.includes(mode);
  byId('category-control').hidden = !previews.includes(mode);
  byId('export').hidden = mode !== 'review';
  byId('summary').textContent = mode === 'gallery' ? '' : (sp?.latin || '');
  for (const button of document.querySelectorAll('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
  if (!sp && mode !== 'gallery') {
    content.innerHTML = '<p>No se encontraron especies.</p>';
    return;
  }
  switch (mode) {
    case 'field':
    case 'mixed':
    case 'journal':
    case 'bestiary':
    case 'museum': content.innerHTML = gamePreview(sp); break;
    case 'gallery': content.innerHTML = gallery(); break;
    case 'variants': {
      const variants = sp.records.filter(record => record.key !== 'legendario');
      content.innerHTML = (variants.length === 1 ? '<p class="note">Esta especie solo tiene representación normal en el catálogo.</p>' : '') +
        '<div class="pair variants' + (variants.length === 1 ? ' group' : '') + '">' +
        variants.map(record => figure(illustration(sp, record), record.label)).join('') + '</div>';
      break;
    }
    case 'frames': content.innerHTML = specialFrames(sp); break;
    case 'compare':
      content.innerHTML = '<div class="pair">' +
        figure('<div class="atlas-art-frame classic plate sprite" role="img" aria-label="Sprite de ' + text(sp.name) + '">' + sp.sprite + '</div>', 'Sprite actual') +
        figure(illustration(sp, sp.records[0]), 'Ilustración naturalista') + '</div>';
      break;
    case 'scale': content.innerHTML = scale(sp); break;
    case 'review': content.innerHTML = reviewForm(sp); break;
  }
}

function saveReview() {
  const record = byId('review-plate').value;
  review[species.value + '/' + record] = { status: byId('review-status').value, note: byId('review-note').value };
  try {
    localStorage.setItem(storageKey, JSON.stringify(review));
    byId('status').textContent = 'Revisión guardada en este dispositivo.';
  } catch {
    byId('status').textContent = 'Almacenamiento local no disponible. Exporta el JSON para conservar la revisión.';
  }
}

byId('modes').addEventListener('click', event => {
  const button = event.target.closest('[data-mode]');
  if (button) {
    mode = button.dataset.mode;
    draw();
  }
});
content.addEventListener('click', event => {
  const card = event.target.closest('[data-species]');
  if (card) {
    species.value = card.dataset.species;
    mode = 'compare';
    draw();
    species.focus();
  }
});
content.addEventListener('input', event => {
  if (event.target.id === 'review-note') saveReview();
});
content.addEventListener('change', event => {
  if (event.target.id === 'review-plate') {
    reviewKey = event.target.value;
    draw();
    byId('review-plate').focus();
  }
  if (event.target.id === 'review-status') saveReview();
});
function applyFilters() {
  updateSpecies();
  draw();
}
search.addEventListener('input', applyFilters);
group.addEventListener('change', () => {
  updateFamilies();
  applyFilters();
});
family.addEventListener('change', applyFilters);
species.addEventListener('change', () => {
  reviewKey = 'normal';
  scalePlate.value = 'normal';
  draw();
});
context.addEventListener('change', draw);
scalePlate.addEventListener('change', draw);
category.addEventListener('change', draw);
mixedSvg.addEventListener('change', draw);
byId('frame-style').addEventListener('change', event => {
  content.dataset.frameStyle = event.target.value;
});
byId('export').addEventListener('click', () => {
  const results = catalog.flatMap(sp => sp.records.map(record => ({
    speciesId: sp.id, scientificName: sp.latin, variant: record.key, file: record.src,
    ...(review[sp.id + '/' + record.key] || { status: 'Pendiente', note: '' })
  })));
  const data = new Blob([JSON.stringify({ schemaVersion: 1, results }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'revision-naturalista.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register('../sw.js').catch(() => {
    byId('status').textContent = 'No se pudo preparar el acceso sin conexión.';
  });
}
draw();
