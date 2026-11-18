/* Shared presentation for the game and the review lab. */
(function (root) {
  'use strict';
  const frames = Object.freeze({
    Normal: 'classic', Notable: 'notable', 'Épico': 'epic',
    Excepcional: 'exceptional', Legendario: 'legendary'
  });
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const script = typeof document === 'undefined' ? null : document.currentScript;
  const base = script ? new URL('../naturalist-art/plates/', script.src).href : '';

  function frame(markup, category = 'Normal', classes = '') {
    const style = Object.hasOwn(frames, category) ? frames[category] : 'classic';
    return '<span class="atlas-art-frame ' + style + (classes ? ' ' + escape(classes) : '') + '">' + markup + '</span>';
  }

  function render(id, { variant = 'normal', category = 'Normal', size = 128, eager = false } = {}, fallback) {
    const records = root.AtlasNaturalistAssets?.routes[id];
    const file = records && Object.hasOwn(records, variant) ? records[variant] : null;
    if (!file) return fallback();
    const resolution = [64, 128, 256, 512].includes(size) ? size : 128;
    const prefix = resolution === 512 ? '' : resolution + '/';
    return frame('<img class="atlas-art-image" alt="" width="' + resolution + '" height="' + resolution +
      '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async" src="' + escape(base + prefix + file) + '">', category);
  }

  const api = Object.freeze({ render, frame });
  root.AtlasNaturalistArt = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(globalThis);
