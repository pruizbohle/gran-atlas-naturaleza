'use strict';

const byId = id => document.getElementById(id);
const content = byId('content');
const search = byId('search');
const species = byId('species');
const group = byId('group');
const birdOrder = byId('bird-order');
const family = byId('family');
const cutState = byId('cut-state');
const context = byId('context');
const scalePlate = byId('scale-plate');
const category = byId('category');
const mixedSvg = byId('mixed-svg');
const raptorSet = byId('raptor-set');
const raptorSize = byId('raptor-size');
const storageKey = 'gran-atlas-naturalist-art-review-v1';
const modes = {
  field: 'Campo', mixed: 'Campo mixto', journal: 'Cuaderno', bestiary: 'Bestiario', museum: 'Museo',
  gallery: 'Galería', variants: 'Variantes', frames: 'Ejemplares especiales',
  compare: 'Comparar estilos', raptors: 'Comparar rapaces',
  compression: 'Compresión WebP', scale: 'Escala real', review: 'Revisión artística'
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
  ' especies migradas · ' + percent + ' % · ' + migrationProgress.classical + ' de ' + migrationProgress.target +
  ' láminas científicas · ' + migrationProgress.biological + ' variantes biológicas · ' +
  migrationProgress.legendary + ' legendarios · ' + migrationProgress.mammalsMigrated + ' de ' +
  migrationProgress.mammals + ' mamíferos · ' + migrationProgress.birdsMigrated + ' de ' +
  migrationProgress.birds + ' aves';
for (const name of new Set(catalog.map(sp => sp.group))) group.add(new Option(name, name));
selectOptions(birdOrder, [['', 'Todos'], ...[...new Set(catalog.flatMap(sp => sp.order ? [sp.order] : []))]
  .sort().map(name => [name, name])]);
selectOptions(raptorSet, Object.entries(raptorComparisons).map(([key, set]) => [key, set.label]));
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

function cutStatus(record) {
  return !record.cutout ? 'pending' : record.note ? 'review' : 'ready';
}

function matchingPlates(sp) {
  const state = cutState.value;
  return sp.records.filter(record => {
    const matches = state === 'classical' ? record.classical :
      state === 'previous' ? !record.classical : !state || cutStatus(record) === state;
    return matches && (mode !== 'compression' || Object.keys(record.compression).length);
  });
}

function matchesTaxonomy(sp) {
  return (!group.value || sp.group === group.value) && (!birdOrder.value || sp.order === birdOrder.value);
}

function matchingSpecies() {
  const query = normalize(search.value.trim());
  return catalog.filter(sp => matchesTaxonomy(sp) &&
    (!family.value || sp.family === family.value) && matchingPlates(sp).length &&
    normalize(sp.name + ' ' + sp.latin).includes(query));
}

function updateFamilies() {
  const names = [...new Set(catalog.filter(matchesTaxonomy).map(sp => sp.family))]
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
    illustration(sp, matchingPlates(sp)[0], 'Normal', 256) + '<span class="card-title">' + text(sp.name) + '</span><span class="latin">' +
    text(sp.latin) + '</span></button>').join('') + '</div>' : '<p>No se encontraron especies.</p>';
}

function specimenPlate(sp, frame) {
  return sp.records.find(record => record.key === (frame === 'Legendario' ? 'legendario' : 'normal')) || sp.records[0];
}

function specialFrames(sp) {
  const samples = sp.categories.map(frame => figure(illustration(sp, specimenPlate(sp, frame), frame), frame));
  return '<div class="grid frame-grid review-comparison">' + samples.join('') + '</div>';
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

function compareImage(asset, label, frame = 'Normal') {
  const image = '<img class="atlas-art-image" src="' + text(asset.src) + '" alt="' + text(label) + '" decoding="async">';
  return AtlasNaturalistArt.frame(image, frame, 'plate atlas-art-cutout');
}

function comparisonPlaceholder(message) {
  return AtlasNaturalistArt.frame('<span class="comparison-placeholder">' + text(message) + '</span>', 'Normal', 'plate');
}

function compareStyles(sp) {
  const records = matchingPlates(sp);
  selectOptions(scalePlate, records.map(record => [record.key, record.label]));
  const record = records.find(item => item.key === scalePlate.value) || records[0];
  const frame = record.key === 'legendario' ? 'Legendario' : 'Normal';
  if (byId('comparison-source').value === 'original') {
    const before = record.before ? compareImage(record.before, sp.name + ' · original', frame) :
      comparisonPlaceholder('Original con fondo no disponible');
    const after = record.previous ? compareImage(record.previous, sp.name + ' · recorte anterior', frame) :
      comparisonPlaceholder('Recorte anterior no disponible');
    return '<div class="pair review-comparison">' + figure(before, 'Original con fondo') +
      figure(after, 'Recorte Serie 4.3') + '</div>';
  }
  const svg = AtlasNaturalistArt.frame('<span class="atlas-art-image legacy-sprite" role="img" aria-label="' +
    text(sp.name + ' · SVG original') + '">' + (record.svg || sp.sprite) + '</span>', frame, 'plate atlas-art-cutout');
  const previous = record.previous ? compareImage(record.previous, sp.name + ' · naturalista', frame) :
    comparisonPlaceholder('Sin lámina naturalista previa');
  const current = record.classical ? illustration(sp, record, frame, 256, true) :
    comparisonPlaceholder('Lámina científica pendiente');
  return '<div class="review-comparison comparison-styles">' +
    figure(svg, 'SVG · Serie 3') + figure(previous, 'Naturalista · Serie 4.3') +
    figure(current, 'Científica clásica') + '</div>';
}

function compareRaptors() {
  const size = Number(raptorSize.value);
  const cards = raptorComparisons[raptorSet.value].birds.map(({ id, trait }) => {
    const sp = catalog.find(item => item.id === id);
    return '<figure>' + illustration(sp, specimenPlate(sp, 'Normal'), 'Normal', size, true) +
      '<figcaption><strong>' + text(sp.name) + '</strong><p class="latin">' + text(sp.latin) +
      '</p><p>' + text(trait) + '</p></figcaption></figure>';
  });
  return '<div class="comparison-styles review-comparison raptor-comparison" style="--raptor-size:' +
    size + 'px">' + cards.join('') + '</div>';
}

function compression(sp) {
  const records = matchingPlates(sp);
  selectOptions(scalePlate, records.map(record => [record.key, record.label]));
  const record = records.find(item => item.key === scalePlate.value) || records[0];
  if (!record) return '<p class="note">Esta lámina no forma parte de la muestra de compresión. Selecciona una especie de la lista.</p>';
  const quality = byId('compression-quality').value;
  const sample = record.compression[quality];
  const weight = bytes => (bytes / 1024).toLocaleString('es-CL', { maximumFractionDigits: 1 }) + ' KiB';
  return '<div class="pair review-comparison">' +
    figure(compareImage(sample, sp.name + ' · calidad ' + quality), 'Calidad ' + quality + ' · ' + weight(sample.bytes)) +
    figure(illustration(sp, record, 'Normal', 512, true), 'Versión del juego · ' + weight(record.bytes)) +
    '</div><p class="note">512 px · Mismo recorte y canal alfa en las cinco muestras.</p>';
}

function reviewForm(sp) {
  const records = matchingPlates(sp);
  const record = records.find(item => item.key === reviewKey) || records[0];
  const current = review[sp.id + '/' + record.key] || {};
  return '<div class="review"><div class="review-comparison">' + illustration(sp, record) + '</div>' +
    '<div class="review-fields"><label>Lámina<select id="review-plate">' +
    records.map(item => '<option value="' + text(item.key) + '"' + (item === record ? ' selected' : '') +
      '>' + text(item.label) + '</option>').join('') +
    '</select></label><label>Estado<select id="review-status" ' + (record.src ? '' : 'disabled') + '>' +
    statuses.map(label => '<option' + (label === current.status ? ' selected' : '') + '>' +
      text(label) + '</option>').join('') +
    '</select></label><label>Observaciones<textarea id="review-note" rows="6">' +
    text(current.note || '') + '</textarea></label>' +
    (record.note ? '<p class="note">' + text(record.note) + '</p>' : '') + '</div></div>';
}

function draw() {
  const sp = catalog.find(item => item.id === species.value);
  const comparingRaptors = mode === 'raptors';
  byId('heading').textContent = modes[mode];
  byId('mixed-control').hidden = mode !== 'mixed';

  for (const label of document.querySelectorAll('[data-catalog-filter]')) label.hidden = comparingRaptors;
  byId('order-control').hidden = comparingRaptors || Boolean(group.value && group.value !== 'Rapaces');
  byId('raptor-set-control').hidden = !comparingRaptors;
  byId('raptor-size-control').hidden = !comparingRaptors;
  byId('species-control').hidden = mode === 'gallery' || comparingRaptors;
  byId('context-control').hidden = mode !== 'scale';
  byId('scale-plate-control').hidden = !['scale', 'compare', 'compression', ...previews].includes(mode);
  byId('backdrop-control').hidden = !['compare', 'raptors', 'compression', 'review', 'frames'].includes(mode);
  byId('compression-control').hidden = mode !== 'compression';
  byId('comparison-control').hidden = mode !== 'compare';
  byId('category-control').hidden = !previews.includes(mode);
  byId('export').hidden = mode !== 'review';
  byId('summary').textContent = mode === 'gallery' || comparingRaptors ? '' : (sp?.latin || '');
  for (const button of document.querySelectorAll('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
  if (comparingRaptors) {
    content.innerHTML = compareRaptors();
    return;
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
    case 'compare': content.innerHTML = compareStyles(sp); break;
    case 'compression': content.innerHTML = compression(sp); break;
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
    applyFilters();
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
  if (group.value && group.value !== 'Rapaces') birdOrder.value = '';
  updateFamilies();
  applyFilters();
});
birdOrder.addEventListener('change', () => {
  updateFamilies();
  applyFilters();
});
family.addEventListener('change', applyFilters);
cutState.addEventListener('change', applyFilters);
species.addEventListener('change', () => {
  reviewKey = 'normal';
  scalePlate.value = 'normal';
  draw();
});
context.addEventListener('change', draw);
scalePlate.addEventListener('change', draw);
category.addEventListener('change', draw);
mixedSvg.addEventListener('change', draw);
byId('compression-quality').addEventListener('change', draw);
byId('comparison-source').addEventListener('change', draw);
raptorSet.addEventListener('change', draw);
raptorSize.addEventListener('change', draw);
byId('backdrop').addEventListener('change', event => {
  content.dataset.backdrop = event.target.value;
});
byId('frame-style').addEventListener('change', event => {
  content.dataset.frameStyle = event.target.value;
});
byId('export').addEventListener('click', () => {
  const results = catalog.flatMap(sp => sp.records.map(record => ({
    speciesId: sp.id, scientificName: sp.latin, variant: record.key, file: record.src,
    cutout: cutStatus(record), cutoutNote: record.note, classical: record.classical,
    ...(review[sp.id + '/' + record.key] || { status: 'Pendiente', note: '' })
  })));
  const data = new Blob([JSON.stringify({ schemaVersion: 2, migration: migrationProgress, results }, null, 2)], { type: 'application/json' });
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
  const button = byId('review-offline');
  const size = (AtlasNaturalistAssets.labBytes / 1e6).toLocaleString('es-CL', { maximumFractionDigits: 1 });
  button.textContent = 'Descargar comparaciones offline · ' + size + ' MB';
  button.hidden = false;
  button.addEventListener('click', async () => {
    button.disabled = true;
    const status = byId('status');
    status.textContent = 'Preparando comparaciones…';
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration?.active) throw Error('Service worker inactive');
      const channel = new MessageChannel();
      const timeout = setTimeout(() => finish(false), 150000);
      function finish(success) {
        clearTimeout(timeout);
        channel.port1.close();
        button.disabled = false;
        status.textContent = success ? 'Comparaciones listas para usar sin conexión.' :
          'La descarga quedó incompleta. Puedes volver a intentarlo.';
      }
      channel.port1.onmessage = ({ data }) => {
        if (data.done || data.failed) finish(Boolean(data.done));
        else status.textContent = 'Descargando comparaciones · ' + data.complete + ' de ' + data.total;
      };
      registration.active.postMessage({ type: 'ATLAS_CACHE_NATURALIST_REVIEW' }, [channel.port2]);
    } catch {
      button.disabled = false;
      status.textContent = 'El caché del juego aún se está preparando. Intenta la descarga de nuevo cuando termine.';
    }
  });
}
draw();
