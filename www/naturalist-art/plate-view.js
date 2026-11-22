'use strict';

const plateViewBase = new URL('./', document.currentScript.src);
const plateReference = source => new URL(source, plateViewBase).href;
const byId = id => document.getElementById(id);

const text = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function illustration(sp, record, frame = 'Normal', resolution = 512, eager = false, surface = 'plain', fullSize = false) {
  const habitat = AtlasNaturalistArt.preferredHabitat(sp.habitats);
  return AtlasNaturalistArt.render(sp.id, {
    variant: record.key, category: frame, size: resolution, eager, alt: sp.name + ' · ' + record.label,
    surface, habitat, region: sp.regions[0]?.id, classes: 'plate', fullSize
  }, () => AtlasNaturalistArt.frame('<span>Lámina pendiente</span>', frame, 'plate'));
}

function figure(markup, caption) {
  return '<figure>' + markup + '<figcaption>' + text(caption) + '</figcaption></figure>';
}

function archivedIllustration(src, label, size) {
  return AtlasNaturalistArt.frame(
    '<img class="atlas-art-image" src="' + text(plateReference(src)) + '" width="' + size + '" height="' + size +
    '" alt="' + text(label) + '" loading="lazy" decoding="async">',
    'Normal', 'plate atlas-art-cutout');
}

function selectOptions(select, entries) {
  const selected = select.value;
  select.replaceChildren(...entries.map(([key, label]) => new Option(label, key)));
  if (entries.some(([key]) => selected === key)) select.value = selected;
}
