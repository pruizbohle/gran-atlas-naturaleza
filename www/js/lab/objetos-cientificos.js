(() => {
  'use strict';

  const {rows, groups, materialIds, recipeExamples, archive, cartography, paleontology, botany, geology, geologyComparisons, oceanography, oceanographyComparisons, history, historyComparisons, natural, archivedRows, substitutions} = AtlasObjetosCientificos;
  const {phases, reconstruction} = AtlasReconstruccionObjetos;
  const fossilGroups = {
    materials: {name:'Materiales y fósiles menores', ids:[...paleontology.materials,...paleontology.minors]},
    archive: {name:'Archivo paleontológico', ids:paleontology.archive},
    future: {name:'Montajes futuros', ids:paleontology.future}
  };
  const {entries:audits, similarities, profiles} = AtlasAuditoriaObjetos;
  const byId = new Map([...rows,...archivedRows].map(row => [row.id, row]));
  const bySubstitution = new Map(substitutions.flatMap(entry => [[entry.old,entry],[entry.id,entry]]));
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

  options(get('audit-status'),[...new Set(Object.values(audits).map(entry => entry.status))].sort(collator.compare),'Todos los resultados');
  options(get('audit-similar'),similarities.map(group => group.name),'Todas las familias');
  options(get('group'), groups.map(group => group.name));
  options(get('botany-group'), botany.map(group => group.name), 'Plancha general · 48 piezas');
  options(get('geology-group'), [...geology,...geologyComparisons].map(group => group.name), 'Plancha general · 60 piezas');
  options(get('oceanography-group'), [...oceanography,...oceanographyComparisons].map(group => group.name), 'Plancha general · 60 piezas');
  options(get('history-group'), [...history,...historyComparisons].map(group => group.name), 'Plancha general · 72 piezas');
  options(get('natural-group'), natural.map(group => group.name), 'Plancha general · 60 piezas');
  options(get('history-period'), [...new Set(rows.filter(row => row.history).map(row => row.history.period))], 'Todos los periodos');
  options(get('history-date'), [...new Set(rows.map(row => row.chronology.status))].sort(collator.compare), 'Todas las fechas');
  for (const mount of paleontology.mounts) get('mount').add(new Option(mount.name, mount.id));
  phases.forEach((phase, index) => get('phase').add(new Option(phase.name, String(index))));
  get('phase').value = '3';
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

  function figure(row, key, caption, hidden = false, resolution) {
    const target = node('figure');
    const stage = node('div', '', 'stage ' + get('ground').value);
    const source = resolution ? row.sprites[key]?.[resolution] : asset(row,key);
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
    if (row.botany) {
      const facts = node('dl', '', 'material-facts');
      for (const [label,value] of [['Identificación u origen',row.botany.identity],
        ['Caracteres diagnósticos',row.botany.characteristics],['Escala real',row.botany.scale]]) {
        facts.append(node('dt',label),node('dd',value));
      }
      card.append(facts);
    }
    if (row.geology) {
      const facts = node('dl', '', 'material-facts');
      for (const [label,value] of [['Clasificación',row.geology.classification],['Composición',row.geology.composition],
        ['Hábito o estructura',row.geology.structure],['Rasgo documentado',row.geology.diagnostic],
        ['Contexto histórico',row.geology.history],['Observación de la lámina',row.geology.plate]]) {
        facts.append(node('dt',label),node('dd',value));
      }
      const source = node('a','Ficha de referencia');
      source.href = row.geology.source;
      const cell = node('dd');
      cell.append(source);
      facts.append(node('dt','Fuente'),cell);
      card.append(facts);
    }
    if (row.oceanography) {
      const sample = row.oceanography;
      const facts = node('dl', '', 'material-facts');
      for (const [label,value] of [['Naturaleza',sample.nature],['Identificación',sample.identity],
        ['Clasificación',sample.classification],['Procedencia',row.provenance],['Material',sample.material],
        [sample.nature === 'Ficción explícita' ? 'Rasgo de diseño' : 'Rasgo documentado',sample.diagnostic],['Hábitat',sample.habitat],['Contexto histórico',sample.history],
        ['Observación de la lámina',sample.plate]]) {
        if (value) facts.append(node('dt',label),node('dd',value));
      }
      const source = node('dd');
      if (sample.source.startsWith('https://')) {
        const link = node('a','Ficha de referencia');
        link.href = sample.source;
        source.append(link);
      } else source.textContent = sample.source;
      facts.append(node('dt','Fuente documental'),source);
      card.append(facts);
    }
    if (row.history) {
      const record = row.history;
      const facts = node('dl', '', 'material-facts');
      for (const [label,value] of [['Identificación histórica',record.identity],['Cultura',record.culture],['Procedencia',row.provenance],
        ['Material',record.material],['Periodo',record.period],['Fecha de referencia',record.date],['Rasgos',record.diagnostic],
        ['Contexto cultural',record.culturalContext],['Compatibilidad con 1842',record.compatibility],
        ['Tratamiento',record.treatment],['Observaciones documentales',record.note]]) {
        facts.append(node('dt',label),node('dd',value));
      }
      const source = node('a','Referencia de colección');
      source.href = record.source;
      const cell = node('dd');
      cell.append(source);
      facts.append(node('dt','Fuente documental'),cell);
      card.append(facts);
    }
    if (row.natural) {
      const record = row.natural;
      const facts = node('dl', '', 'material-facts');
      for (const [label,value] of [['Identificación científica',record.identity],['Clasificación',record.classification],
        ['Procedencia',row.provenance],['Material',record.material],['Dimensiones aproximadas',record.dimensions],
        ['Asociación con fauna',record.species?.name || record.association],['Rasgo diagnóstico',record.diagnostic],
        ['Contexto científico',record.science],['Contexto histórico',record.history],
        ['Compatibilidad con 1842',row.chronology.status],['Obtención sugerida',record.acquisition],['Observaciones',record.note]]) {
        facts.append(node('dt',label),node('dd',value));
      }
      const source = node('a','Referencia científica');
      source.href = record.source;
      const cell = node('dd');
      cell.append(source);
      facts.append(node('dt','Fuente documental'),cell);
      card.append(facts);
    }
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

  function inspect(row, pixels) {
    if (pixels) get('scale').value = String(pixels);
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
      case 'botany': return row.botany && (!get('botany-group').value || row.collection === get('botany-group').value);
      case 'geology': {
        const selection = get('geology-group').value;
        return selection ? [...geology,...geologyComparisons].find(group => group.name === selection)?.ids.includes(row.id) : row.geology;
      }
      case 'oceanography': {
        const selection = get('oceanography-group').value;
        return selection ? [...oceanography,...oceanographyComparisons].find(group => group.name === selection)?.ids.includes(row.id) : row.oceanography;
      }
      case 'audit': {
        const entry = audits[row.id];
        const family = similarities.find(group => group.name === get('audit-similar').value);
        return entry && (!get('audit-status').value || entry.status === get('audit-status').value) &&
          (!family || family.ids.includes(row.id));
      }
      case 'retired': return get('retired-mode').value === 'all' ||
        row.id.startsWith('FIL-') === (get('retired-mode').value === 'philately');
      case 'natural': return row.natural && (!get('natural-group').value || row.collection === get('natural-group').value);
      case 'eggs': return row.id.startsWith('HUE-');
      case 'history': {
        const selection = get('history-group').value;
        if (get('history-period').value && row.history?.period !== get('history-period').value) return false;
        if (get('history-date').value && row.chronology.status !== get('history-date').value) return false;
        return selection ? [...history,...historyComparisons].find(group => group.name === selection)?.ids.includes(row.id) : row.history;
      }
      case 'groups': return groups.find(group => group.name === get('group').value).ids.includes(row.id);
      case 'paleontology': return fossilGroups[get('paleo-section').value]?.ids.includes(row.id);
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

  function renderCabinet(selected, entriesByGroup, cabinet) {
    const variant = get('botany-variant').value;
    const labels = variant === 'both' ? headings.slice(1) : headings.filter(([key]) => key === variant);
    for (const group of entriesByGroup) {
      const entries = selected.filter(row => group.ids.includes(row.id));
      if (!entries.length) continue;
      const section = node('section', '', cabinet + '-section');
      const grid = node('div', '', 'botany-grid');
      for (const row of entries) {
        const card = node('article', '', cabinet + '-card');
        card.append(node('h3', row.name), node('small', [row.id,row.rarity,row.oceanography?.nature,row.history?.compatibility].filter(Boolean).join(' · ')));
        const samples = node('div', '', 'botany-samples');
        for (const [key, title] of labels) samples.append(figure(row,key,title));
        card.append(samples);
        const open = node('button','Consultar y evaluar');
        open.addEventListener('click', () => inspect(row));
        card.append(open);
        grid.append(card);
      }
      section.append(node('h2',group.name),grid);
      gallery.append(section);
    }
  }

  function eggComparator(selected) {
    const proportional = get('egg-mode').value === 'proportional';
    const comparator = node('section','','egg-comparator');
    comparator.append(node('h2','Comparador de dimensiones de huevos'));
    comparator.append(node('p',proportional
      ? 'La longitud mayor de cada silueta se aproxima a la longitud documentada. Todas las piezas usan la misma regla.'
      : 'Todos los ejemplares ocupan la misma casilla de inventario. Cambia a escala proporcional para comparar tamaños reales.'));
    if (proportional) {
      const ruler = node('div','','egg-ruler');
      ruler.setAttribute('role','img');
      ruler.setAttribute('aria-label','Regla de 0 a 300 milímetros');
      for (const mark of [0,100,200,300]) ruler.append(node('span',String(mark)));
      comparator.append(ruler,node('small','Milímetros'));
    }
    const grid = node('div','','botany-grid');
    for (const row of selected) {
      const card = node('article','','egg-card');
      const picture = figure(row,'inventario');
      if (proportional) {
        picture.classList.add('egg-proportional');
        picture.style.setProperty('--egg-ratio', row.natural.length / 300 / 0.89);
      }
      const open = node('button','Ampliar y consultar');
      open.addEventListener('click', () => inspect(row,256));
      card.append(node('h3',row.name),picture,node('p',row.natural.dimensions),open);
      grid.append(card);
    }
    comparator.append(grid);
    gallery.append(comparator);
  }

  function substitutionCard(entry) {
    const card = node('article','','substitution-card');
    const before = byId.get(entry.old);
    const after = byId.get(entry.id);
    card.append(node('h3',entry.old + ' → ' + entry.id),node('p',entry.reason));
    const images = node('div','','botany-samples');
    images.append(figure(before,'inventario','Archivado · ' + before.name),figure(after,'inventario','Vigente · ' + after.name));
    card.append(images);
    const source = node('a','Referencia documental');
    source.href = entry.source;
    card.append(node('p',entry.collection + ' · ' + entry.rarity + ' · ' + entry.points + ' pts'),source);
    return card;
  }

  function auditDetail(row) {
    focusId = row.id;
    render();
    gallery.scrollIntoView({block:'start'});
  }

  function renderAudit(entries, retired) {
    const focused = entries.find(row => row.id === focusId);
    if (focused) {
      navigation(0,0);
      const back = node('button','Volver a la cuadrícula');
      back.addEventListener('click',() => { focusId = null; render(); });
      gallery.append(back);
      const entry = audits[focused.id];
      if (entry) gallery.append(node('p',entry.status + ' · ' + entry.note));
      if (entry?.previous) {
        const revision = node('div','','botany-samples');
        const resolution = size() <= 64 ? 64 : 128;
        const before = {...focused,sprites:{inventario:entry.previous}};
        revision.append(figure(before,'inventario','Inventario anterior',false,resolution),
          figure(focused,'inventario',entry.status === 'Requiere homologación' ? 'Contraste ajustado' : 'Lámina corregida',false,resolution));
        gallery.append(revision);
      }
      const replacement = bySubstitution.get(focused.id);
      if (replacement) gallery.append(substitutionCard(replacement));
      gallery.append(comparison(focused));
      return;
    }
    const count = Math.ceil(entries.length / pageSize);
    page = Math.min(page,Math.max(0,count - 1));
    navigation(page,count);
    const grid = node('div','','botany-grid');
    for (const row of entries.slice(page * pageSize,(page + 1) * pageSize)) {
      const entry = audits[row.id];
      const card = retired ? substitutionCard(bySubstitution.get(row.id)) : node('article','','audit-card');
      if (!retired) card.append(node('h3',row.name),node('small',row.id + ' · ' + entry.status),
        figure(row,'inventario'), node('p',entry.note));
      const open = node('button',retired ? 'Ficha y evaluación archivada' : 'Consultar y evaluar');
      open.addEventListener('click',() => auditDetail(row));
      card.append(open);
      grid.append(card);
    }
    gallery.append(grid);
  }

  function renderProfiles() {
    navigation(0,0);
    const heading = node('h2','Perfiles de distribución');
    gallery.append(heading,node('p','Peso medido de los archivos vigentes. Memoria RGBA estimada si todas las imágenes se decodificaran a la vez.'));
    const grid = node('div','','botany-grid');
    for (const profile of profiles) {
      const card = node('article','','profile-card');
      const mib = value => (value / 1048576).toFixed(2).replace('.',',') + ' MiB';
      card.append(node('h3',profile.name),node('p',profile.description),
        node('p',profile.files + ' archivos · ' + mib(profile.bytes) + ' en disco · ' + mib(profile.rgba) + ' RGBA estimados'));
      const variant = profile.assets.some(([key,pixels]) => key === 'inventario' && pixels >= size()) ? 'inventario' : 'clasica';
      const choices = profile.assets.filter(([key]) => key === variant).map(([,pixels]) => pixels);
      const resolution = choices.find(pixels => pixels >= size()) || choices.at(-1);
      for (const id of ['ARM-02','HUE-09','MARV-06']) {
        card.append(figure(byId.get(id),variant,byId.get(id).name + ' · fuente ' + resolution + ' px',false,resolution));
      }
      grid.append(card);
    }
    gallery.append(grid);
  }

  function render() {
    const view = get('view').value;
    const inAudit = view === 'audit';
    const inRetired = view === 'retired';
    const inPerformance = view === 'performance';
    get('audit-status-control').hidden = !inAudit;
    get('audit-similar-control').hidden = !inAudit;
    get('retired-control').hidden = !inRetired;
    const inArchive = view === 'archive';
    const inBotany = view === 'botany';
    get('botany-control').hidden = !inBotany;
    const inGeology = view === 'geology';
    get('geology-control').hidden = !inGeology;
    const inOceanography = view === 'oceanography';
    get('oceanography-control').hidden = !inOceanography;
    const inNatural = view === 'natural';
    const inEggs = view === 'eggs';
    get('natural-control').hidden = !inNatural;
    get('egg-control').hidden = !inEggs;
    const inHistory = view === 'history';
    for (const id of ['history-control','history-period-control','history-date-control']) get(id).hidden = !inHistory;
    get('botany-variant-control').hidden = !inBotany && !inGeology && !inOceanography && !inHistory && !inNatural;
    const inAssembly = inArchive && archiveSelect.value === 'assembly';
    get('archive-control').hidden = !inArchive;
    get('assembly-control').hidden = !inAssembly;
    const inPaleo = view === 'paleontology';
    const fossilSection = get('paleo-section').value;
    const reconstructing = inPaleo && fossilSection === 'mounts';
    get('paleo-control').hidden = !inPaleo;
    for (const id of ['mount','phase','living']) get(id + '-control').hidden = !reconstructing;
    for (const key of ['search','sort',...filters]) get(key).disabled = inAssembly || reconstructing || inPerformance;
    const single = view === 'compare' && get('layout').value === 'single';
    get('scope').disabled = view !== 'compare' || Boolean(get('stage').value);
    get('group-control').hidden = view !== 'groups';
    get('stock-control').hidden = view !== 'materials';
    get('recipe-control').hidden = view !== 'workshop';
    get('layout').disabled = view !== 'compare';
    const query = normalize(get('search').value.trim());
    const selected = sortRows((inRetired ? archivedRows : rows).filter(row => matchesView(row, view) &&
      normalize([row.name,row.id,row.provenance,...(row.species || [])].join(' ')).includes(query) &&
      filters.every(key => !get(key).value || get(key).value === (key === 'approval' ? approval(row) : row[key]))));
    gallery.replaceChildren();
    gallery.style.setProperty('--size', size() + 'px');
    if (inAudit || inRetired) {
      get('status').textContent = selected.length + (inRetired ? ' piezas archivadas' : ' ilustraciones principales');
      renderAudit(selected,inRetired);
      return;
    }
    if (inPerformance) {
      get('status').textContent = 'Tres perfiles experimentales';
      renderProfiles();
      return;
    }
    if (inAssembly) {
      navigation(0, 0);
      get('status').textContent = 'Seis mapas · requisitos de las recetas vigentes · simulación visual';
      renderAssembly();
      return;
    }
    if (reconstructing) {
      navigation(0, 0);
      const mount = paleontology.mounts.find(entry => entry.id === get('mount').value);
      const living = get('living').checked;
      get('status').textContent = 'Reconstrucción con existencias de prueba';
      gallery.append(reconstruction({mount, phase:Number(get('phase').value), living, byId, node,
        art: row => figure(row, 'inventario')}));
      const compare = node('button', 'Comparar y evaluar');
      compare.addEventListener('click', () => inspect(byId.get(living ? mount.living : mount.id)));
      gallery.append(compare);
      return;
    }
    get('status').textContent = selected.length + ' resultados' + (['compare','groups','archive','paleontology','botany','geology','oceanography','history','natural','eggs'].includes(view) ? '' : ' · Simulación con datos de prueba');
    if (inNatural || inEggs) {
      navigation(0, 0);
      if (inNatural) renderCabinet(selected,natural,view);
      else eggComparator(selected);
      return;
    }
    if (inHistory) {
      navigation(0, 0);
      const selectedComparison = historyComparisons.find(group => group.name === get('history-group').value);
      renderCabinet(selected, selectedComparison ? [selectedComparison] : history, view);
      return;
    }
    if (inOceanography) {
      navigation(0, 0);
      const selectedComparison = oceanographyComparisons.find(group => group.name === get('oceanography-group').value);
      renderCabinet(selected, selectedComparison ? [selectedComparison] : oceanography, view);
      return;
    }
    if (inBotany || inGeology) {
      navigation(0, 0);
      const selectedComparison = inGeology && geologyComparisons.find(group => group.name === get('geology-group').value);
      renderCabinet(selected, selectedComparison ? [selectedComparison] : inGeology ? geology : botany, view);
      return;
    }
    if (inPaleo) {
      navigation(0, 0);
      renderGroup(selected, fossilGroups[fossilSection]);
      return;
    }
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
  for (const key of ['view','group','botany-group','geology-group','oceanography-group','history-group','history-period','history-date','audit-status','audit-similar','retired-mode','natural-group','egg-mode','paleo-section','archive-section','recipe-example','scope','layout','sort',...filters]) get(key).addEventListener('change', resetPage);
  for (const key of ['scale','ground','halo','stock','assembly','botany-variant','mount','phase','living']) get(key).addEventListener('change', render);
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

  const initialView = new URLSearchParams(location.search).get('vista');
  if (['audit','retired','performance'].includes(initialView)) get('view').value = initialView;
  render();
})();
