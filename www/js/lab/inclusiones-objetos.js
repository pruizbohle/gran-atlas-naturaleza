(() => {
  'use strict';

  const {rows, materialIds, animalMaterialIds, paleontology, tradeRoutes, barter, botany, geology, geologyComparisons, oceanography, oceanographyComparisons, maritimeSources, history, historyComparisons, historicalSources, natural, naturalistScenarios, archivedRows} = AtlasObjetosCientificos;
  const {phases, reconstruction} = AtlasReconstruccionObjetos;
  const byId = new Map(rows.map(row => [row.id, row]));
  const get = id => document.getElementById(id);
  const gallery = get('gallery');
  const controls = get('controls');
  const navigation = get('navigation');
  const status = get('status');
  const dialog = get('detail');
  const functional = rows.filter(row => row.type === 'Objeto productivo');
  const collectible = rows.filter(row => row.type === 'Coleccionable propuesto');
  const museum = rows.filter(row => row.type === 'Pieza del Museo');
  const proposed = rows.filter(row => row.type.startsWith('Idea de ') || row.type === 'Reconstrucción complementaria');
  const proposals = [...collectible, ...proposed];
  const proposalModes = [['','Todas las propuestas'],['equipment','Equipamiento futuro'],['tiers','Tiers'],
    ['materials','Materiales animales adicionales'],['trade','Mercancías adicionales'],['future','Reconstrucciones futuras'],
    ['collectibles','Coleccionables'],['exhibitions','Exhibiciones'],['fauna','Asociaciones con fauna'],['retired','Evaluaciones archivadas']];
  function proposalMatches(row) {
    switch (state.proposalType) {
      case 'equipment': return row.type === 'Idea de equipamiento futuro';
      case 'tiers': return Boolean(row.tier);
      case 'materials': return row.type === 'Idea de material animal';
      case 'trade': return row.type === 'Idea de mercancía regional';
      case 'future': return row.type === 'Idea de montaje paleontológico' || row.type === 'Reconstrucción complementaria';
      case 'collectibles': return row.type === 'Coleccionable propuesto';
      case 'exhibitions': return Boolean(row.exhibit && row.type === 'Coleccionable propuesto');
      case 'fauna': return Boolean(row.natural?.species || row.natural && /^(ARQ|HUE)-/.test(row.id));
      default: return true;
    }
  }
  const fossils = new Set([...paleontology.materials,...paleontology.minors,...paleontology.future]);
  const equipment = functional.filter(row => row.slot || ['polar_coat','oceanic_quadrant','sounding_kit'].includes(row.id));
  const equipmentIdeas = proposed.filter(row => row.type === 'Idea de equipamiento futuro');
  const trade = new Set(barter.map(row => row.id));
  const cabinets = unique(collectible.map(row => row.cabinet));
  const collections = new Map();
  for (const row of collectible) {
    if (!collections.has(row.collection)) collections.set(row.collection, []);
    collections.get(row.collection).push(row);
  }

  const rarities = ['Común','Poco común','Raro','Muy raro'];
  const discoveries = new Set();
  const exhibitCabinets = {'Botánica':botany, 'Geología':geology, 'Oceanografía':oceanography, 'Historia':history, 'Historia natural y exploración':natural};
  const atlantis = oceanography.find(group => group.name === 'Secretos de Atlántida').ids.map(id => byId.get(id));
  const comparisons = [...geologyComparisons,...oceanographyComparisons,...historyComparisons];
  const historical = collectible.filter(row => row.history);
  const historicalPeriods = [...new Map(historical.slice().sort((a,b) => (a.history.year ?? Infinity) - (b.history.year ?? Infinity))
    .map(row => [row.history.period,row.history.period])).values()];
  const narrative = [
    'El expediente permanece cerrado. Cinco huecos esperan las piezas de la historia.',
    'El fragmento revela un trazado de anillos cortado por canales.',
    'El tridente del sello comparte el motivo central del plano.',
    'La llave sugiere compuertas entre los anillos del relato.',
    'El prisma representa la lectura de las mareas en el relato.',
    'Al reunir las cinco piezas, el plano, el sello, la llave, el prisma y la corona componen un relato de canales y anillos concéntricos.'
  ];
  const formats = {
    album:'Álbum de láminas científicas',
    cabinet:'Gabinete de muestras',
    showcase:'Vitrina de colección museística'
  };
  const progressOptions = ['0','25','50','75','100'].map(value => [value,value === '0' ? 'Sin descubrir · 0 %' : value + ' %']);
  const choices = ['Pendiente','Incluir','Incluir con modificaciones','Evaluar posteriormente','Descartar'];
  const storageKey = 'atlas-laboratorio-inclusiones:v1';
  let reviews = {};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) reviews = saved;
  } catch {
    // El registro se puede exportar aunque el navegador deshabilite la persistencia.
  }
  const state = {
    section:'inventory', query:'', page:0, scope:'existing', family:'', tier:'',
    group:'all', museum:'Fósiles', mount:paleontology.mounts[0].id, phase:'3', form:'skeleton',
    cabinet:'', collection:'', grandCabinet:'', grandCollection:'', progress:'50', discoveryRarity:'Poco común', approval:'', origin:'', proposalType:'',
    exhibitCabinet:'Botánica', exhibitCollection:botany[0].name, exhibitFormat:'album', exhibitProgress:'100',
    naturalistSource:naturalistScenarios[0].id,
    maritimeSource:maritimeSources[0].id, atlantisCount:'0', historicalSource:historicalSources[0].id,
    historicalContinent:'', historicalCulture:'', historicalPeriod:'', historicalType:'',
    instrument:'binoculars', hat:'field_hat', necklace:'amulet', bag:'sturdy_pack'
  };
  const perPage = 24;

  function unique(items) {
    return [...new Set(items)].filter(Boolean).sort((a,b) => a.localeCompare(b,'es'));
  }

  function node(tag, value, className) {
    const el = document.createElement(tag);
    if (value) el.textContent = value;
    if (className) el.className = className;
    return el;
  }

  function button(text, action) {
    const el = node('button', text);
    el.type = 'button';
    el.addEventListener('click', action);
    return el;
  }

  function select(key, title, entries) {
    const label = node('label', title);
    const input = node('select');
    input.id = 'include-' + key;
    for (const [value, text] of entries) input.add(new Option(text, value));
    input.value = state[key];
    input.addEventListener('change', () => {
      state[key] = input.value;
      state.page = 0;
      if (key === 'cabinet') state.collection = '';
      if (key === 'grandCabinet') state.grandCollection = '';
      if (key === 'exhibitCabinet') state.exhibitCollection = exhibitCabinets[input.value][0].name;
      if (key === 'progress') discoveries.clear();
      render();
      get(input.id)?.focus();
    });
    label.append(input);
    controls.append(label);
  }

  function search() {
    const label = node('label','Buscar');
    const input = node('input');
    input.type = 'search';
    input.id = 'include-query';
    input.placeholder = 'Nombre o identificador';
    input.value = state.query;
    input.addEventListener('input', () => {
      state.query = input.value;
      state.page = 0;
      renderContent();
    });
    label.append(input);
    controls.append(label);
  }

  function normalize(value) {
    return value.toLowerCase().normalize('NFD').replace(/\p{Mark}/gu,'');
  }

  function matches(row) {
    return normalize([row.name,row.id,row.provenance,row.natural?.species?.name,row.natural?.species?.latin,row.natural?.identity].filter(Boolean).join(' ')).includes(normalize(state.query.trim()));
  }

  function figure(row, visibility = true, caption = '', pixels = 128) {
    const box = node('figure');
    const stage = node('div', '', 'stage');
    const source = row.sprites.inventario?.[pixels];
    if (!visibility) {
      if ((row.botany || row.geology || row.oceanography || row.history || row.natural) && source) {
        const silhouette = node('img');
        silhouette.src = source.src;
        silhouette.alt = '';
        silhouette.loading = 'lazy';
        silhouette.decoding = 'async';
        stage.classList.add('botany-undiscovered');
        stage.append(silhouette);
      }
      stage.append(node('span','Pendiente de descubrir'));
    } else if (source) {
      const image = node('img');
      image.src = source.src;
      image.alt = row.name;
      image.loading = 'lazy';
      image.decoding = 'async';
      stage.append(image);
    } else if (row.newArtwork === false && row.original?.svg) {
      stage.innerHTML = row.original.svg;
    } else {
      stage.append(node('span','Ilustración pendiente'));
    }
    box.append(stage);
    if (caption) box.append(node('figcaption', caption));
    return box;
  }

  function card(row, visible = true, summary = '') {
    const tile = node('article', '', 'inclusion-card');
    tile.append(figure(row, visible), node('h3', row.name),
      node('small', summary || row.rarity || (row.tier ? 'Tier ' + row.tier : row.type)));
    if (!visible && !row.sprites.inventario) tile.append(node('small', 'Ilustración pendiente'));
    if (row.history) tile.append(node('small',row.history.compatibility,'history-status'));
    tile.append(button('Ficha', () => detail(row,visible)));
    return tile;
  }

  function grid(entries, renderer = row => card(row)) {
    const list = node('div', '', 'display-grid');
    for (const row of entries) list.append(renderer(row));
    return list;
  }

  function detail(row, visible = true) {
    const body = get('detail-content');
    const h = node('h2', row.name);
    h.id = 'detail-title';
    const facts = node('dl');
    const fields = [['Categoría',row.type],['Gabinete',row.cabinet],['Colección',row.collection],
      ['Rareza',row.rarity],['Procedencia',row.provenance || row.continent],['Descripción',row.description],
      ['Obtención sugerida',row.natural?.acquisition || (row.history ? 'Registro, reproducción o intercambio de gabinete autorizado.' : row.acquisition)],['Uso sugerido',row.uses],['Contexto',row.context],
      ['Identificación u origen',row.botany?.identity],['Caracteres diagnósticos',row.botany?.characteristics],
      ['Escala real',row.botany?.scale],['Puntos de colección',row.points],
      ['Clasificación',row.geology?.classification],['Composición',row.geology?.composition],['Hábito o estructura',row.geology?.structure],
      ['Rasgo documentado',row.geology?.diagnostic],['Contexto histórico',row.geology?.history],['Observación de la lámina',row.geology?.plate],
      ['Naturaleza',row.oceanography?.nature],['Identificación',row.oceanography?.identity],
      ['Clasificación marítima',row.oceanography?.classification],['Material',row.oceanography?.material],
      [row.oceanography?.nature === 'Ficción explícita' ? 'Rasgo de diseño' : 'Rasgo diagnóstico',row.oceanography?.diagnostic],
      ['Hábitat',row.oceanography?.habitat],['Marco histórico',row.oceanography?.history],['Observación de la lámina',row.oceanography?.plate],
      ['Identificación histórica',row.history?.identity],['Cultura',row.history?.culture],['Periodo',row.history?.period],
      ['Fecha de referencia',row.history?.date],['Material histórico',row.history?.material],['Rasgos',row.history?.diagnostic],
      ['Contexto cultural',row.history?.culturalContext],['Compatibilidad con 1842',row.history?.compatibility],
      ['Tratamiento',row.history?.treatment],['Observaciones documentales',row.history?.note],['Identificación científica',row.natural?.identity],['Clasificación científica',row.natural?.classification],
      ['Material del ejemplar',row.natural?.material],['Dimensiones aproximadas',row.natural?.dimensions],['Rasgo diagnóstico',row.natural?.diagnostic],
      ['Asociación con fauna',row.natural?.species?.name || row.natural?.association],
      ['Contexto científico',row.natural?.science],['Contexto histórico',row.natural?.history],
      ['Compatibilidad con 1842',row.natural && row.chronology.status],['Observaciones de gabinete',row.natural?.note],['Estado artístico',row.artState],['Observaciones',row.observations]];
    for (const [label, value] of fields) {
      if (value) facts.append(node('dt',label),node('dd',value));
    }
    const discoverable = row.type === 'Coleccionable propuesto' && ['album','grand'].includes(state.section);
    const showSample = visible && (!discoverable || discovered(row));
    body.replaceChildren(h,figure(row,showSample,'',row.botany || row.geology || row.oceanography || row.history ? 256 : 128),facts);
    if (row.geology) {
      const source = node('a','Fuente mineralógica o geológica');
      source.href = row.geology.source;
      body.append(source);
    }
    if (row.oceanography) {
      const source = row.oceanography.source;
      if (source.startsWith('https://')) {
        const link = node('a','Fuente documental');
        link.href = source;
        body.append(link);
      } else body.append(node('p','Fuente: ' + source));
    }
    if (row.history || row.natural) {
      const link = node('a','Referencia de colección');
      link.href = row.history?.source || row.natural.source;
      body.append(link);
    }
    if (showSample) {
      const related = [...new Set(comparisons.filter(group => group.ids.includes(row.id))
        .flatMap(group => group.ids))].filter(id => id !== row.id).map(id => byId.get(id));
      if (related.length) {
        body.append(node('h3','Comparar con muestras similares'),grid(related, other =>
          card(other,!discoverable || other.type !== 'Coleccionable propuesto' || discovered(other),
            other.geology?.classification || other.oceanography?.classification || other.history?.culture || other.type)));
      }
    }
    if (!dialog.open) dialog.showModal();
  }

  function paginate(entries, renderPage) {
    const pages = Math.ceil(entries.length / perPage);
    state.page = Math.min(state.page, Math.max(pages - 1,0));
    renderPage(entries.slice(state.page * perPage,(state.page + 1) * perPage));
    if (pages <= 1) return;
    for (const [label, offset] of [['Anterior',-1],['Siguiente',1]]) {
      const control = button(label, () => {
        state.page += offset;
        renderContent();
        const available = [...navigation.querySelectorAll('button')].find(el => el.textContent === label && !el.disabled);
        (available || navigation.querySelector('button:not(:disabled)'))?.focus();
      });
      control.disabled = state.page + offset < 0 || state.page + offset >= pages;
      navigation.append(control);
    }
    navigation.append(node('span', 'Página ' + (state.page + 1) + ' de ' + pages));
  }

  function category(row) {
    if (fossils.has(row.id) || row.type === 'Reconstrucción complementaria') return 'Fósiles';
    if (row.family === 'Cartografía') return 'Cartografía';
    if (trade.has(row.id) || row.type === 'Idea de mercancía regional') return 'Mercancías regionales';
    if (equipment.includes(row) || equipmentIdeas.includes(row)) return 'Equipamiento';
    return 'Materiales';
  }

  function inventory() {
    const pool = state.scope === 'existing' ? functional : state.scope === 'proposed' ? proposed : [...functional,...proposed];
    const entries = pool.filter(row => (!state.family || category(row) === state.family) && matches(row));
    status.textContent = entries.length + ' objetos';
    paginate(entries, page => gallery.append(grid(page, row => card(row,true,
      row.type === 'Objeto productivo' ? 'Existencias de prueba ×' + (functional.indexOf(row) % 12 + 1) : row.type))));
  }

  const loadout = {
    instrument:{title:'Instrumento', matches:row => row.slot === 'instrument' && row.id !== 'sturdy_pack' ||
      row.family === 'Instrumentos científicos'},
    hat:{title:'Sombrero', matches:row => row.slot === 'hat' || row.family === 'Sombreros y prendas'},
    necklace:{title:'Colgante', matches:row => row.slot === 'necklace'},
    bag:{title:'Morral', matches:row => row.id === 'sturdy_pack' ||
      equipmentIdeas.includes(row) && row.family === 'Materiales de expedición'}
  };

  function team() {
    const picked = Object.keys(loadout).map(key => byId.get(state[key]));
    gallery.append(node('h3','Combinación de prueba'),grid(picked, row => card(row,true,row.tier ? 'Tier ' + row.tier : row.type)));
    const entries = [...equipment,...equipmentIdeas].filter(row => (!state.tier || row.tier === state.tier) && matches(row));
    status.textContent = entries.length + ' piezas de equipo';
    const section = node('section','','equipment-section');
    section.append(node('h3','Equipo y propuestas'));
    paginate(entries, page => section.append(grid(page)));
    gallery.append(section);
  }

  function materials() {
    const existing = materialIds.map(id => byId.get(id));
    const animal = existing.filter(row => animalMaterialIds.includes(row.id));
    const expedition = existing.filter(row => !animal.includes(row));
    const ideas = proposed.filter(row => row.type === 'Idea de material animal');
    const groups = [['Materiales animales',animal],['Materiales de expedición',expedition],['Materiales animales propuestos',ideas]];
    status.textContent = groups.reduce((sum,[,items]) => sum+items.filter(matches).length,0) + ' materiales';
    for (const [title, items] of groups) {
      const entries = items.filter(matches);
      if (entries.length) gallery.append(node('h3',title),grid(entries));
    }
  }

  function commerce() {
    const goods = functional.filter(row => trade.has(row.id) && matches(row));
    const ideas = proposed.filter(row => row.type === 'Idea de mercancía regional' && matches(row));
    status.textContent = goods.length + ideas.length + ' mercancías';
    gallery.append(node('h3','Mercancías regionales'),grid(goods),
      node('h3','Propuestas comerciales'),grid(ideas));
    if (state.query) return;
    const section = node('section','','exchange-section');
    section.append(node('h3','Rutas comerciales de referencia'));
    const routes = node('div','','route-list');
    for (const route of tradeRoutes) {
      const panel = node('article');
      const stock = node('div','','display-grid');
      for (const [id, amount] of Object.entries(route.rewards)) {
        const row = byId.get(id);
        if (row) stock.append(figure(row,true,row.name + ' ×' + amount));
      }
      panel.append(node('h4',route.name),stock);
      routes.append(panel);
    }
    section.append(routes,node('h3','Trueques regionales de referencia'));
    const swaps = node('div','','route-list');
    for (const {id,continent,material,quantity} of barter) {
      const panel = node('article');
      const input = byId.get(material);
      const output = byId.get(id);
      const flow = node('div','','exchange-flow');
      flow.append(figure(input,true,input.name + ' ×' + quantity),node('span','→'),figure(output,true,output.name));
      panel.append(node('h4',continent),flow);
      swaps.append(panel);
    }
    section.append(swaps);
    gallery.append(section);
  }

  function discovered(row) {
    const members = collections.get(row.collection);
    return discoveries.has(row.id) || members.indexOf(row) < Math.floor(members.length * Number(state.progress) / 100);
  }

  function progressLine(name, entries) {
    const entry = node('div','','progress-row');
    const count = entries.filter(discovered).length;
    const bar = node('progress');
    bar.value = count;
    bar.max = entries.length;
    bar.setAttribute('aria-label','Progreso de ' + name);
    entry.append(node('span',name),bar,node('span',count + '/' + entries.length));
    return entry;
  }

  function score(entries) {
    const sum = members => members.reduce((points,row) => points + row.points,0);
    return sum(entries.filter(discovered)) + '/' + sum(entries) + ' puntos de colección';
  }

  function discoveryCandidate() {
    return collectible.find(row => row.cabinet === state.cabinet && !after1842(row) && row.rarity === state.discoveryRarity &&
      (!state.collection || row.collection === state.collection) && matches(row) && !discovered(row));
  }

  function after1842(row) {
    return Boolean(row.history || row.natural) && row.chronology.status === 'Posterior a 1842';
  }

  function demonstrateDiscovery(row = discoveryCandidate(), openAlbum = false) {
    if (!row || discovered(row)) return;
    discoveries.add(row.id);
    renderContent();
    const panel = node('section','','discovery-panel');
    panel.dataset.rarity = String(rarities.indexOf(row.rarity));
    const title = node('h2', row.name);
    title.id = 'detail-title';
    const rarity = node('p',row.rarity,'discovery-rarity');
    const picture = figure(row,true,'',512);
    const members = collections.get(row.collection);
    panel.append(node('p','Descubrimiento de prueba','discovery-kicker'),title,rarity,picture,
      node('p',row.provenance || row.continent),progressLine(row.collection,members),
      node('p',score(members)));
    if (openAlbum) {
      panel.append(button('Ver en el álbum', () => {
        state.cabinet = row.cabinet;
        state.collection = row.collection;
        dialog.close();
        get('sections').querySelector('[data-page="album"]').click();
      }));
    }
    get('detail-content').replaceChildren(panel);
    dialog.showModal();
  }

  function albumEntries(cabinet = state.cabinet, collection = state.collection) {
    return collectible.filter(row => (!cabinet || row.cabinet === cabinet) &&
      (!collection || row.collection === collection) && matches(row));
  }

  function grandCabinet() {
    const entries = albumEntries(state.grandCabinet,state.grandCollection);
    const found = collectible.filter(discovered).length;
    status.textContent = entries.length + (entries.length === 1 ? ' pieza · ' : ' piezas · ') + found + ' descubiertas de ' + collectible.length;
    const summary = node('section','','grand-summary');
    summary.append(node('h3','Catálogo completo'),progressLine('Progreso global',collectible),
      node('p',score(collectible)), node('p',found + ' descubiertas · ' + (collectible.length - found) + ' pendientes'));
    if (found === collectible.length) summary.append(node('p','Catálogo completo · 300 piezas documentadas','collection-complete'));
    const distribution = node('ul','','rarity-summary');
    for (const rarity of rarities) {
      const members = collectible.filter(row => row.rarity === rarity);
      distribution.append(node('li',rarity + ' · ' + members.filter(discovered).length + '/' + members.length));
    }
    summary.append(node('h4','Descubiertas por rareza'),distribution);
    gallery.append(summary);
    const progress = node('div','','grand-progress');
    for (const [cabinet,groups] of Object.entries(exhibitCabinets)) {
      if (state.grandCabinet && cabinet !== state.grandCabinet) continue;
      const members = groups.flatMap(group => collections.get(group.name));
      const panel = node('section','','grand-summary');
      panel.append(node('h3',cabinet),progressLine('Gabinete',members),node('p',score(members)));
      if (members.every(discovered)) panel.append(node('p','Gabinete completo','collection-complete'));
      for (const group of groups) {
        if (state.grandCollection && group.name !== state.grandCollection) continue;
        const collection = collections.get(group.name);
        panel.append(progressLine(group.name,collection));
        if (collection.every(discovered)) panel.append(node('p',group.name + ' · colección completa','collection-complete'));
      }
      progress.append(panel);
    }
    gallery.append(progress);
    paginate(entries,page => gallery.append(grid(page,row => {
      const visible = discovered(row);
      return card(row,visible,[row.collection,row.rarity,row.points + ' pts',visible ? 'Descubierta' : 'Pendiente'].join(' · '));
    })));
  }

  function album() {
    const entries = albumEntries();
    status.textContent = entries.length + ' piezas · 300 en el álbum';
    const summary = node('div','','progress-list');
    for (const cabinet of cabinets) summary.append(progressLine(cabinet,collectible.filter(row => row.cabinet === cabinet)));
    gallery.append(summary);
    if (state.cabinet === 'Historia') gallery.append(node('p','El progreso de prueba incluye piezas posteriores a 1842 como referencias de gabinete.'));
    if (Object.hasOwn(exhibitCabinets,state.cabinet)) {
      const membersInCabinet = collectible.filter(row => row.cabinet === state.cabinet);
      const summary = node('div','','progress-list botanical-summary cabinet-summary');
      for (const [name,members] of collections) {
        if (members[0].cabinet === state.cabinet) summary.append(progressLine(name,members));
      }
      gallery.append(node('p',score(membersInCabinet),'album-score'),summary);
      const trigger = get('include-discover');
      trigger.disabled = !discoveryCandidate();
      get('discovery-status').textContent = trigger.disabled ?
        'No quedan piezas de esta rareza en la selección actual.' : '';
    }
    paginate(entries, page => {
      for (const [name, members] of collections) {
        const visible = page.filter(row => row.collection === name);
        if (!visible.length) continue;
        const section = node('section','','album-section');
        section.append(node('h3',name),progressLine(name,members),node('p',score(members),'album-score'),grid(visible, row =>
          card(row,discovered(row),row.rarity + ' · ' + (discovered(row) ? 'Descubierta' : 'Pendiente'))));
        gallery.append(section);
      }
    });
  }

  function exhibition() {
    const members = collections.get(state.exhibitCollection);
    const baseline = Math.floor(members.length * Number(state.exhibitProgress) / 100);
    status.textContent = baseline + ' de ' + members.length + ' piezas exhibidas';
    const section = node('section','','collection-exhibition exhibition-' + state.exhibitFormat);
    section.append(node('h3',state.exhibitCollection),node('p',formats[state.exhibitFormat] + ' · ' + state.exhibitCabinet));
    const bar = node('progress');
    bar.max = members.length;
    bar.value = baseline;
    bar.setAttribute('aria-label','Progreso de la exhibición');
    section.append(bar,grid(members, (row) => card(row,members.indexOf(row) < baseline,
      row.rarity + ' · ' + (members.indexOf(row) < baseline ? 'Exhibida' : 'Pendiente'))));
    gallery.append(section);
  }

  function discoverySources(sources, key) {
    const source = sources.find(entry => entry.id === state[key]);
    const entries = source.ids.map(id => byId.get(id)).filter(matches);
    status.textContent = entries.length + ' asociaciones editoriales';
    gallery.append(node('h3',source.name),node('p',source.description));
    gallery.append(grid(entries, row => {
      const added = discovered(row);
      const late = after1842(row);
      const tile = card(row,added,[row.rarity,row.natural?.species?.name || row.natural?.association || row.oceanography?.nature].filter(Boolean).join(' · '));
      const action = button(late ? 'Referencia futura' : added ? 'En el álbum' : 'Simular descubrimiento',
        () => demonstrateDiscovery(row,true));
      action.disabled = added || late;
      tile.append(action);
      return tile;
    }));
  }

  function civilizations() {
    const timeline = node('nav','','history-timeline');
    timeline.setAttribute('aria-label','Línea temporal histórica');
    for (const period of ['',...historicalPeriods]) {
      const mark = button(period || 'Todos los periodos', () => {
        state.historicalPeriod = period;
        state.page = 0;
        renderContent();
        gallery.querySelector('.history-timeline [aria-pressed="true"]')?.focus();
      });
      mark.setAttribute('aria-pressed',String(state.historicalPeriod === period));
      timeline.append(mark);
    }
    gallery.append(timeline);
    const entries = historical.filter(row => matches(row) &&
      (!state.historicalContinent || row.continent === state.historicalContinent) &&
      (!state.historicalCulture || row.history.culture === state.historicalCulture) &&
      (!state.historicalType || row.collection === state.historicalType) &&
      (!state.historicalPeriod || row.history.period === state.historicalPeriod))
      .sort((a,b) => (a.history.year ?? Infinity) - (b.history.year ?? Infinity) || a.name.localeCompare(b.name,'es'));
    status.textContent = entries.length + ' registros históricos';
    paginate(entries,page => gallery.append(grid(page,row => card(row,true,row.history.date + ' · ' + row.history.culture))));
  }

  function atlantisView() {
    const count = Number(state.atlantisCount);
    const complete = count === atlantis.length;
    status.textContent = count + ' de ' + atlantis.length + ' piezas · ficción explícita';
    const display = node('section','','collection-exhibition atlantis-case');
    display.append(node('h3','Expediente ficticio de Atlántida'),node('p',narrative[count]));
    const progress = node('progress');
    progress.max = atlantis.length;
    progress.value = count;
    progress.setAttribute('aria-label','Piezas descubiertas de Atlántida');
    display.append(progress);
    if (complete) {
      const rings = node('div','','atlantis-rings');
      rings.setAttribute('role','img');
      rings.setAttribute('aria-label','Plano imaginario de los anillos de Atlántida');
      rings.append(node('span','Colección completada'));
      display.append(rings);
    }
    display.append(grid(atlantis, (row) => card(row,atlantis.indexOf(row) < count,
      atlantis.indexOf(row) < count ? 'Ficción · Descubierta' : 'Ficción · Pendiente')));
    gallery.append(display);
  }

  function museumView() {
    const mounts = museum.filter(row => row.collection === 'Reconstrucciones fósiles');
    const artifacts = museum.filter(row => row.collection === 'Artefactos del Museo');
    const permanent = museum.filter(row => row.collection === 'Archivo paleontológico');
    const relics = museum.filter(row => row.newArtwork === false);
    const subviews = {
      'Exposiciones':[...mounts,...artifacts],
      'Muestras':[...permanent,...paleontology.materials.map(id => byId.get(id))],
      'Relictos':relics,
      'Artefactos':artifacts
    };
    if (state.museum !== 'Fósiles') {
      const entries = subviews[state.museum].filter(matches);
      status.textContent = entries.length + ' piezas';
      paginate(entries, page => gallery.append(grid(page)));
      return;
    }
    const mount = paleontology.mounts.find(row => row.id === state.mount);
    gallery.append(reconstruction({mount, phase:Number(state.phase), living:state.form === 'living',
      byId, node, art:row => figure(row,true,'',row.id === mount.id || row.id === mount.living ? 256 : 128)}));
    gallery.append(node('h3','Montajes futuros'),grid(paleontology.future.map(id => byId.get(id))));
    status.textContent = '8 reconstrucciones · 12 montajes propuestos';
  }

  function origin(row) {
    if (row.type === 'Coleccionable propuesto') return 'OBJ-01';
    if (row.type === 'Idea de equipamiento futuro') return row.stage === 'OBJ-02' ? 'OBJ-02' : 'OBJ-01';
    if (row.type === 'Idea de material animal') return 'OBJ-03';
    if (row.type === 'Idea de mercancía regional') return 'OBJ-04';
    return 'OBJ-05';
  }

  function suggest(row) {
    if (row.uses || row.description) return row.uses || row.description;
    if (row.type === 'Idea de mercancía regional') return 'Muestra futura para comercio regional';
    return 'Montaje futuro para el Museo';
  }

  function reviewFields(row) {
    const form = node('form');
    const decision = node('select');
    decision.setAttribute('aria-label','Aprobación de ' + row.name);
    for (const choice of choices) decision.add(new Option(choice));
    decision.value = reviews[row.id]?.decision || choices[0];
    const notes = node('textarea');
    notes.rows = 2;
    notes.setAttribute('aria-label','Observaciones de ' + row.name);
    notes.value = reviews[row.id]?.notes || '';
    form.append(decision,notes,node('button','Guardar'));
    form.addEventListener('submit', event => {
      event.preventDefault();
      reviews[row.id] = {decision:decision.value, notes:notes.value.trim()};
      try {
        localStorage.setItem(storageKey,JSON.stringify(reviews));
        if (state.approval) renderContent();
        status.textContent = 'Evaluación guardada · ' + row.name;
      } catch {
        status.textContent = 'Evaluación disponible para exportación · ' + row.name;
      }
    });
    return form;
  }

  function inclusionTable(entries) {
    const wrapper = node('div','','inclusion-table-wrap');
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role','region');
    wrapper.setAttribute('aria-label','Tabla de propuestas');
    const table = node('table','','inclusion-table');
    table.append(node('caption','Propuestas de incorporación'));
    const headings = node('tr');
    for (const text of ['Nombre','Categoría','Sprite','Origen','Función sugerida','Arte','Aprobación y observaciones']) {
      const heading = node('th',text);
      heading.scope = 'col';
      headings.append(heading);
    }
    const header = node('thead');
    header.append(headings);
    const body = node('tbody');
    for (const row of entries) {
      const line = node('tr');
      const contents = [button(row.name, () => detail(row)),row.type,figure(row),origin(row),suggest(row),row.artState,reviewFields(row)];
      for (const item of contents) {
        const cell = node('td');
        cell.append(item);
        line.append(cell);
      }
      body.append(line);
    }
    table.append(header,body);
    wrapper.append(table);
    return wrapper;
  }

  function register() {
    const pool = state.proposalType === 'retired' ? archivedRows : state.proposalType === 'tiers' ? [...equipment,...proposals] : proposals;
    if (state.proposalType === 'exhibitions') {
      const link = node('a','Abrir exhibiciones');
      link.href = '?vista=exhibition';
      gallery.append(link);
    }
    if (state.proposalType === 'fauna') {
      const link = node('a','Abrir hallazgos naturalistas');
      link.href = '?vista=naturalist';
      gallery.append(link);
    }
    const entries = pool.filter(row => proposalMatches(row) && matches(row) && (!state.origin || state.origin === origin(row)) &&
      (!state.approval || state.approval === (reviews[row.id]?.decision || choices[0])));
    status.textContent = entries.length + ' propuestas';
    paginate(entries,page => gallery.append(inclusionTable(page)));
  }

  function exportReviews() {
    const file = new Blob([JSON.stringify({version:1,reviews},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(file);
    const link = node('a');
    link.href = url;
    link.download = 'evaluaciones-inclusiones-atlas.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  }

  function renderContent() {
    status.textContent = '';
    gallery.replaceChildren();
    navigation.replaceChildren();
    ({inventory,equipment:team,materials,trade:commerce,album,grand:grandCabinet,naturalist:() => discoverySources(naturalistScenarios,'naturalistSource'),exhibition,maritime:() => discoverySources(maritimeSources,'maritimeSource'),
      historical:() => discoverySources(historicalSources,'historicalSource'),civilizations,atlantis:atlantisView,museum:museumView,register})[state.section]();
  }

  function render() {
    controls.replaceChildren();
    if (!['exhibition','atlantis'].includes(state.section) && (state.section !== 'museum' || state.museum !== 'Fósiles')) search();
    if (state.section === 'inventory') {
      select('scope','Alcance',[['existing','Objetos existentes'],['proposed','Inclusiones propuestas'],['all','Todos los objetos']]);
      select('family','Categoría',[['','Todas'],...['Materiales','Equipamiento','Fósiles','Cartografía','Mercancías regionales'].map(label => [label,label])]);
    }
    if (state.section === 'equipment') {
      for (const [key, {title,matches:eligible}] of Object.entries(loadout)) {
        select(key,title,[...new Set([...equipment,...equipmentIdeas])].filter(eligible).map(row => [row.id,row.name]));
      }
      select('tier','Tier artístico',[['','Todos'],...['I','II','III','IV'].map(tier => [tier,'Tier ' + tier])]);
    }
    if (['album','grand'].includes(state.section)) {
      const grand = state.section === 'grand';
      const cabinetKey = grand ? 'grandCabinet' : 'cabinet';
      select(cabinetKey,'Gabinete',[['','Todos'],...cabinets.map(name => [name,name])]);
      const available = [...collections].filter(([,members]) => !state[cabinetKey] || members[0].cabinet === state[cabinetKey]);
      select(grand ? 'grandCollection' : 'collection','Colección',[['','Todas'],...available.map(([name]) => [name,name])]);
      select('progress','Progreso de prueba',progressOptions);
      if (state.section === 'album' && Object.hasOwn(exhibitCabinets,state.cabinet)) {
        select('discoveryRarity','Rareza del descubrimiento',rarities.map(value => [value,value]));
        const trigger = button('Probar descubrimiento',() => demonstrateDiscovery());
        trigger.id = 'include-discover';
        trigger.setAttribute('aria-describedby','discovery-status');
        const availability = node('small');
        availability.id = 'discovery-status';
        availability.setAttribute('role','status');
        controls.append(trigger,availability);
      }
    }
    if (state.section === 'exhibition') {
      select('exhibitCabinet','Gabinete',Object.keys(exhibitCabinets).map(name => [name,name]));
      select('exhibitCollection','Colección',exhibitCabinets[state.exhibitCabinet].map(group => [group.name,group.name]));
      select('exhibitFormat','Presentación',Object.entries(formats));
      select('exhibitProgress','Progreso de exhibición',progressOptions);
    }
    if (state.section === 'naturalist') {
      select('naturalistSource','Tipo de hallazgo',naturalistScenarios.map(scenario => [scenario.id,scenario.name]));
      select('progress','Progreso de prueba',progressOptions);
    }
    if (state.section === 'maritime') {
      select('maritimeSource','Fuente propuesta',maritimeSources.map(source => [source.id,source.name]));
      select('progress','Progreso de prueba',progressOptions);
    }
    if (state.section === 'civilizations') {
      select('historicalContinent','Continente',[['','Todos'],...unique(historical.map(row => row.continent)).map(value => [value,value])]);
      select('historicalCulture','Cultura',[['','Todas'],...unique(historical.map(row => row.history.culture)).map(value => [value,value])]);
      select('historicalType','Tipo de objeto',[['','Todos'],...history.map(group => [group.name,group.name])]);
    }
    if (state.section === 'historical') {
      select('historicalSource','Fuente propuesta',historicalSources.map(source => [source.id,source.name]));
      select('progress','Progreso de prueba',progressOptions);
    }
    if (state.section === 'atlantis') {
      select('atlantisCount','Piezas descubiertas',atlantis.map((row,i) => [String(i),String(i)])
        .concat([[String(atlantis.length),String(atlantis.length)]]));
    }
    if (state.section === 'museum') {
      select('museum','Sala',['Exposiciones','Muestras','Fósiles','Relictos','Artefactos'].map(name => [name,name]));
      if (state.museum === 'Fósiles') {
        select('mount','Reconstrucción',paleontology.mounts.map(row => [row.id,row.name]));
        select('phase','Avance',phases.map((phase,i) => [String(i),phase.name]));
        select('form','Representación',[['skeleton','Esqueleto'],['living','En vida']]);
      }
    }
    if (state.section === 'register') {
      select('proposalType','Panel global de propuestas',proposalModes);
      select('approval','Estado',[['','Todos'],...choices.map(choice => [choice,choice])]);
      select('origin','Etapa',[['','Todas'],...unique(proposals.map(origin)).map(stage => [stage,stage])]);
      controls.append(button('Exportar evaluaciones',exportReviews));
    }
    renderContent();
  }

  const sections = [...get('sections').querySelectorAll('button')];
  for (const tab of sections) {
    tab.addEventListener('click', () => {
      state.section = tab.dataset.page;
      state.query = '';
      state.page = 0;
      for (const other of sections) other.removeAttribute('aria-current');
      tab.setAttribute('aria-current','page');
      get('section-title').textContent = tab.textContent;
      render();
    });
  }
  const initialView = new URLSearchParams(location.search).get('vista');
  (sections.find(tab => tab.dataset.page === initialView) || sections[0]).click();
})();
