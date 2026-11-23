/* The shared icon vocabulary is presentation-only. */
(function (root) {
  'use strict';

  const href = typeof document === 'undefined' || !document.currentScript?.src
    ? './iconoteca/arte/'
    : new URL('../iconoteca/arte/', document.currentScript.src).href;
  const tabs = Object.freeze({
    atlas: 'atlas', field: 'campo', journal: 'cuaderno', research: 'investigacion',
    society: 'sociedad', bestiary: 'bestiario', expeditions: 'campamento',
    objects: 'inventario', museum: 'museo', crown: 'corona'
  });
  const biomes = Object.freeze({
    bosque: 'bosque', selva: 'selva', montana: 'montana', pradera: 'pradera',
    desierto: 'desierto', humedal: 'humedal', rio: 'rio', costa: 'costa',
    estepa: 'estepa', mediterraneo: 'mediterraneo', sabana: 'sabana',
    tundra: 'polar', hielo: 'polar', agua_polar: 'polar', banquisa_artica: 'polar',
    banquisa_antartica: 'polar', costa_antartica: 'polar', hielo_interior: 'polar',
    costa_marina: 'costa', archipielago: 'costa', plataforma_marina: 'oceano',
    oceano_abierto: 'oceano', mar_austral: 'oceano', mar_abierto: 'oceano', arrecife: 'arrecife',
    columna_mesopelagica: 'profundo', columna_batial: 'profundo', columna_profunda_fria: 'profundo',
    fondo_batial: 'profundo', fondo_profundo_frio: 'profundo',
    llanura_abisal_periferica: 'hadal', hadal_marianas: 'hadal', hadal_kermadec: 'hadal'
  });
  const objects = Object.freeze({
    fossil_fragment: 'fossil_fragment', pressed_flower: 'pressed_flower',
    river_pebble: 'river_pebble', sounding_kit: 'sounding_kit',
    ancient_coin: 'ancient_coin', binoculars: 'binoculars', field_hat: 'field_hat',
    oceanic_quadrant: 'oceanic_quadrant', polished_lens: 'polished_lens', fossil_amber: 'fossil_amber',
    brass_compass: 'brass_compass',
    sturdy_pack: 'sturdy_pack',
    feather_cap: 'feather_cap',
    rain_hood: 'rain_hood',
    amulet: 'amulet',
    amber_charm: 'amber_charm',
    shell_necklace: 'shell_necklace',
    fossil_skull: 'fossil_skull',
    bone_short: 'bone_short',
    bone_long: 'bone_long',
    carnivore_skull: 'carnivore_skull',
    herbivore_skull: 'herbivore_skull',
    fossil_plate: 'fossil_plate',
    fossil_sail: 'fossil_sail',
    animal_trace: 'animal_trace',
    map_fragment: 'map_fragment',
    asia_map_piece: 'asia_map_piece',
    asia_map: 'asia_map',
    africa_map_piece: 'africa_map_piece',
    africa_map: 'africa_map',
    north_america_map_piece: 'north_america_map_piece',
    north_america_map: 'north_america_map',
    heron_feather: 'heron_feather',
    brass_shard: 'brass_shard',
    old_ink: 'old_ink',
    carved_wood: 'carved_wood',
    wolf_tooth: 'wolf_tooth',
    owl_feather: 'owl_feather',
    antler_fragment: 'antler_fragment',
    otter_whisker: 'otter_whisker',
    boar_tusk: 'boar_tusk',
    beaver_tail_scale: 'beaver_tail_scale',
    scholar_hat: 'scholar_hat',
    museum_medallion: 'museum_medallion',
    river_pearl: 'river_pearl',
    fossil_track: 'fossil_track',
    fossil_claw: 'fossil_claw',
    fossil_rib: 'fossil_rib',
    fossil_horn: 'fossil_horn',
    hard_bone: 'hard_bone',
    polar_coat: 'polar_coat',
    south_america_map_piece: 'south_america_map_piece',
    south_america_map: 'south_america_map',
    oceania_map_piece: 'oceania_map_piece',
    oceania_map: 'oceania_map',
    polar_map_piece: 'polar_map_piece',
    polar_map: 'polar_map',
    world_map: 'world_map',
    asian_spices: 'asian_spices',
    asian_trade_folio: 'asian_trade_folio',
    african_textile_sample: 'african_textile_sample',
    north_american_trade_document: 'north_american_trade_document',
    south_american_cacao: 'south_american_cacao',
    oceanian_nacre: 'oceanian_nacre',
    polar_geology_record: 'polar_geology_record'
  });
  const glyphs = Object.freeze({
    back: '<path d="m10 5-7 7 7 7M3 12h17"/>',
    search: '<circle cx="10" cy="10" r="5.5"/><path d="m14 14 6 6"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4-2v-4Z"/>',
    sort: '<path d="M4 5h11M4 10h8M4 15h5m8-4v9m-4-4 4 4 4-4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    more: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    zoom: '<circle cx="10" cy="10" r="5.5"/><path d="m14 14 6 6M7 10h6m-3-3v6"/>',
    backup: '<path d="M5 3h12l2 2v16H5ZM8 3v7h8V3M8 21v-7h8v7"/>',
    export: '<path d="M4 14v6h16v-6M12 16V4m-5 5 5-5 5 5"/>',
    import: '<path d="M4 14v6h16v-6M12 4v12m-5-5 5 5 5-5"/>',
    locked: '<rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v2"/>',
    ready: '<circle cx="8" cy="9" r="4"/><path d="m11 12 8 8m-4-4 2-2m0 4 2-2"/>',
    open: '<rect x="5" y="10" width="12" height="10" rx="2"/><path d="M7 10V7a4 4 0 0 1 8 0m-4 7v2"/>',
    visited: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/>',
    selected: '<circle cx="12" cy="12" r="7"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/>',
    special: '<path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z"/>',
    complete: '<path d="m5 12 5 5 9-10"/>'
  });
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function url(id) {
    return typeof id === 'string' && /^[a-z][a-z0-9_-]*$/.test(id) ? href + id + '.webp' : '';
  }
  function image(id, size = 32) {
    const src = url(id);
    return src ? `<img class="atlas-icon" src="${esc(src)}" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async">` : '';
  }
  function glyph(id) {
    return Object.hasOwn(glyphs, id)
      ? '<svg class="atlas-icon atlas-icon-line" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + glyphs[id] + '</svg>'
      : '';
  }
  root.AtlasIcons530 = Object.freeze({ image, glyph, url, tabs, biomes, objects });
  if (typeof document !== 'undefined') {
    for (const slot of document.querySelectorAll('[data-atlas-icon]')) {
      const id = slot.dataset.atlasIcon;
      slot.innerHTML = id.startsWith('glyph:') ? glyph(id.slice(6)) : image(id);
    }
  }
})(globalThis);
