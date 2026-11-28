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

function stageImage(entry) {
  const img = element('img');
  img.alt = entry.name;
  img.src = art.src(entry);
  img.loading = 'lazy';
  return img;
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
    card.addEventListener('click',() => {
      get('detail-title').textContent = zone.name + ' · ' + title;
      get('detail-image').replaceChildren(entry.file ? stageImage(entry) : element('p',entry.status));
      get('detail').showModal();
    });
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
map.style.backgroundImage = 'url("' + art.url(art.backdrop.file) + '")';
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
}

function view(isMap) {
  get('catalog').hidden = isMap;
  composition.hidden = !isMap;
  get('catalog-tab').setAttribute('aria-pressed',String(!isMap));
  get('map-tab').setAttribute('aria-pressed',String(isMap));
  if (isMap) refresh();
}

get('catalog-tab').addEventListener('click',() => view(false));
get('map-tab').addEventListener('click',() => view(true));
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
