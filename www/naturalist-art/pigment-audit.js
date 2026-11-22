'use strict';

function createPigmentAudit() {
  const states = { correcta: 'Correcta', mejorable: 'Mejorable', insuficiente: 'Insuficiente', pendiente: 'Pendiente' };
  const byState = Object.keys(states);
  const byPriority = ['insuficiente', 'mejorable', 'pendiente', 'correcta'];
  const labels = { albino: 'Albina', melanico: 'Melánica' };
  const compareText = (a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' });
  const controls = byId('pigment-audit-filters');
  const dialog = byId('pigment-audit-detail');
  const detail = byId('audit-detail-content');
  const [query, kind, state, familyFilter, correctedFilter, comparisonFilter, order, backdrop] =
    ['search', 'kind', 'state', 'family', 'corrected', 'comparison', 'sort', 'backdrop'].map(name => byId('audit-' + name));
  const detailSize = byId('audit-detail-size');
  const detailBackdrop = byId('audit-detail-backdrop');
  const pageSize = byId('audit-page-size');
  const pagination = Array.from(document.querySelectorAll('[data-audit-page]'));
  const batches = Array.from(document.querySelectorAll('[data-audit-batch]'));
  let batch = new URLSearchParams(location.search).get('lote');
  if (!['A', 'B'].includes(batch)) batch = '';
  let page = 1;
  let totalPages = 1;
  let opened;

  const speciesById = new Map(catalog.map(sp => [sp.id, sp]));
  const reviewHistory = new Map();
  for (const [lot, review] of Object.entries(artReviews)) {
    for (const item of review) {
      const key = item.id + '/' + item.variant;
      const versions = reviewHistory.get(key) || [];
      versions.push({ ...item, lot: 'ART-' + lot.slice(-2) });
      reviewHistory.set(key, versions);
    }
  }

  const rows = new Map(pigmentAuditRecords.map(item => {
    const sp = speciesById.get(item.id);
    const key = item.id + '/' + item.variant;
    const record = sp.records.find(plate => plate.key === item.variant);
    const normal = sp.records.find(plate => plate.key === 'normal');
    const versions = reviewHistory.get(key) || [];
    const latest = versions.at(-1);
    const archives = new Map();
    for (const version of versions) {
      if (version.before) {
        const path = version.before[512];
        if (!archives.has(path)) archives.set(path, version);
      }
    }
    return [key, { ...item, key, sp, record, normal, latest, archives: [...archives.values()],
      batch: versions.find(item => item.lot === 'ART-08')?.batch,
      corrected: Boolean(item.corrected),
      searchKey: normalize(sp.name + ' ' + sp.latin + ' ' + sp.id) }];
  }));

  const totalAnimals = new Set(pigmentAuditRecords.map(row => row.id)).size;
  const families = [...new Set([...rows.values()].map(row => row.sp.family))].sort(compareText);
  selectOptions(familyFilter, [['', 'Todas'], ...families.map(name => [name, name])]);

  function metadata(row) {
    const morph = row.latest?.morph
      ? row.latest.morph + ' · ' + row.latest.evidence
      : row.latest?.interpretation;
    return '<div class="audit-tags"><span>' + labels[row.variant] + '</span>' +
      '<span class="audit-state" data-state="' + text(row.state) + '">' + states[row.state] + '</span></div>' +
      (morph ? '<p class="audit-morph">' + text(morph) + '</p>' : '');
  }

  function comparison(row, size, expanded) {
    const alts = row.sp.name + ' · ' + row.record.label + ' · ';
    const versions = expanded ? row.archives : row.archives.slice(-1);
    const normal = illustration(row.sp, row.normal, 'Normal', size, expanded, 'plain', true);
    const current = illustration(row.sp, row.record, 'Normal', size, expanded, 'plain', true);
    const previous = versions.map(version => {
      const label = version.previousLabel ? version.previousLabel + ' · variante retirada'
        : expanded ? 'Anterior a ' + version.lot : 'Anterior';
      return figure(archivedIllustration(version.before[size], alts + label, size), label);
    }).join('');
    return '<div class="audit-plates" style="--audit-size:' + size + 'px">' +
      figure(normal, 'Normal') + previous + figure(current, row.corrected ? 'Corregida' : 'Vigente') + '</div>';
  }

  function specimen(variantRows) {
    const [{ sp, normal }] = variantRows;
    const size = 128;
    const firstPlate = figure(illustration(sp, normal, 'Normal', size, false, 'plain', true), 'Normal');
    const variants = variantRows.map(row => '<div class="audit-variant" data-audit-key="' + text(row.key) +
      '" data-art-state="' + text(row.state) + '">' + figure(
        illustration(sp, row.record, 'Normal', size, false, 'plain', true),
        row.corrected ? labels[row.variant] + ' · Corregida' : labels[row.variant]) +
      metadata(row) +
      '<button type="button" class="audit-open" data-audit-open="' + text(row.key) + '" aria-label="' +
      text('Abrir ficha de ' + sp.name + ' · ' + row.record.label) + '">' +
      (row.archives.length ? 'Ver comparativa' : 'Ampliar ficha') + '</button></div>').join('');
    return '<article class="audit-card" data-audit-species="' + text(sp.id) + '"><h3>' + text(sp.name) + '</h3>' +
      '<p class="latin">' + text(sp.latin) + '</p><p class="audit-taxonomy"><span>' + text(sp.family) +
      '</span><code>' + text(sp.id) + '</code></p>' +
      '<div class="audit-plates audit-specimens" style="--audit-size:' + size + 'px">' +
      '<div>' + firstPlate + '</div>' + variants + '</div></article>';
  }

  function draw() {
    const term = normalize(query.value.trim());
    const matches = (flag, value) => !value || flag === (value === 'with');
    const result = [...rows.values()].filter(row =>
      row.searchKey.includes(term) && (!batch || row.batch === batch) &&
      (!kind.value || row.variant === kind.value) && (!state.value || row.state === state.value) && (!familyFilter.value || row.sp.family === familyFilter.value) &&
      matches(row.corrected, correctedFilter.value) && matches(row.archives.length > 0, comparisonFilter.value));

    const byName = (a, b) => compareText(a.sp.name, b.sp.name) || compareText(a.key, b.key);
    const sorting = {
      family: (a, b) => compareText(a.sp.family, b.sp.family) || byName(a, b),
      name: byName,
      state: (a, b) => byState.indexOf(a.state) - byState.indexOf(b.state) || byName(a, b),
      priority: (a, b) => byPriority.indexOf(a.state) - byPriority.indexOf(b.state) ||
        Number(Boolean(b.priority)) - Number(Boolean(a.priority)) || byName(a, b)
    };
    result.sort(sorting[order.value]);
    const groups = new Map();
    for (const row of result) {
      if (!groups.has(row.id)) groups.set(row.id, []);
      groups.get(row.id).push(row);
    }
    const limit = Number(pageSize.value);
    const animals = [...groups.values()];
    totalPages = Math.max(1, Math.ceil(animals.length / limit));
    page = Math.min(page, totalPages);
    const first = (page - 1) * limit;
    const matching = animals.slice(first, first + limit);
    const summary = byId('summary');
    summary.dataset.animals = animals.length;
    summary.dataset.variants = result.length;
    summary.textContent = animals.length + ' de ' + totalAnimals + ' animales · ' +
      result.length + ' de ' + rows.size + ' variantes';
    const status = animals.length ? 'Página ' + page + ' de ' + totalPages : 'Sin resultados';
    byId('audit-page-status').textContent = status;
    byId('audit-page-status-bottom').textContent = status;
    byId('audit-navigation-bottom').hidden = totalPages <= 1;
    for (const button of pagination) button.disabled = Number(button.dataset.auditPage) < 0 ? page === 1 : page === totalPages;
    for (const link of batches) {
      if (link.dataset.auditBatch === batch) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    content.innerHTML = matching.length ? '<div class="audit-gallery" data-audit-backdrop="' +
      backdrop.value + '">' + matching.map(specimen).join('') + '</div>' : '<p>No se encontraron variantes con estos filtros.</p>';
  }

  function drawDetail() {
    const row = opened;
    detail.dataset.auditBackdrop = detailBackdrop.value;
    detail.innerHTML = metadata(row) + comparison(row, Number(detailSize.value), true) +
      (row.finding ? '<p class="audit-finding">' + text(row.finding) + '</p>' : '') +
      (row.latest?.eye ? '<p class="audit-finding">Iris representado · ' + text(row.latest.eye) + '</p>' : '') +
      (row.latest?.comparison ? '<p class="audit-finding"><a href="' + text(plateReference(row.latest.comparison)) +
        '" target="_blank" rel="noopener">Abrir candidatos archivados · ART-08' + text(row.latest.batch) + '</a></p>' : '');
  }

  controls.addEventListener('input', event => {
    if (event.target === backdrop) {
      const gallery = content.querySelector('.audit-gallery');
      if (gallery) gallery.dataset.auditBackdrop = backdrop.value;
    } else {
      page = 1;
      draw();
    }
  });
  for (const button of pagination) button.addEventListener('click', () => {
    page += Number(button.dataset.auditPage);
    draw();
    const active = pagination.find(control => !control.disabled && control.closest('#audit-navigation'));
    active?.focus({ preventScroll: true });
    byId('audit-navigation').scrollIntoView({ block: 'start' });
  });
  for (const link of batches) link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    batch = link.dataset.auditBatch;
    history.replaceState(null, '', link.href);
    reset();
  });
  function reset() {
    for (const field of [query, kind, state, familyFilter, correctedFilter, comparisonFilter]) field.value = '';
    order.value = 'family';
    backdrop.value = 'light';
    page = 1;
    draw();
  }
  byId('audit-reset').addEventListener('click', () => {
    reset();
    query.focus();
  });
  content.addEventListener('click', event => {
    const button = event.target.closest('[data-audit-open]');
    if (!button) return;
    opened = rows.get(button.dataset.auditOpen);
    byId('audit-detail-title').textContent = opened.sp.name + ' · ' + opened.record.label;
    detailBackdrop.value = backdrop.value;
    drawDetail();
    dialog.showModal();
  });
  detailSize.addEventListener('change', drawDetail);
  detailBackdrop.addEventListener('change', () => { detail.dataset.auditBackdrop = detailBackdrop.value; });
  dialog.addEventListener('close', () => {
    opened = null;
    detail.replaceChildren();
  });
  return { draw };
}
