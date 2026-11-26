'use strict';
const rows = globalThis.AtlasObjectArtReview;
const art = globalThis.AtlasObjectArt;
const byId = new Map(rows.map(row => [row.id, row]));
const lots = {
  A:'Materiales animales', B:'Artefactos científicos', C:'Componentes',
  D:'Estudios y demostraciones', coleccionables:'Coleccionables'
};
const get = id => document.getElementById(id);
const grid = get('grid');
const viewer = get('viewer');
const params = new URLSearchParams(location.search);
const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const ui = {lot:Object.hasOwn(lots, params.get('lote')) ? params.get('lote') : 'A', dark:false};
const marker = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="14" y="10" width="72" height="80" rx="6" fill="#a9855a" stroke="#604a35" stroke-width="2.5"/><rect x="21" y="17" width="58" height="66" rx="3" fill="none" stroke="#604a35" stroke-dasharray="3 3"/><text x="50" y="65" text-anchor="middle" fill="#604a35" font-family="Georgia" font-size="48" font-weight="bold">?</text></svg>';

function node(tag, text, className) {
  const result = document.createElement(tag);
  if (text) result.textContent = text;
  if (className) result.className = className;
  return result;
}

function stage(url, pixels, label, previousMarker = false) {
  const holder = node('span', '', 'stage');
  holder.style.setProperty('--size', pixels + 'px');
  if (url) {
    const img = node('img');
    img.width = img.height = pixels;
    img.src = url;
    img.alt = label;
    img.loading = 'lazy';
    img.decoding = 'async';
    holder.append(img);
  } else if (previousMarker) {
    holder.innerHTML = marker;
    holder.setAttribute('aria-label',label);
  } else {
    holder.textContent = label;
  }
  return holder;
}

function thumbnail(row, size) {
  const button = node('button', '', 'card');
  button.type = 'button';
  button.dataset.id = row.id;
  const meta = node('span', '', 'card-meta');
  meta.append(node('strong',row.name), node('span',row.id + ' · ' + row.category,'meta'),
    node('span',row.state,'state' + (row.paths ? ' integrated' : '')));
  button.append(stage(art.src(row.id,size), size, row.paths ? row.name : 'Sin imagen integrada'), meta);
  return button;
}

function render() {
  const size = Number(get('size').value);
  const text = normalize(get('query').value.trim());
  const status = get('status').value;
  const lot = rows.filter(row => row.lot === ui.lot);
  const filtered = lot.filter(row => (status === 'all' || (status === 'integrated') === Boolean(row.paths)) &&
    normalize([row.id,row.name,row.category].join(' ')).includes(text));
  get('title').textContent = lots[ui.lot];
  get('result').textContent = filtered.length + ' de ' + lot.length + ' fichas · ' + lot.filter(row => row.paths).length + ' integradas';
  grid.style.setProperty('--column', Math.max(165,size + 14) + 'px');
  grid.replaceChildren(...filtered.map(row => thumbnail(row,size)));
  if (!filtered.length) grid.append(node('p','Sin resultados.'));
}

function figure(label, url, resolution, size, isMarker = false) {
  const fig = node('figure');
  const caption = node('figcaption', label);
  if (url) {
    const link = node('a','Abrir archivo de ' + resolution + ' px');
    link.href = url;
    caption.append(node('br'),link);
  }
  fig.append(stage(url, size, url ? label : isMarker ? label : 'Sin imagen integrada',isMarker),caption);
  return fig;
}

function show(row) {
  const size = Number(get('size').value);
  const title = node('h2',row.name);
  title.id = 'viewer-title';
  const details = node('div', '', 'views');
  for (const pixels of [64,128,256,512]) {
    if (!row.paths && pixels !== size) continue;
    details.append(figure('Ilustración · ' + pixels + ' px', art.src(row.id,pixels), pixels, pixels));
  }
  if (row.previous) {
    const {kind,label,paths,external} = row.previous;
    const resolution = paths?.[size] ? size : Number(Object.keys(paths || {})[0]);
    const url = !external && paths?.[resolution] ? '../' + paths[resolution] : '';
    if (url || kind === 'marcador') details.append(figure(label,url,resolution,size,kind === 'marcador'));
  }
  const info = node('p',[row.id,row.category,row.state,row.origin,row.reference].filter(Boolean).join(' · '),'meta');
  const section = get('viewer-content');
  section.replaceChildren(title,info);
  if (row.note) section.append(node('p',row.note));
  section.append(details);
  if (!viewer.open) viewer.showModal();
}

for (const [id,label] of Object.entries(lots)) {
  const button = node('button',(id === 'coleccionables' ? '' : id + ' · ') + label);
  button.type = 'button';
  button.setAttribute('aria-pressed',String(ui.lot === id));
  button.addEventListener('click', () => {
    ui.lot = id;
    params.set('lote',id);
    history.replaceState(null,'','?' + params);
    for (const other of get('lots').children) other.setAttribute('aria-pressed',String(other === button));
    render();
  });
  get('lots').append(button);
}
function background(dark) {
  ui.dark = dark;
  document.body.dataset.background = dark ? 'dark' : 'light';
  get('light').setAttribute('aria-pressed',String(!dark));
  get('dark').setAttribute('aria-pressed',String(dark));
}
get('light').addEventListener('click',() => background(false));
get('dark').addEventListener('click',() => background(true));
get('query').addEventListener('input',render);
get('status').addEventListener('change',render);
get('size').addEventListener('change',render);
grid.addEventListener('click',event => {
  const card = event.target.closest('[data-id]');
  if (card) show(byId.get(card.dataset.id));
});
render();
