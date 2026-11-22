'use strict';

function compareLegendary({ set, size: sizeControl }) {
  const groups = Object.entries(legendaryComparisons);
  if (groups.some(([id], index) => set.options[index]?.value !== id)) {
    selectOptions(set, groups.map(([id, group]) => [id, group.label]));
  }
  const size = Number(sizeControl.value);
  const keywords = normalize(byId('legendary-search').value).trim().split(/\s+/).filter(Boolean);
  const rows = legendaryComparisons[set.value].legendary.map(row => {
    const species = catalog.find(item => item.id === row.id);
    const current = species.records.find(record => record.key === row.plateKey);
    return { row, species, current };
  }).filter(({ row, species, current }) => {
    const haystack = normalize([current.label, species.name, species.latin, species.id, row.legendaryId, ...(row.aliases || [])].join(' '));
    return keywords.every(keyword => haystack.includes(keyword));
  });

  byId('summary').textContent = rows.length + ' de ' + legendaryComparisons.all.legendary.length + ' legendarios';
  if (!rows.length) return '<p class="note">Ningún legendario coincide con la búsqueda.</p>';

  return rows.map(({ row, species, current }) => {
    const variants = species.records.filter(record => ['normal', 'albino', 'melanico'].includes(record.key) && record.src);
    const plates = variants.map(record => figure(illustration(species, record, 'Normal', size), record.label));
    for (const archive of row.archives) {
      plates.push(figure(archivedIllustration(archive.files[size], current.label + ' · ' + archive.label, size), archive.label));
    }
    plates.push(figure(illustration(species, current, 'Normal', size), 'Legendario vigente'));
    return '<article class="gallery-card legendary-review" data-legendary="' + text(row.legendaryId) + '">' +
      '<h3>' + text(current.label + ' · ' + species.name) + '</h3><p class="latin">' + text(species.latin) +
      '</p><p class="note">' + text(row.origin) + (row.status === 'revisado' ? ' · Revisado' : '') +
      '</p><p>' + text(row.trait) + '</p><div class="comparison-styles review-comparison plate-comparison" style="--comparison-size:' +
      size + 'px">' + plates.join('') + '</div></article>';
  }).join('');
}
