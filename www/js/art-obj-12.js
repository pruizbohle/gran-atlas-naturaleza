/* ART-OBJ-12 · Resolución de ilustraciones por ID. */
(function (root) {
  'use strict';
  const files = root.AtlasObjectArtAssets;
  const script = root.document?.currentScript?.src;
  const base = script ? new URL('../', script).href : './';

  function src(id, size = 64) {
    const path = Object.hasOwn(files, id) && files[id][size];
    return path ? base + path : '';
  }

  function image(id, size = 64) {
    const url = src(id, size);
    if (!url) return '';
    const retina = src(id, size * 2);
    const srcset = retina ? ' srcset="' + url + ' 1x, ' + retina + ' 2x"' : '';
    return '<img class="atlas-object-art" data-object-art="' + id + '" src="' + url + '"' + srcset +
      ' width="' + size + '" height="' + size + '" alt="" loading="lazy" decoding="async">';
  }

  root.AtlasObjectArt = Object.freeze({src, image});
})(globalThis);
