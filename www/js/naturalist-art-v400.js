/* Shared presentation for the game and the review lab. */
(function (root) {
  'use strict';
  const categories = Object.freeze({
    Normal: 'classic', Notable: 'notable', 'Épico': 'epic',
    Excepcional: 'exceptional', Legendario: 'legendary'
  });
  const habitats = Object.freeze({
    bosque: 'bosque', selva: 'selva', sabana: 'sabana', pradera: 'pradera', estepa: 'pradera',
    mediterraneo: 'matorral', desierto: 'desierto', montana: 'montana', tundra: 'tundra',
    humedal: 'humedal', rio: 'rio', costa: 'costa', costa_marina: 'costa',
    archipielago: 'costa', arrecife: 'arrecife', oceano_abierto: 'oceano',
    plataforma_marina: 'oceano', mar_austral: 'oceano', columna_mesopelagica: 'profundidades',
    columna_batial: 'profundidades', columna_profunda_fria: 'profundidades', fondo_batial: 'profundidades',
    fondo_profundo_frio: 'profundidades', llanura_abisal_periferica: 'profundidades',
    hadal_marianas: 'profundidades', hadal_kermadec: 'profundidades', agua_polar: 'polar',
    banquisa_artica: 'polar', banquisa_antartica: 'polar', costa_antartica: 'polar', hielo_interior: 'polar'
  });
  const forestRegions = {
    taiga: new Set(['HX-01-11', 'HX-02-13', 'HX-03-14', 'HX-02-15', 'HX-03-16', 'HX-03-18',
      'HX-01-05', 'HX-02-03', 'HX-02-06', 'gm06_labrador', 'gm06_hudson']),
    selva: new Set(['HX-05-17', 'HX-06-17', 'HX-08-11', 'HX-08-08', 'HX-08-10', 'HX-09-14',
      'HX-04-03', 'HX-05-04', 'sa_amazonia', 'sa_andes_del_norte', 'oc_nueva_guinea',
      'oc_costa_nordeste_australiana', 'gm06_antillas', 'gm06_darien', 'gm06_sonda', 'gm06_wallacea', 'gm06_melanesia']),
    sabana: new Set(['HX-09-09', 'HX-09-12', 'HX-11-10', 'sa_llanos_del_orinoco', 'sa_cerrado_brasileno',
      'oc_norte_tropical_australiano'])
  };
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const script = typeof document === 'undefined' ? null : document.currentScript;
  const base = script ? new URL('../naturalist-art/', script.src).href : '';

  function landscapeKey(habitat, region) {
    if (habitat === 'bosque') {
      for (const [landscape, regions] of Object.entries(forestRegions)) {
        if (regions.has(region)) return landscape;
      }
    }
    return Object.hasOwn(habitats, habitat) ? habitats[habitat] : null;
  }

  function landscape(habitat, region, field = false) {
    const key = landscapeKey(habitat, region);
    if (!root.AtlasNaturalistAssets?.landscapes?.includes(key)) return '';
    return '<img class="atlas-art-landscape landscape-' + key + '" alt="" aria-hidden="true" loading="' +
      (field ? 'eager' : 'lazy') + '" decoding="async" src="' + escape(base + 'landscapes/' + key + '.webp') + '">';
  }

  function frame(markup, category = 'Normal', classes = '') {
    const style = Object.hasOwn(categories, category) ? categories[category] : 'classic';
    return '<span class="atlas-art-frame ' + style + (classes ? ' ' + escape(classes) : '') + '">' + markup + '</span>';
  }

  function preferredHabitat(values) {
    return values.find(habitat => landscapeKey(habitat)) || '';
  }

  function render(id, {
    variant = 'normal', category = 'Normal', size = 128, eager = false, alt = '',
    surface = 'plain', habitat = '', region, classes = ''
  } = {}, fallback) {
    const records = root.AtlasNaturalistAssets?.routes[id];
    const file = records && Object.hasOwn(records, variant) ? records[variant] : null;
    if (!file) return fallback();
    const resolution = [64, 128, 256, 512].includes(size) ? size : 128;
    const prefix = resolution === 512 ? '' : resolution + '/';
    const cutout = !!root.AtlasNaturalistAssets.cutouts?.[file];
    const scene = cutout && surface === 'bestiary'
      ? landscape(root.AtlasNaturalistAssets.bestiaryHabitats?.[id] || habitat, region) : '';
    const wrapper = ['atlas-art-' + surface, cutout ? 'atlas-art-cutout' : 'atlas-art-opaque', classes].filter(Boolean).join(' ');
    const image = '<img class="atlas-art-image" alt="' + escape(alt) + '" width="' + resolution + '" height="' + resolution +
      '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async" src="' + escape(base + 'plates/' + prefix + file) + '">';
    return frame(scene + image, category, wrapper);
  }

  const api = Object.freeze({ render, frame, landscape, landscapeKey, preferredHabitat });
  root.AtlasNaturalistArt = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(globalThis);
