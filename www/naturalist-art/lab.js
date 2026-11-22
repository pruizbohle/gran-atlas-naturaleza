'use strict';

const content = byId('content');
const search = byId('search');
const species = byId('species');
const group = byId('group');
const birdOrder = byId('bird-order');
const family = byId('family');
const releaseScope = byId('release-scope');
const cutState = byId('cut-state');
const context = byId('context');
const scalePlate = byId('scale-plate');
const category = byId('category');
const mixedSvg = byId('mixed-svg');
const birdSet = byId('bird-set');
const comparisonSize = byId('comparison-size');
const comparisonHalo = byId('comparison-halo');
const variantView = byId('variant-view');
const pigmentViews = new Set(['albino', 'melanico', 'pigments']);
for (const [value, label] of [
  ['albino', 'Todos los albinos'],
  ['melanico', 'Todos los melánicos'],
  ['pigments', 'Todos los albinos y melánicos']
]) variantView.add(new Option(label, value));
const storageKey = 'gran-atlas-naturalist-art-review-v1';
const modes = {
  field: 'Campo', mixed: 'Campo mixto', journal: 'Cuaderno', bestiary: 'Bestiario', museum: 'Museo',
  gallery: 'Galería', variants: 'Variantes', 'pigment-audit': 'Visor de albinos y melánicos', art01: 'Variantes revisadas en ART-01', art02: 'Variantes revisadas en ART-02', art03: 'Variantes revisadas en ART-03', art04: 'Variantes corregidas en ART-04', art05: 'Variantes corregidas en ART-05', art06: 'Variantes corregidas en ART-06', art07: 'Variantes revisadas en ART-07', art08: 'Variantes revisadas en ART-08', frames: 'Ejemplares especiales',
  compare: 'Comparar estilos', birds: 'Comparar aves', reptiles: 'Comparar reptiles', amphibians: 'Comparar anfibios', cartilaginous: 'Comparar tiburones y rayas',
  salmonids: 'Comparar salmónidos', freshwater: 'Comparar peces de agua dulce', reef: 'Comparar peces de arrecife', deep: 'Comparar peces de aguas profundas', marine: 'Comparar peces marinos', cephalopods: 'Comparar cefalópodos', legendary: 'Colección de legendarios',
  compression: 'Compresión WebP', scale: 'Escala real', 'visual-scale': 'Ajustes de escala', review: 'Revisión artística'
};
const taxonComparisons = {
  birds: birdComparisons, reptiles: reptileComparisons, amphibians: amphibianComparisons,
  cartilaginous: cartilaginousComparisons, salmonids: salmonidComparisons,
  freshwater: freshwaterComparisons, reef: reefComparisons, deep: deepSeaComparisons, marine: marineComparisons, cephalopods: cephalopodComparisons, legendary: legendaryComparisons
};
const frames = {
  Normal: 'classic', Notable: 'notable', 'Épico': 'epic',
  Excepcional: 'exceptional', Legendario: 'legendary'
};
const statuses = ['Pendiente', 'Aprobada', 'Requiere ajustes', 'Rechazada'];
const previews = ['field', 'mixed', 'journal', 'bestiary', 'museum'];
let mode = new URLSearchParams(location.search).get('view') === 'pigment-audit' ? 'pigment-audit' : 'field';
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
  migrationProgress.birds + ' aves · ' + migrationProgress.reptilesMigrated + ' de ' + migrationProgress.reptiles + ' reptiles · ' +
  migrationProgress.amphibiansMigrated + ' de ' + migrationProgress.amphibians + ' anfibios · ' +
  migrationProgress.cartilaginousMigrated + ' de ' + migrationProgress.cartilaginous + ' tiburones y rayas · ' +
  migrationProgress.salmonidsMigrated + ' de ' + migrationProgress.salmonids + ' salmónidos · ' +
  migrationProgress.freshwaterMigrated + ' de ' + migrationProgress.freshwater + ' peces dulceacuícolas y estuarinos · ' +
  migrationProgress.reefMigrated + ' de ' + migrationProgress.reef + ' peces de arrecife · ' +
  migrationProgress.deepSeaMigrated + ' de ' + migrationProgress.deepSea + ' peces de aguas profundas · ' +
  migrationProgress.marineMigrated + ' de ' + migrationProgress.marine + ' peces marinos · ' +
  migrationProgress.cephalopodsMigrated + ' de ' + migrationProgress.cephalopods + ' cefalópodos';
for (const name of new Set(catalog.map(sp => sp.group))) group.add(new Option(name, name));
selectOptions(comparisonHalo, Object.keys(frames).map(label => [label, label]));
updateOrders();
updateFamilies();
updateSpecies();
for (const sp of mixedFieldSprites) mixedSvg.add(new Option(sp.name, sp.id));

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

function matchesGroup(sp) {
  return !group.value || sp.group === group.value;
}

function matchesTaxonomy(sp) {
  return matchesGroup(sp) && (!birdOrder.value || sp.order === birdOrder.value);
}

function matchingSpecies() {
  const query = normalize(search.value.trim());
  const scope = releaseScope.value;
  return catalog.filter(sp => matchesTaxonomy(sp) &&
    (!family.value || sp.family === family.value) && matchingPlates(sp).length &&
    (!scope || (scope === 'catalog' ? sp.catalogChange : scope === 'new' ? sp.catalogChange === 'new' : sp.edition === scope)) &&
    normalize(sp.name + ' ' + sp.latin).includes(query));
}

function updateOrders() {
  const orders = [...new Set(catalog.filter(sp => sp.order && matchesGroup(sp)).map(sp => sp.order))].sort();
  selectOptions(birdOrder, [['', 'Todos'], ...orders.map(order => [order, order])]);
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

function pigmentGallery() {
  const view = variantView.value;
  const keys = view === 'pigments' ? ['albino', 'melanico'] : [view];
  const rows = matchingSpecies().map(sp => ({
    sp, variants: matchingPlates(sp).filter(record => keys.includes(record.key))
  })).filter(row => row.variants.length).sort((a, b) =>
    a.sp.name.localeCompare(b.sp.name, 'es'));
  const count = rows.reduce((total, row) => total + row.variants.length, 0);
  const pending = rows.reduce((total, row) => total + row.variants.filter(record => !record.src).length, 0);
  byId('summary').textContent = rows.length + ' especies · ' + count + ' variantes' +
    (pending ? ' · ' + pending + ' sin lámina científica' : '');
  if (!rows.length) return '<p>No se encontraron variantes con estos filtros.</p>';
  const size = Number(comparisonSize.value);
  return '<p class="note">Comparación con la lámina normal de cada especie; solo se incluyen variantes configuradas en el catálogo.</p>' +
    '<div class="grid pigment-gallery" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))">' +
    rows.map(({ sp, variants }) => {
      const records = [sp.records.find(record => record.key === 'normal'), ...variants].filter(Boolean);
      return '<article class="gallery-card" data-pigment-species="' + text(sp.id) + '">' +
        '<h3>' + text(sp.name) + '</h3><p class="latin">' + text(sp.latin) + '</p>' +
        '<div class="pair review-comparison plate-comparison" style="--comparison-size:' + size +
        'px;grid-template-columns:repeat(' + records.length + ',minmax(0,1fr))">' +
        records.map(record => '<div data-pigment-key="' + text(record.key) + '">' +
          figure(illustration(sp, record, comparisonHalo.value, size, false),
            record.label + (record.src ? '' : ' · Lámina científica pendiente')) + '</div>').join('') +
        '</div></article>';
    }).join('') + '</div>';
}

const artReviews = { art01: art01Review, art02: art02Review, art03: art03Review, art04: art04Review, art05: art05Review, art06: art06Review, art07: art07Review, art08: art08Review };
let auditView;

function artComparisons(lot) {
  const speciesById = new Map(matchingSpecies().map(sp => [sp.id, sp]));
  const rows = artReviews[lot].filter(row => speciesById.has(row.id));
  const releases = Object.values(artReviews).flat();
  const size = Number(comparisonSize.value);
  byId('summary').textContent = rows.length + ' variantes del lote';
  if (!rows.length) return '<p>No se encontraron variantes con estos filtros.</p>';
  return rows.map(row => {
    const sp = speciesById.get(row.id);
    const normal = sp.records.find(record => record.key === 'normal');
    const variant = sp.records.find(record => record.key === row.variant);
    const replacement = releases.find(item => item.id === row.id && item.replaces === row.variant);
    const variantLabel = variant?.label || (replacement ? replacement.previousLabel : row.variant);
    const savedImage = (src, label) => archivedIllustration(src, sp.name + ' · ' + variantLabel + ' · ' + label, size);
    const previous = row.before?.[size];
    const legacy = row.legacy?.[size];
    const subsequent = releases.find(item =>
      (item.supersedes === lot || item.supersedesArt01 && lot === 'art01') &&
      item.id === row.id && item.variant === row.variant);
    const published = replacement?.before[size] || subsequent?.before[size];
    const publishedLabel = replacement ? 'Melánica retirada en ART-06' : 'Variante de ART-' + lot.slice(-2);
    const previousLabel = row.previousLabel ? row.previousLabel + ' · variante retirada' : 'Variante anterior';
    const status = replacement ? 'Variante retirada en ART-06' : row.status;
    const legacyLabel = lot === 'art03' ? 'Anterior a ART-02' : 'Anterior a ART-01';
    const caption = row.caption || (previous ? 'Variante corregida' : 'Variante vigente');
    const images = [
      figure(illustration(sp, normal, 'Normal', size), 'Lámina normal'),
      ...(legacy ? [figure(savedImage(legacy, legacyLabel), legacyLabel)] : []),
      ...(previous ? [figure(savedImage(previous, previousLabel), previousLabel)] : []),
      figure(published ? savedImage(published, publishedLabel) : illustration(sp, variant, 'Normal', size),
        published ? publishedLabel : caption)
    ];
    const morph = row.morph ? '<dl class="morph-facts"><dt>Categoría del juego</dt><dd>' + text(variantLabel) +
      '</dd><dt>Morfo</dt><dd>' + text(row.morph) + ' · ' + text(row.evidence) + '</dd>' +
      (row.eye ? '<dt>Iris representado</dt><dd>' + text(row.eye) + '</dd>' : '') +
      (row.version ? '<dt>Última corrección</dt><dd>V' + text(row.version) + '</dd>' : '') + '</dl>' : '';
    return '<article class="art01-comparison gallery-card" data-' + lot + '-species="' + text(row.id) +
      '" data-' + lot + '-variant="' + text(row.variant) + '"><h3>' + text(sp.name + ' · ' + variantLabel) +
      '</h3><p class="latin">' + text(sp.latin) + '</p><p><strong>' + text(status) +
      '</strong>' + (row.interpretation ? ' · ' + text(row.interpretation) : '') + '</p>' + morph + '<p>' + text(row.note) +
      '</p><div class="comparison-styles review-comparison plate-comparison" style="--comparison-size:' +
      size + 'px">' + images.join('') + '</div></article>';
  }).join('');
}

function specimenPlate(sp, frame) {
  return sp.records.find(record => record.key === (frame === 'Legendario' ? 'legendario' : 'normal')) || sp.records[0];
}

function specialFrames(sp) {
  const samples = sp.categories.map(frame => figure(illustration(sp, specimenPlate(sp, frame), frame), frame));
  return '<div class="grid frame-grid review-comparison">' + samples.join('') + '</div>';
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
      '<p>' + text(sp.name + (record.src ? ' · WebP' : ' · SVG de respaldo') + ' / ' + companion.name + ' · SVG histórico') + '</p></article>';
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
    text(context.value) + '">' + illustration(sp, record, 'Normal', [64, 128, 256, 512].find(resolution => resolution >= size), false, 'plain', size === 512) + '<h3>' + text(sp.name) +
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
  const history = record.previousLabel ? ' · ' + record.previousLabel + ' histórico' : '';
  if (byId('comparison-source').value === 'original') {
    const before = record.before ? compareImage(record.before, sp.name + ' · original' + history, frame) :
      comparisonPlaceholder('Original con fondo no disponible');
    const after = record.previous ? compareImage(record.previous, sp.name + ' · recorte anterior' + history, frame) :
      comparisonPlaceholder('Recorte anterior no disponible');
    return '<div class="pair review-comparison">' + figure(before, 'Original con fondo' + history) +
      figure(after, 'Recorte Serie 4.3' + history) + '</div>';
  }
  const svg = sp.catalogChange === 'new' ? comparisonPlaceholder('Sin lámina histórica') :
    AtlasNaturalistArt.frame('<span class="atlas-art-image legacy-sprite" role="img" aria-label="' +
      text(sp.name + ' · SVG original') + '">' + (record.svg || sp.sprite) + '</span>', frame, 'plate atlas-art-cutout');
  const previous = record.previous ? compareImage(record.previous, sp.name + ' · naturalista' + history, frame) :
    comparisonPlaceholder('Sin lámina naturalista previa');
  const current = record.classical ? illustration(sp, record, frame, 256, true) :
    comparisonPlaceholder('Lámina científica pendiente');
  return '<div class="review-comparison comparison-styles">' +
    figure(svg, 'SVG · Serie 3') + figure(previous, 'Naturalista · Serie 4.3' + history) +
    figure(current, 'Científica clásica') + '</div>';
}

function compareTaxa(sets, key) {
  selectOptions(birdSet, Object.entries(sets).map(([id, set]) => [id, set.label]));
  const size = Number(comparisonSize.value);
  const cards = sets[birdSet.value][key].map(({ id, trait, plateKey }) => {
    const sp = catalog.find(item => item.id === id);
    const plate = plateKey ? sp.records.find(record => record.key === plateKey) : specimenPlate(sp, 'Normal');
    const name = plateKey ? sp.name + ' · ' + plate.label : sp.name;
    const halo = key === 'legendary' ? 'Legendario' : comparisonHalo.value;
    return '<figure>' + illustration(sp, plate, halo, size, true) +
      '<figcaption><strong>' + text(name) + '</strong><p class="latin">' + text(sp.latin) +
      '</p><p>' + text(trait) + '</p></figcaption></figure>';
  });
  return '<div class="comparison-styles review-comparison taxon-comparison" style="--comparison-size:' +
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

function compareVisualScales() {
  const size = Number(comparisonSize.value);
  const halo = comparisonHalo.value;
  const percent = new Intl.NumberFormat('es-CL', { style: 'percent', maximumFractionDigits: 2 });
  return Object.keys(AtlasNaturalistAssets.visualScales || {}).map(id => {
    const sp = catalog.find(entry => entry.id === id);
    const record = specimenPlate(sp, 'Normal');
    const before = illustration(sp, record, halo, size, true, 'plain', true);
    const after = illustration(sp, record, halo, size, true);
    return '<section class="visual-scale-pair" data-visual-species="' + text(id) + '"><h3>' + text(sp.name) +
      '</h3><p class="latin">' + text(sp.latin) + '</p><div class="comparison-styles review-comparison plate-comparison" style="--comparison-size:' +
      size + 'px">' + figure(before, 'Antes · ' + percent.format(1)) +
      figure(after, 'Después · ' + percent.format(AtlasNaturalistArt.visualScale(id))) + '</div></section>';
  }).join('');
}

function draw() {
  const sp = catalog.find(item => item.id === species.value);
  const comparingTaxa = Object.hasOwn(taxonComparisons, mode);
  const comparingVisualScale = mode === 'visual-scale';
  const comparingSets = comparingTaxa || comparingVisualScale;
  const comparingVariants = mode === 'variants';
  const comparingArt = Object.hasOwn(artReviews, mode);
  const auditingPigments = mode === 'pigment-audit';
  const comparingPigments = comparingVariants && pigmentViews.has(variantView.value);
  byId('heading').textContent = modes[mode];
  byId('mixed-control').hidden = mode !== 'mixed';

  for (const label of document.querySelectorAll('[data-catalog-filter]')) label.hidden = comparingSets || auditingPigments;
  byId('order-control').hidden = comparingSets || auditingPigments || birdOrder.options.length < 2;
  byId('frame-style-control').hidden = auditingPigments;
  byId('pigment-audit-filters').hidden = !auditingPigments;
  byId('audit-navigation').hidden = !auditingPigments;
  if (!auditingPigments) byId('audit-navigation-bottom').hidden = true;
  byId('bird-set-control').hidden = !comparingTaxa || mode === 'legendary';
  byId('comparison-size-control').hidden = !comparingSets && !comparingVariants && !comparingArt;
  byId('comparison-halo-control').hidden = (!comparingSets && !comparingVariants) || mode === 'legendary';
  byId('variant-view-control').hidden = !comparingVariants;
  byId('species-control').hidden = mode === 'gallery' || comparingSets || comparingPigments || comparingArt || auditingPigments;
  byId('context-control').hidden = mode !== 'scale';
  byId('scale-plate-control').hidden = !['scale', 'compare', 'compression', ...previews].includes(mode);
  byId('backdrop-control').hidden = !comparingSets && !comparingArt && !['compare', 'variants', 'compression', 'review', 'frames'].includes(mode);
  byId('compression-control').hidden = mode !== 'compression';
  byId('comparison-control').hidden = mode !== 'compare';
  byId('category-control').hidden = !previews.includes(mode);
  byId('export').hidden = mode !== 'review';
  byId('summary').textContent = mode === 'gallery' || comparingSets ? '' : (sp?.latin || '');
  for (const button of document.querySelectorAll('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
  if (auditingPigments) {
    auditView ??= createPigmentAudit();
    auditView.draw();
    return;
  }
  if (comparingVisualScale) {
    content.innerHTML = compareVisualScales();
    return;
  }
  if (comparingTaxa) {
    content.innerHTML = compareTaxa(taxonComparisons[mode], mode);
    return;
  }
  if (comparingPigments) {
    content.innerHTML = pigmentGallery();
    return;
  }
  if (comparingArt) {
    content.innerHTML = artComparisons(mode);
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
      const comparingSex = sp.dimorphism && variantView.value === 'sex';
      const variants = sp.records.filter(record => comparingSex
        ? ['male', 'female'].includes(record.key) : record.key !== 'legendario');
      const size = Number(comparisonSize.value);
      content.innerHTML = (variants.length === 1 ? '<p class="note">Esta especie solo tiene representación normal en el catálogo.</p>' : '') +
        '<div class="pair variants review-comparison plate-comparison' +
        (variants.length === 1 ? ' group' : '') + '" style="--comparison-size:' + size + 'px">' +
        variants.map(record => figure(illustration(sp, record, comparisonHalo.value, size, true), record.label)).join('') + '</div>';
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
  updateOrders();
  updateFamilies();
  applyFilters();
});
birdOrder.addEventListener('change', () => {
  updateFamilies();
  applyFilters();
});
family.addEventListener('change', applyFilters);
releaseScope.addEventListener('change', applyFilters);
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
birdSet.addEventListener('change', draw);
comparisonSize.addEventListener('change', draw);
comparisonHalo.addEventListener('change', draw);
variantView.addEventListener('change', draw);
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
  navigator.serviceWorker.getRegistration().then(registration =>
    registration || navigator.serviceWorker.register('../sw.js', { updateViaCache: 'none' })).catch(() => {
    byId('status').textContent = 'No se pudo preparar el acceso sin conexión.';
  });
  const button = byId('review-offline');
  const prepareOffline = byId('review-prepare-offline');
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
      function finish(success, needsOffline = false) {
        clearTimeout(timeout);
        channel.port1.close();
        button.disabled = false;
        prepareOffline.hidden = !needsOffline;
        status.textContent = success ? 'Comparaciones listas para usar sin conexión.' :
          needsOffline ? 'Prepara el juego sin conexión y vuelve al laboratorio para guardar las comparaciones.' :
            'La descarga quedó incompleta. Puedes volver a intentarlo.';
      }
      channel.port1.onmessage = ({ data }) => {
        if (data.done || data.failed || data.needsOffline) finish(Boolean(data.done), Boolean(data.needsOffline));
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
