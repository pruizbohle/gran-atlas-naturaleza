const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {sprites}=require('./helpers/sprites.cjs');
const source=require('./helpers/legacy-source.cjs').withoutOceania3290(fs.readFileSync('www/js/app.js','utf8'));
const api=sprites();
const variant=source.slice(source.indexOf('function variantToSkin('),source.indexOf('function pushLog('));
const recolor=source.slice(source.indexOf('function enforcePaleColors('),source.indexOf('function shade('));
const {variantToSkin,enforceMelanicColors}=vm.runInNewContext(variant+recolor+';({variantToSkin,enforceMelanicColors})');
const charcoal=color=>{const c=/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i.test(color)?[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)):(color.match(/^rgba?\(([^)]+)\)/)||[])[1]?.split(',').slice(0,3).map(Number);if(!c)return false;return Math.max(...c)<=153&&Math.max(...c)-Math.min(...c)<=30;};
function assertPaint(svg,label){
 for(const tag of svg.match(/<[a-z][^>]*>/gi)||[]){
   for(const [,attr,color] of tag.matchAll(/\b(fill|stroke)="([^"]+)"/g)){
     if(color==='none'||color==='transparent')continue;
     if(color==='#c3ac71'){
       assert.match(tag,/^<circle\b/);assert.equal(attr,'fill');
       assert.ok(Number(tag.match(/\br="([^"]+)"/)[1])<=3,label+' eye size');
     }else assert.ok(charcoal(color),label+' escaped paint '+color);
   }
 }
}
test('accented labels resolve to the melanic skin for every configured species',()=>{
 for(const label of ['Melánico','Melánica','melánico','MELÁNICA','melanico','melanica'])assert.equal(variantToSkin(label),'melanico',label);
 for(const [id,sp] of Object.entries(api.SPECIES)){
   for(const label of sp.special.filter(v=>/mel[aá]n/i.test(v))){
     assert.equal(variantToSkin(label),'melanico',id);
     const svg=api.getSpriteMarkup(id,variantToSkin(label));
     assert.notEqual(svg,api.getSpriteMarkup(id),id+' must not use normal skin');
     assertPaint(svg,id);
   }
 }
 assert.equal(variantToSkin('Leucístico'),'albino');
 assert.equal(variantToSkin('Notable'),'alfa');
});
test('all species remain charcoal regardless of sex argument or cached normal sprite',()=>{
 for(const id of Object.keys(api.SPECIES)){
   api.getSpriteMarkup(id,'normal');
   for(const sex of [null,'male','female'])assertPaint(api.getSpriteMarkup(id,'melanico',sex),id);
 }
});
test('literal SVG paints and inline styles cannot retain species colors',()=>{
 const svg=`<svg><path fill='#f80' stroke="orange"/><path fill="rgb(255, 80, 0)" stroke="rgba(255,0,0,.5)"/><path fill="hsl(30,100%,50%)" style="fill:red;stroke:#ffaa00"/><path fill="none" stroke="transparent"/><circle r="9" fill="#d8c46b"/><circle r="2" fill="#d8c46b"/></svg>`;
 const out=enforceMelanicColors(svg);
 assert.doesNotMatch(out,/#f80|orange|hsl\(|fill:red|#ffaa00|rgba\(255/);
 assert.match(out,/rgba\([^)]*,0?\.5\)/,'alpha retained');
 assert.match(out,/fill="none" stroke="transparent"/);
 assert.equal((out.match(/#c3ac71/g)||[]).length,1,'only eye keeps amber');
});
test('observed variant cards render the requested skin, including the red fox regression',()=>{
 const badges=source.slice(source.indexOf('function specialBadges('),source.indexOf('\nfunction ',source.indexOf('function specialBadges(')+1));
 const state={specialFound:Object.fromEntries(Object.entries(api.SPECIES).map(([id,sp])=>[id,Object.fromEntries(sp.special.map(v=>[v,true]))]))};
 const specialBadges=vm.runInNewContext(source.slice(source.indexOf('function specialVariantName('),source.indexOf('function normalizeSpecialDiscoveries('))+variant+badges+'\n;specialBadges',{SPECIES:api.SPECIES,state,getSpriteMarkup:api.getSpriteMarkup});
 for(const [id,sp] of Object.entries(api.SPECIES))for(const label of sp.special.filter(v=>/mel[aá]n/i.test(v)))assert.ok(specialBadges(id).includes(api.getSpriteMarkup(id,'melanico')),id);
 assert.ok(specialBadges('zorro_rojo').includes(api.getSpriteMarkup('zorro_rojo','melanico')));
 // Cuaderno renders the observed cards; Campo uses the same label conversion.
 assert.match(source,/specialBadges\(id\)/);
 assert.match(source,/specimenMarkup\(primary\.id,primary\.variant,primary\.category\)/);
});
