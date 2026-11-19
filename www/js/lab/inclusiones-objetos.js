(() => {
  'use strict';

  const {rows, materialIds, animalMaterialIds, paleontology, tradeRoutes, barter} = AtlasObjetosCientificos;
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
    cabinet:'', collection:'', progress:'50', discoveryRarity:'Poco común', approval:'', origin:'',
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
    return normalize([row.name,row.id,row.provenance].filter(Boolean).join(' ')).includes(normalize(state.query.trim()));
  }

  function figure(row, visibility = true, caption = '', pixels = 128) {
    const box = node('figure');
    const stage = node('div', '', 'stage');
    const source = row.sprites.inventario?.[pixels];
    if (!visibility) {
      if (row.botany && source) {
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
    tile.append(button('Ficha', () => detail(row)));
    return tile;
  }

  function grid(entries, renderer = row => card(row)) {
    const list = node('div', '', 'display-grid');
    for (const row of entries) list.append(renderer(row));
    return list;
  }

  function detail(row) {
    const body = get('detail-content');
    const h = node('h2', row.name);
    h.id = 'detail-title';
    const facts = node('dl');
    const fields = [['Categoría',row.type],['Gabinete',row.cabinet],['Colección',row.collection],
      ['Rareza',row.rarity],['Procedencia',row.provenance || row.continent],['Descripción',row.description],
      ['Obtención sugerida',row.acquisition],['Uso sugerido',row.uses],['Contexto',row.context],
      ['Identificación u origen',row.botany?.identity],['Caracteres diagnósticos',row.botany?.characteristics],
      ['Escala real',row.botany?.scale],['Puntos de colección',row.points],
      ['Estado artístico',row.artState],['Observaciones',row.observations]];
    for (const [label, value] of fields) {
      if (value) facts.append(node('dt',label),node('dd',value));
    }
    const discoverable = row.type === 'Coleccionable propuesto' && state.section === 'album';
    body.replaceChildren(h,figure(row,!discoverable || discovered(row),'',row.botany ? 256 : 128),facts);
    dialog.showModal();
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
    return collectible.find(row => row.botany && row.rarity === state.discoveryRarity &&
      (!state.collection || row.collection === state.collection) && matches(row) && !discovered(row));
  }

  function demonstrateDiscovery() {
    const row = discoveryCandidate();
    if (!row) return;
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
    get('detail-content').replaceChildren(panel);
    dialog.showModal();
  }

  function album() {
    const entries = collectible.filter(row => (!state.cabinet || row.cabinet === state.cabinet) &&
      (!state.collection || row.collection === state.collection) && matches(row));
    status.textContent = entries.length + ' piezas · 300 en el álbum';
    const summary = node('div','','progress-list');
    for (const cabinet of cabinets) summary.append(progressLine(cabinet,collectible.filter(row => row.cabinet === cabinet)));
    gallery.append(summary);
    if (state.cabinet === 'Botánica') {
      const botanical = collectible.filter(row => row.botany);
      const summary = node('div','','progress-list botanical-summary');
      for (const [name,members] of collections) {
        if (members[0].botany) summary.append(progressLine(name,members));
      }
      gallery.append(node('p',score(botanical),'album-score'),summary);
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
    const entries = proposals.filter(row => matches(row) && (!state.origin || state.origin === origin(row)) &&
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
    ({inventory,equipment:team,materials,trade:commerce,album,museum:museumView,register})[state.section]();
  }

  function render() {
    controls.replaceChildren();
    if (state.section !== 'museum' || state.museum !== 'Fósiles') search();
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
    if (state.section === 'album') {
      select('cabinet','Gabinete',[['','Todos'],...cabinets.map(name => [name,name])]);
      const available = [...collections].filter(([,members]) => !state.cabinet || members[0].cabinet === state.cabinet);
      select('collection','Colección',[['','Todas'],...available.map(([name]) => [name,name])]);
      select('progress','Progreso de prueba',['0','25','50','75','100'].map(value => [value,value === '0' ? 'Sin descubrir · 0 %' : value + ' %']));
      if (state.cabinet === 'Botánica') {
        select('discoveryRarity','Rareza del descubrimiento',rarities.map(value => [value,value]));
        const trigger = button('Probar descubrimiento',demonstrateDiscovery);
        trigger.id = 'include-discover';
        trigger.setAttribute('aria-describedby','discovery-status');
        const availability = node('small');
        availability.id = 'discovery-status';
        availability.setAttribute('role','status');
        controls.append(trigger,availability);
      }
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
  sections[0].click();
})();
