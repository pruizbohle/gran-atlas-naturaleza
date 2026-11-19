(() => {
  'use strict';

  const {rows, groups, materialIds, recipeExamples, archive, cartography} = AtlasObjetosCientificos;
  const byId = new Map(rows.map(row => [row.id, row]));
  const get = id => document.getElementById(id);
  const gallery = get('gallery');
  const storageKey = 'atlas-laboratorio-objetos-cientificos:v1';
  const approvals = ['Pendiente', 'Aprobado', 'Prefiero el original', 'Requiere corrección menor', 'Requiere rediseño'];
  const rarities = ['Común', 'Poco común', 'Raro', 'Muy raro'];
  const colors = ['#888d7d', '#4f8468', '#507bb0', '#8d5f9e'];
  const criteria = ['Reconocimiento inmediato', 'Fidelidad al material', 'Precisión histórica',
    'Belleza visual', 'Coherencia con El Gran Atlas', 'Diferenciación', 'Legibilidad a 32 px', 'Legibilidad a 64 px'];
  const headings = [['original','Sprite original'], ['clasica','Ilustración clásica'], ['inventario','Optimizada para inventario']];
  const filters = ['family', 'cabinet', 'collection', 'rarity', 'tier', 'stage', 'approval'];
  const collator = new Intl.Collator('es');
  const pageSize = 12;
  const stockAmounts = [1, 5, 25, 100, 500, 1000];
  const integer = new Intl.NumberFormat('es-CL');
  let page = 0;
  let focusId = null;
  let reviews = {};
  try {
    reviews = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    // La evaluación permanece en memoria cuando el almacenamiento está deshabilitado.
  }

  function node(tag, value, className) {
    const element = document.createElement(tag);
    if (value) element.textContent = value;
    if (className) element.className = className;
    return element;
  }

  function options(select, values, placeholder) {
    if (placeholder) select.add(new Option(placeholder, ''));
    for (const value of values) select.add(new Option(value, value));
  }

  for (const key of filters) {
    const values = key === 'approval' ? approvals : [...new Set(rows.map(row => row[key]).filter(Boolean))].sort(collator.compare);
    options(get(key), values, 'Todas las opciones');
  }

  options(get('group'), groups.map(group => group.name));
  const archiveSelect = get('archive-section');
  archiveSelect.add(new Option('Ensamblaje cartográfico', 'assembly'));
  options(archiveSelect, archive.map(group => group.name));
  options(get('stock'), stockAmounts.map(quantity => integer.format(quantity)), 'Cantidades variadas');
  const recipeSelect = get('recipe-example');
  recipeSelect.add(new Option('Todas las recetas', ''));
  for (const id of recipeExamples) recipeSelect.add(new Option(byId.get(id).name, id));

  function approval(row) {
    return reviews[row.id]?.approval || row.approval;
  }

  function size() {
    return Number(get('scale').value);
  }

  function asset(row, key) {
    if (key === 'original') return row.original;
    return row.sprites[key]?.[Math.max(64, size())];
  }

  function figure(row, key, caption, hidden = false) {
    const target = node('figure');
    const stage = node('div', '', 'stage ' + get('ground').value);
    const source = asset(row, key);
    const rarity = rarities.indexOf(row.rarity);
    if (rarity >= 0 && get('halo').checked) {
      stage.classList.add('halo');
      stage.style.setProperty('--rarity-color', colors[rarity]);
    }
    if (hidden) {
      stage.textContent = 'Pendiente de descubrir';
    } else if (source?.src) {
      const img = node('img');
      img.src = source.src;
      img.alt = row.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      stage.append(img);
    } else if (source?.renderer) {
      // El SVG proviene del renderizador del juego o de su instantánea museística.
      stage.innerHTML = source.svg || AtlasItemArt.renderItemArt(row.id);
    } else {
      stage.textContent = key === 'original' ? 'Sin sprite original' : 'Ilustración pendiente';
    }
    target.append(stage);
    if (caption) {
      const weight = source ? ' · ' + (source.bytes/1024).toFixed(1) + ' KiB' + (source.renderer ? ' SVG' : ' WebP') : '';
      target.append(node('figcaption', caption + weight));
    }
    return target;
  }

  function review(row) {
    const details = node('details');
    details.append(node('summary', 'Evaluar y anotar'));
    const form = get('review').content.firstElementChild.cloneNode(true);
    const fields = form.elements;
    const existing = reviews[row.id];
    options(fields.approval, approvals);
    fields.approval.value = approval(row);
    fields.preference.value = existing?.preference || '';
    fields.preference.options[1].disabled = !row.original;
    fields.preference.options[2].disabled = !row.sprites.clasica;
    fields.preference.options[3].disabled = !row.sprites.inventario;
    fields.notes.value = existing?.notes || '';
    criteria.forEach((criterion, index) => {
      const label = node('label', criterion);
      const select = node('select');
      select.name = 'score' + index;
      options(select, ['1','2','3','4','5'], 'Sin evaluar');
      select.value = existing?.scores[criterion] || '';
      label.append(select);
      form.querySelector('.scores').append(label);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      reviews[row.id] = {
        approval: fields.approval.value,
        preference: fields.preference.value,
        notes: fields.notes.value.trim(),
        scores: Object.fromEntries(criteria.map((criterion, index) => [
          criterion, Number(fields['score' + index].value) || null
        ]))
      };
      let saved = true;
      try {
        localStorage.setItem(storageKey, JSON.stringify(reviews));
      } catch {
        saved = false;
      }
      if (get('approval').value) render();
      else details.closest('article').querySelector('.metadata').textContent = metadata(row);
      get('status').textContent = saved ? 'Evaluación guardada · ' + row.name : 'Evaluación en memoria · puedes exportarla a JSON';
    });
    details.append(form);
    return details;
  }

  function metadata(row) {
    return [row.id, row.type, row.family, row.cabinet, row.collection, row.rarity, row.stage, row.tier && 'Tier ' + row.tier, approval(row)].filter(Boolean).join(' · ');
  }

  function comparison(row) {
    const card = node('article');
    card.append(node('h2', row.name), node('small', metadata(row), 'metadata'));
    const columns = node('div', '', 'columns actual');
    for (const [key, title] of headings) columns.append(figure(row, key, title));
    card.append(columns, node('p', [row.description, row.provenance, row.context, row.observations].filter(Boolean).join(' · ')));
    if (row.species) {
      const facts = node('dl', '', 'material-facts');
      for (const [label, value] of [['Especies potenciales', row.species.join(', ')], ['Continentes', row.continent],
        ['Material predominante', row.material], ['Obtención sugerida', row.acquisition], ['Posibles usos', row.uses]]) {
        facts.append(node('dt', label), node('dd', value));
      }
      card.append(facts);
    }
    card.append(review(row));
    return card;
  }

  function inspect(row) {
    get('view').value = 'compare';
    get('layout').value = 'single';
    get('scope').value = 'all';
    for (const filter of ['search', ...filters]) get(filter).value = '';
    focusId = row.id;
    render();
    window.scrollTo(0,0);
  }

  function quantity(row) {
    return (rows.indexOf(row) * 7 + 3) % 11;
  }

  function simulationCard(row, view, index) {
    const card = node('article');
    const discovered = view !== 'album' || index % 3 !== 1;
    card.append(figure(row, row.sprites.inventario ? 'inventario' : 'original', '', !discovered));
    card.append(node('h3', row.name));
    const text = view === 'inventory' ? 'Cantidad de prueba ×' + quantity(row) :
      view === 'equipment' ? ({instrument:'Instrumento',hat:'Sombrero',necklace:'Colgante'}[row.slot] || row.family) :
      view === 'album' ? [row.rarity, discovered ? 'Descubierta' : 'Pendiente'].join(' · ') : row.collection || row.family;
    card.append(node('small', text));
    const link = node('button', 'Comparar');
    link.addEventListener('click', () => inspect(row));
    card.append(link);
    return card;
  }

  function materialCard(row) {
    const card = node('article', '', 'stock-card');
    const label = get('stock').value || integer.format(stockAmounts[materialIds.indexOf(row.id) % stockAmounts.length]);
    const count = node('span', '×' + label, 'stock-count');
    count.setAttribute('aria-label', label + ' unidades disponibles');
    card.append(count, figure(row, 'inventario'), node('h3', row.name));
    const compare = node('button', 'Comparar');
    compare.addEventListener('click', () => inspect(row));
    card.append(compare);
    return card;
  }

  function recipeCard(row) {
    const article = node('article', '', 'recipe-card');
    article.append(node('h2', row.name));
    const flow = node('div', '', 'recipe-flow');
    const components = node('section');
    const list = node('ul', '', 'recipe-materials');
    let shortages = 0;
    for (const [id, required] of Object.entries(row.recipe)) {
      const material = byId.get(id);
      const owned = material ? quantity(material) : 0;
      const missing = Math.max(0, required - owned);
      shortages += missing;
      const item = node('li', '', 'recipe-piece');
      if (material) item.append(figure(material, material.sprites.inventario ? 'inventario' : 'original'));
      item.append(node('strong', material?.name || id),
        node('small', required + ' requeridas · ' + owned + ' disponibles'),
        node('small', 'Faltan ' + missing, missing ? 'recipe-missing' : ''));
      list.append(item);
    }
    components.append(node('h3', 'Materiales requeridos'), list);

    const operation = node('div', '', 'recipe-operation');
    const arrow = node('span', '→', 'recipe-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    operation.append(arrow, node('strong', 'Fabricación simulada'),
      node('small', shortages ? 'Faltan ' + shortages + ' unidades en total' : 'Materiales suficientes'), arrow.cloneNode(true));

    const result = node('section', '', 'recipe-result');
    result.append(node('h3', 'Objeto resultante'), figure(row, row.sprites.inventario ? 'inventario' : 'original'),
      node('strong', row.name));
    const compare = node('button', 'Comparar');
    compare.addEventListener('click', () => inspect(row));
    result.append(compare);
    flow.append(components, operation, result);
    article.append(flow);
    return article;
  }

  function renderAssembly() {
    const percent = Number(get('assembly').value);
    const complete = percent === 100;
    const grid = node('div', '', 'assembly-grid');
    for (const map of cartography) {
      const card = node('article', '', 'assembly-card');
      const fragment = figure(byId.get(map.piece), 'inventario', 'Fragmento');
      const chart = figure(byId.get(map.id), 'inventario', complete ? 'Mapa completo' : 'Mapa en ensamblaje');
      chart.querySelector('img').style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';
      const pair = node('div', '', 'assembly-pair');
      pair.append(fragment, chart);
      const count = Math.floor(map.parts * percent / 100);
      const progress = node('progress');
      progress.max = 100;
      progress.value = percent;
      progress.setAttribute('aria-label', 'Ensamblaje visual de ' + map.name);
      card.append(node('h3', map.name), pair, progress, node('small', count + ' de ' + map.parts + ' partes completas'));
      grid.append(card);
    }
    const world = node('section', '', 'assembly-world');
    world.append(node('h2', 'Mapamundi'),
      node('p', complete ? 'Los seis mapas se conservan al ensamblar el Mapamundi.' :
        'El Mapamundi se ensambla al reunir los seis mapas completos; estos se conservan.'),
      complete ? figure(byId.get('world_map'), 'inventario') : node('p', '0 de 6 mapas completos'));
    gallery.append(node('p', 'El porcentaje muestra el avance visual. El contador indica partes enteras.'), grid, world);
  }

  function matchesView(row, view) {
    switch (view) {
      case 'inventory': return row.type === 'Objeto productivo';
      case 'materials': return materialIds.includes(row.id);
      case 'equipment': return row.type === 'Objeto productivo' && row.slot;
      case 'workshop': return row.type === 'Objeto productivo' && row.recipe && (!get('recipe-example').value || get('recipe-example').value === row.id);
      case 'album': return row.type === 'Coleccionable propuesto';
      case 'museum': return row.type === 'Pieza del Museo';
      case 'groups': return groups.find(group => group.name === get('group').value).ids.includes(row.id);
      case 'archive': return archive.find(group => group.name === archiveSelect.value)?.ids.includes(row.id);
      default: return get('stage').value || get('scope').value !== 'pilot' || row.pilot;
    }
  }

  function sortRows(selected) {
    const sort = get('sort').value;
    const weight = row => asset(row, 'inventario')?.bytes ?? Infinity;
    return selected.sort((a,b) => {
      if (sort === 'bytes' && weight(a) !== weight(b)) return weight(a) - weight(b);
      if (sort === 'rarity' && a.rarity !== b.rarity) return rarities.indexOf(b.rarity) - rarities.indexOf(a.rarity);
      return collator.compare(a.name, b.name);
    });
  }

  function normalize(value) {
    return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  }

  function navigation(current, count) {
    const nav = get('navigation');
    nav.replaceChildren();
    if (count <= 1) return;
    const previous = node('button', 'Anterior');
    const next = node('button', 'Siguiente');
    previous.disabled = current <= 0;
    next.disabled = current >= count - 1;
    for (const [button, offset] of [[previous, -1], [next, 1]]) button.addEventListener('click', () => {
      focusId = null;
      page = current + offset;
      render();
    });
    nav.append(previous, node('span', (current + 1) + ' de ' + count), next);
  }

  function renderAlbum(selected) {
    const collectionNames = [...new Set(selected.map(row => row.collection))].sort(collator.compare);
    page = Math.min(page, Math.max(0, collectionNames.length - 1));
    navigation(page, collectionNames.length);
    const collection = collectionNames[page];
    if (!collection) return;
    const all = rows.filter(row => row.collection === collection && row.type === 'Coleccionable propuesto');
    const found = all.filter((row, index) => index % 3 !== 1).length;
    const section = node('section', '', 'collection');
    const progress = node('progress');
    progress.value = found;
    progress.max = all.length;
    progress.setAttribute('aria-label', 'Progreso de prueba');
    section.append(node('h2', collection), node('div', found + '/' + all.length + ' descubiertas'), progress);
    const grid = node('div', '', 'display-grid');
    for (const row of selected.filter(row => row.collection === collection)) grid.append(simulationCard(row, 'album', all.indexOf(row)));
    section.append(grid);
    gallery.append(section);
  }

  function renderGroup(selected, group) {
    const visible = new Map(selected.map(row => [row.id, row]));
    const ordered = group.evolution ? group.ids.map(id => visible.get(id)).filter(Boolean) : selected;
    const section = node('section');
    const title = node('h2', group.name);
    title.id = 'group-title';
    section.append(title);
    const strip = node('div', '', 'family-strip');
    strip.tabIndex = 0;
    strip.setAttribute('role', 'region');
    strip.setAttribute('aria-labelledby', title.id);
    for (const row of ordered) {
      const card = node('article', '', 'family-card');
      card.append(node('h3', row.name), node('small', [row.type, row.tier && 'Tier ' + row.tier, row.stage].filter(Boolean).join(' · ')));
      for (const [key, caption] of headings) card.append(figure(row, key, caption));
      const link = node('button', 'Consultar y evaluar');
      link.addEventListener('click', () => inspect(row));
      card.append(link);
      strip.append(card);
    }
    if (ordered.length) section.append(strip);
    gallery.append(section);
  }

  function render() {
    const view = get('view').value;
    const inArchive = view === 'archive';
    const inAssembly = inArchive && archiveSelect.value === 'assembly';
    get('archive-control').hidden = !inArchive;
    get('assembly-control').hidden = !inAssembly;
    for (const key of ['search','sort',...filters]) get(key).disabled = inAssembly;
    const single = view === 'compare' && get('layout').value === 'single';
    get('scope').disabled = view !== 'compare' || Boolean(get('stage').value);
    get('group-control').hidden = view !== 'groups';
    get('stock-control').hidden = view !== 'materials';
    get('recipe-control').hidden = view !== 'workshop';
    get('layout').disabled = view !== 'compare';
    const query = normalize(get('search').value.trim());
    const selected = sortRows(rows.filter(row => matchesView(row, view) &&
      normalize([row.name,row.id,row.provenance,...(row.species || [])].join(' ')).includes(query) &&
      filters.every(key => !get(key).value || get(key).value === (key === 'approval' ? approval(row) : row[key]))));
    gallery.replaceChildren();
    gallery.style.setProperty('--size', size() + 'px');
    if (inAssembly) {
      navigation(0, 0);
      get('status').textContent = 'Seis mapas · 10 partes por mapa · simulación visual';
      renderAssembly();
      return;
    }
    get('status').textContent = selected.length + ' resultados' + (['compare','groups','archive'].includes(view) ? '' : ' · Simulación con datos de prueba');
    if (view === 'groups' || inArchive) {
      navigation(0, 0);
      const name = inArchive ? archiveSelect.value : get('group').value;
      renderGroup(selected, (inArchive ? archive : groups).find(entry => entry.name === name));
      return;
    }
    if (view === 'album') {
      renderAlbum(selected);
      return;
    }
    const step = single ? 1 : pageSize;
    const count = Math.ceil(selected.length / step);
    if (single && focusId) {
      const index = selected.findIndex(row => row.id === focusId);
      if (index >= 0) page = index;
    }
    page = Math.min(page, Math.max(0, count - 1));
    navigation(page, count);
    const grid = node('div', '', view === 'compare' ? 'cards' : view === 'workshop' ? 'recipe-cards' : 'display-grid');
    for (const row of selected.slice(page * step, (page + 1) * step)) {
      if (view === 'compare') grid.append(comparison(row));
      else if (view === 'materials') grid.append(materialCard(row));
      else if (view === 'workshop') grid.append(recipeCard(row));
      else grid.append(simulationCard(row, view));
    }
    gallery.append(grid);
  }

  get('search').addEventListener('input', resetPage);
  for (const key of ['view','group','archive-section','recipe-example','scope','layout','sort',...filters]) get(key).addEventListener('change', resetPage);
  for (const key of ['scale','ground','halo','stock','assembly']) get(key).addEventListener('change', render);
  function resetPage() {
    page = 0;
    focusId = null;
    render();
  }

  get('export').addEventListener('click', () => {
    const payload = {schema:1, year:1842, exportedAt:new Date().toISOString(), reviews};
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)], {type:'application/json'}));
    const link = node('a');
    link.href = url;
    link.download = 'evaluaciones-objetos-cientificos.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  render();
})();
