'use strict';

const relicControls = ['relict-query', 'relict-size', 'relict-background', 'relict-before'].map(id => document.getElementById(id));
const [relictQuery, relictSize, relictBackground, relictBefore] = relicControls;
const relictGallery = document.getElementById('relict-preview');
const relictCount = document.getElementById('relict-count');
const normalizeRelictName = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

function renderRelictGallery() {
  const query = normalizeRelictName(relictQuery.value.trim());
  const records = AtlasRelictReview.filter(row => normalizeRelictName(row.name + ' ' + row.latin).includes(query));
  const size = Number(relictSize.value);
  relictGallery.style.setProperty('--relict-size', size + 'px');
  relictGallery.dataset.dark = String(relictBackground.value === 'dark');
  relictCount.textContent = records.length + ' de ' + AtlasRelictReview.length + ' relictos';
  relictGallery.replaceChildren(...records.map(row => {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    const title = document.createElement('h2');
    title.textContent = row.name;
    const latin = document.createElement('p');
    latin.className = 'latin';
    latin.textContent = row.latin;
    const art = document.createElement('div');
    art.className = 'relict-pair';
    const figure = (drawing, caption) => {
      const frame = document.createElement('figure');
      const background = document.createElement('div');
      background.className = 'relict-preview-drawing';
      background.append(drawing);
      const label = document.createElement('figcaption');
      label.textContent = caption;
      frame.append(background, label);
      return frame;
    };
    if (relictBefore.checked && row.beforeSvg) {
      const svg = document.createElement('template');
      svg.innerHTML = ATLAS_RELICT_ART.render(row.id);
      art.append(figure(svg.content, 'Antes · SVG'));
    }
    const image = document.createElement('img');
    image.src = 'naturalist-art/relicts/' + (size === 512 ? '' : size + '/') + row.id + '.webp';
    image.alt = row.name;
    image.width = size;
    image.height = size;
    image.loading = 'lazy';
    art.append(figure(image, 'Lámina vigente · WebP'));
    const location = document.createElement('p');
    location.textContent = row.hex + ' · ' + row.locality;
    const notes = document.createElement('p');
    notes.textContent = row.desc;
    card.append(title, latin, art, location, notes);
    return card;
  }));
}

relictQuery.addEventListener('input', renderRelictGallery);
relictSize.addEventListener('change', renderRelictGallery);
relictBefore.addEventListener('change', renderRelictGallery);
relictBackground.addEventListener('change', renderRelictGallery);
renderRelictGallery();
