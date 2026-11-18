'use strict';

const byId = id => document.getElementById(id);
const content = byId('content');
const search = byId('search');
const species = byId('species');
const context = byId('context');
const scalePlate = byId('scale-plate');
const storageKey = 'gran-atlas-naturalist-art-review-v1';
const modes = {
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
let mode = 'gallery';
let reviewKey = 'normal';
let review = {};
try {
  review = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {
  byId('status').textContent = 'No se pudo recuperar la revisión local.';
}
for (const sp of catalog) species.add(new Option(sp.name, sp.id));

function illustration(sp, record, frame = 'Normal') {
  const label = text(sp.name + ' · ' + record.label);
  return '<div class="plate ' + frames[frame] + '">' +
    (record.src
      ? '<img src="' + text(record.src) + '" width="512" height="512" loading="lazy" decoding="async" alt="' + label + '">'
      : '<span>Lámina pendiente</span>') + '</div>';
}

function figure(markup, caption) {
  return '<figure>' + markup + '<figcaption>' + text(caption) + '</figcaption></figure>';
}

function gallery() {
  const query = normalize(search.value.trim());
  const shown = catalog.filter(sp => normalize(sp.name + ' ' + sp.latin).includes(query));
  byId('summary').textContent = shown.length + ' de ' + catalog.length + ' especies';
  return shown.length ? '<div class="grid gallery">' + shown.map(sp =>
    '<button type="button" class="gallery-card" data-species="' + text(sp.id) + '">' +
    illustration(sp, sp.records[0]) + '<span class="card-title">' + text(sp.name) + '</span><span class="latin">' +
    text(sp.latin) + '</span></button>').join('') + '</div>' : '<p>No se encontraron especies.</p>';
}

function specialFrames(sp) {
  const legendary = sp.records.find(record => record.key === 'legendario');
  const samples = Object.keys(frames).map(category => {
    const record = category === 'Legendario' && legendary ? legendary : sp.records[0];
    const label = category + (sp.categories.includes(category) ? '' : ' · muestra de marco');
    return figure(illustration(sp, record, category), label);
  });
  return '<div class="grid">' + samples.join('') + '</div>';
}

function scale(sp) {
  const selected = scalePlate.value;
  scalePlate.replaceChildren(...sp.records.map(record => new Option(record.label, record.key)));
  const record = sp.records.find(item => item.key === selected) || sp.records[0];
  scalePlate.value = record.key;
  return '<div class="scale-list">' + [32, 48, 64, 96, 128, 512].map(size =>
    '<figure class="sample ' + (size === 512 ? 'full' : '') + '" style="--size:' + size + 'px" data-context="' +
    text(context.value) + '">' + illustration(sp, record) + '<h3>' + text(sp.name) +
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
  byId('search-control').hidden = mode !== 'gallery';
  byId('species-control').hidden = mode === 'gallery';
  byId('context-control').hidden = mode !== 'scale';
  byId('scale-plate-control').hidden = mode !== 'scale';
  byId('export').hidden = mode !== 'review';
  byId('summary').textContent = mode === 'gallery' ? '' : sp.latin;
  for (const button of document.querySelectorAll('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
  switch (mode) {
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
        figure('<div class="plate sprite" role="img" aria-label="Sprite de ' + text(sp.name) + '">' + sp.sprite + '</div>', 'Sprite actual') +
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
search.addEventListener('input', draw);
species.addEventListener('change', () => {
  reviewKey = 'normal';
  scalePlate.value = 'normal';
  draw();
});
context.addEventListener('change', draw);
scalePlate.addEventListener('change', draw);
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
  navigator.serviceWorker.register('./sw.js').catch(() => {
    byId('status').textContent = 'No se pudo preparar el acceso sin conexión.';
  });
}
draw();
