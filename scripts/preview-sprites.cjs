// No dependencies. Open the generated HTML in any browser.
// node scripts/preview-sprites.cjs /tmp/atlas-sprites.html [previous-app.js]
const fs=require('node:fs');
const {sprites}=require('../tests/helpers/sprites.cjs');
const api=sprites();
const before=process.argv[3]?sprites(fs.readFileSync(process.argv[3],'utf8')):null;
const ids=Object.keys(api.SPECIES).filter(id=>api.polishedSpeciesSprite(id,'normal'));
const skins=['normal','albino','melanico','alfa'];
const title=skin=>({normal:'Normal',albino:'Albino / leucístico',melanico:'Melánico',alfa:'Notable'})[skin];
const card=(id,skin,sex)=>`<div class="cell">${[32,52,80].map(size=>`<span class="sprite" style="width:${size}px;height:${size}px">${api.getSpriteMarkup(id,skin,sex)}</span>`).join('')}</div>`;
const rows=ids.map(id=>`<article><h2>${api.SPECIES[id].name}</h2>${before?`<div class="cell before">${before.getSpriteMarkup(id)}</div>`:''}${skins.map(s=>card(id,s)).join('')}</article>`).join('');
const sexes=Object.keys(api.SEXUAL_DIMORPHISM).map(id=>`<article class="sex"><h2>${api.SPECIES[id].name}</h2>${card(id,'normal','male')}${card(id,'normal','female')}</article>`).join('');
const html=`<!doctype html><html lang="es"><meta charset="utf-8"><title>Gran Atlas Beta 3.6.1 · revisión de sprites</title><style>body{font:14px system-ui;background:#efe7d7;color:#342d25;margin:24px}h1{font-size:22px}p{max-width:850px}article,.labels{display:grid;grid-template-columns:180px ${before?'90px ':''}repeat(4,190px);gap:10px;align-items:center;border-bottom:1px solid #ccbea7;padding:8px 0}h2{font-size:14px}.cell{display:flex;align-items:center;justify-content:space-around;background:#e8dfc9;border-radius:8px;min-height:88px}.sprite{display:inline-block}.sprite svg{width:100%;height:100%}.before svg{width:80px;height:80px}.sex{grid-template-columns:180px 190px 190px}</style><h1>El Gran Atlas · Beta 3.6.1</h1><p>${ids.length} sprites revisados · Cada celda muestra 32, 52 y 80 px. Comparar silueta, rasgos, contraste y variantes en los tamaños de lista, móvil y Cuaderno.</p><div class="labels"><strong>Especie</strong>${before?'<strong>Antes</strong>':''}${skins.map(s=>`<strong>${title(s)}</strong>`).join('')}</div>${rows}<h1>Dimorfismo ya configurado · Macho / Hembra</h1>${sexes}</html>`;
fs.writeFileSync(process.argv[2]||'/tmp/atlas-sprites.html',html);
console.log(`${ids.length} sprites revisados; ${Object.keys(api.SPECIES).length} especies renderizables.`);
