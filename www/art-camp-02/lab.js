'use strict';
const art = globalThis.AtlasCampArt;
const roman = ['','I','II','III','IV','V'];
const get = id => document.getElementById(id);
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const composition = get('composition');
const map = get('map');
const selects = new Map();
const layers = new Map();
const guides = element('div','','fit-guides');
const backdrop = 'url("' + art.url(art.backdrop.file) + '")';
const fit = get('fit');

function stageImage(entry) {
  const img = element('img');
  img.alt = entry.name;
  img.src = art.src(entry);
  img.loading = 'lazy';
  return img;
}

function scaleSample(entry, width, title) {
  const figure = element('figure','','scale-sample');
  const area = element('div','','scale-area');
  const img = stageImage(entry);
  img.style.width = (width * 2) + '%';
  area.append(img);
  figure.append(area,element('figcaption',title + ' · ' + width.toFixed(1).replace('.',',') + ' % del ancho del plano'));
  return figure;
}

function showStage(zone, entry, title) {
  get('detail-title').textContent = zone.name + ' · ' + title;
  const detail = get('detail-image');
  if (!entry.file) {
    detail.replaceChildren(element('p',entry.status));
  } else {
    const frame = art.frame(zone,entry);
    const measure = art.layout.measures[entry.id];
    const comparison = element('div','','scale-comparison');
    comparison.append(scaleSample(entry,zone.width,'Encuadre inicial'),scaleSample(entry,frame.width,'Escala homologada'));
    detail.replaceChildren(comparison,element('p','Referencia medida · ' + measure.label));
  }
  get('detail').showModal();
}

for (const zone of art.zones) {
  const group = element('section');
  group.append(element('h2',zone.name));
  const row = element('div','','stages');
  const label = element('label',zone.name);
  const select = element('select');
  for (let level = 1; level <= 5; level++) {
    const entry = art.stage(zone.id,level);
    const title = roman[level] + ' · ' + entry.name;
    const card = element('button','','card');
    card.type = 'button';
    const picture = element('span','','thumb');
    picture.append(entry.file ? stageImage(entry) : element('span',entry.status,'state'));
    card.append(picture,element('strong',title),element('small',entry.id));
    card.addEventListener('click',() => showStage(zone,entry,title));
    row.append(card);
    select.add(new Option(title,level));
  }
  group.append(row);
  get('matrix').append(group);
  label.append(select);
  get('levels').append(label);
  selects.set(zone.id,select);
  const layer = element('div','','camp-art-layer');
  layer.style.cssText = art.placement(zone);
  layer.dataset.sector = zone.id;
  map.append(layer);
  layers.set(zone.id,layer);
  select.addEventListener('change',refresh);
}
const available = Object.values(art.entries).filter(entry => entry.file).length;
get('coverage').textContent = available + ' de 30 etapas con ilustración disponible';
map.style.backgroundImage = backdrop;
get('backdrop-status').textContent = art.backdrop.status === 'provisional' ? 'Fondo provisional de la beta' : 'Fondo del campamento';

function refresh() {
  const missing = [];
  for (const zone of art.zones) {
    const entry = art.stage(zone.id,selects.get(zone.id).value);
    const layer = layers.get(zone.id);
    if (layer.dataset.ref === entry.id) {
      if (!entry.file) missing.push(zone.name + ' ' + roman[entry.level]);
      continue;
    }
    layer.dataset.ref = entry.id;
    layer.style.cssText = art.placement(zone,entry);
    layer.replaceChildren(entry.file ? stageImage(entry) : element('span',zone.name + ' ' + roman[entry.level],'unavailable'));
    if (!entry.file) missing.push(zone.name + ' ' + roman[entry.level]);
  }
  get('missing').textContent = missing.length ? 'Sin archivo · ' + missing.join(', ') : 'Seis ilustraciones visibles';
  refreshGuides();
}

function refreshGuides() {
  if (!fit.checked) {
    if (guides.parentElement) guides.remove();
    return;
  }
  const rows = art.zones.map(zone => {
    const entry = art.stage(zone.id,selects.get(zone.id).value);
    return {zone, box: art.footprint(zone,entry)};
  });
  guides.replaceChildren(element('div','','fit-path'));
  const conflicts = [];
  for (const {zone,box} of rows) {
    const anchor = art.layout.zones[zone.id];
    const collision = rows.some(other => other.zone !== zone && box.left < other.box.right && box.right > other.box.left &&
      box.top < other.box.bottom && box.bottom > other.box.top);
    const crossing = box.left < 55 && box.right > 45;
    const mark = element('div','','fit-box' + (collision || crossing ? ' fit-conflict' : ''));
    mark.style.cssText = 'left:' + box.left + '%;top:' + box.top + '%;width:' + (box.right - box.left) + '%;height:' + (box.bottom - box.top) + '%';
    const pin = element('div','','fit-pin');
    pin.title = zone.name;
    pin.style.cssText = 'left:' + anchor.x + '%;top:' + anchor.y + '%';
    guides.append(mark,pin);
    if (collision || crossing) conflicts.push(zone.name);
  }
  map.append(guides);
  get('missing').textContent = conflicts.length ? 'Revisar el encaje de ' + conflicts.join(', ') : 'Huellas separadas · corredor libre';
}

const views = {'catalog-tab':get('catalog'),'map-tab':composition,'comparison-tab':get('comparison')};
function view(active) {
  for (const [id,panel] of Object.entries(views)) {
    panel.hidden = id !== active;
    get(id).setAttribute('aria-pressed',String(id === active));
  }
  if (active === 'map-tab') refresh();
}
for (const id of Object.keys(views)) get(id).addEventListener('click',() => view(id));
fit.addEventListener('change',refresh);

for (const level of [1,3,5]) {
  const figure = element('figure','','comparison-sheet');
  const scene = element('div','','comparison-scene');
  scene.style.backgroundImage = backdrop;
  for (const zone of art.zones) {
    const entry = art.stage(zone.id,level);
    const sprite = element('div','','camp-art-layer');
    sprite.style.cssText = art.placement(zone,entry);
    if (entry.file) sprite.append(stageImage(entry));
    scene.append(sprite);
  }
  figure.append(element('figcaption','Nivel ' + roman[level]),scene);
  get('comparative-scenes').append(figure);
}
get('reset').addEventListener('click',() => {
  for (const select of selects.values()) select.value = '1';
  refresh();
});
get('viewport').addEventListener('change',event => map.dataset.viewport = event.target.value);
get('scale').addEventListener('input',event => {
  const value = Number(event.target.value);
  get('scale-value').value = value + ' %';
  map.style.setProperty('--zoom',value / 100);
});
