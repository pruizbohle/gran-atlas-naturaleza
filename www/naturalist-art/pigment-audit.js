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
  let opened;

  const speciesById = new Map(catalog.map(sp => [sp.id, sp]));
  const history = new Map();
  for (const [lot, review] of Object.entries(artReviews)) {
    for (const item of review) {
      const key = item.id + '/' + item.variant;
      const versions = history.get(key) || [];
      versions.push({ ...item, lot: 'ART-' + lot.slice(-2) });
      history.set(key, versions);
    }
  }

  const rows = new Map(pigmentAuditRecords.map(item => {
    const sp = speciesById.get(item.id);
    const key = item.id + '/' + item.variant;
    const record = sp.records.find(plate => plate.key === item.variant);
    const normal = sp.records.find(plate => plate.key === 'normal');
    const versions = history.get(key) || [];
    const latest = versions.at(-1);
    const archives = new Map();
    for (const version of versions) {
      if (version.before) {
        const path = version.before[512];
        if (!archives.has(path)) archives.set(path, version);
      }
    }
    return [key, { ...item, key, sp, record, normal, latest, archives: [...archives.values()],
      corrected: Boolean(item.corrected),
      searchKey: normalize(sp.name + ' ' + sp.latin + ' ' + sp.id) }];
  }));

  const families = [...new Set([...rows.values()].map(row => row.sp.family))].sort(compareText);
  selectOptions(familyFilter, [['', 'Todas'], ...families.map(name => [name, name])]);

  function metadata(row) {
    const morph = row.latest?.morph
      ? row.latest.morph + ' · ' + row.latest.evidence
      : row.latest?.interpretation;
    return '<p class="latin">' + text(row.sp.latin) + '</p>' +
      '<p class="audit-taxonomy"><span>' + text(row.sp.family) + '</span><code>' + text(row.sp.id) + '</code></p>' +
      '<div class="audit-tags"><span>' + labels[row.variant] + '</span>' +
      '<span class="audit-state" data-state="' + text(row.state) + '">' + states[row.state] + '</span></div>' +
      (morph ? '<p class="audit-morph">' + text(morph) + '</p>' : '');
  }

  function comparison(row, size, expanded) {
    const alts = row.sp.name + ' · ' + row.record.label + ' · ';
    const versions = expanded ? row.archives : row.archives.slice(-1);
    const normal = illustration(row.sp, row.normal, 'Normal', size, expanded, 'plain', true);
    const current = illustration(row.sp, row.record, 'Normal', size, expanded, 'plain', true);
    const previous = versions.map(version => {
      const label = expanded ? 'Anterior a ' + version.lot : 'Anterior';
      return figure(archivedIllustration(version.before[size], alts + label, size), label);
    }).join('');
    return '<div class="audit-plates" style="--audit-size:' + size + 'px">' +
      figure(normal, 'Normal') + previous + figure(current, row.corrected ? 'Corregida' : 'Vigente') + '</div>';
  }

  function draw() {
    const term = normalize(query.value.trim());
    const matches = (flag, value) => !value || flag === (value === 'with');
    const result = [...rows.values()].filter(row =>
      row.searchKey.includes(term) && (!kind.value || row.variant === kind.value) &&
      (!state.value || row.state === state.value) && (!familyFilter.value || row.sp.family === familyFilter.value) &&
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
    byId('summary').textContent = result.length + ' de ' + rows.size + ' variantes';
    content.innerHTML = result.length ? '<div class="audit-gallery" data-audit-backdrop="' + backdrop.value + '">' +
      result.map(row => '<article class="audit-card" data-audit-key="' + text(row.key) + '" data-art-state="' +
        text(row.state) + '"><h3>' + text(row.sp.name) + '</h3>' + metadata(row) + comparison(row, 128, false) +
        '<button type="button" class="audit-open" data-audit-open="' + text(row.key) +
        '" aria-label="' + text((row.archives.length ? 'Abrir comparativa de ' : 'Ampliar ficha de ') + row.sp.name +
          ' · ' + row.record.label) + '">' + (row.archives.length ? 'Abrir comparativa' : 'Ampliar ficha') +
        '</button></article>').join('') + '</div>' : '<p>No se encontraron variantes con estos filtros.</p>';
  }

  function drawDetail() {
    const row = opened;
    detail.dataset.auditBackdrop = detailBackdrop.value;
    detail.innerHTML = metadata(row) + comparison(row, Number(detailSize.value), true) +
      (row.finding ? '<p class="audit-finding">' + text(row.finding) + '</p>' : '') +
      (row.latest?.eye ? '<p class="audit-finding">Iris representado · ' + text(row.latest.eye) + '</p>' : '');
  }

  controls.addEventListener('input', event => {
    if (event.target === backdrop) {
      const gallery = content.querySelector('.audit-gallery');
      if (gallery) gallery.dataset.auditBackdrop = backdrop.value;
    } else draw();
  });
  byId('audit-reset').addEventListener('click', () => {
    for (const field of [query, kind, state, familyFilter, correctedFilter, comparisonFilter]) field.value = '';
    order.value = 'family';
    backdrop.value = 'light';
    draw();
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
