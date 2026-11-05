const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {sprites}=require('./helpers/sprites.cjs');
const source=fs.readFileSync('www/js/app.js','utf8');
const api=sprites();
const variant=source.slice(source.indexOf('function variantToSkin('),source.indexOf('function pushLog('));
const recolor=source.slice(source.indexOf('function enforceMelanicColors('),source.indexOf('function shade('));
const {variantToSkin,enforceMelanicColors}=vm.runInNewContext(variant+recolor+';({variantToSkin,enforceMelanicColors})');
const charcoal=new Set(['#626262','#393939','#181818','#383838','#292929','#1c1c1c','#101010']);
function assertPaint(svg,label){
 for(const tag of svg.match(/<[a-z][^>]*>/gi)||[]){
   for(const [,attr,color] of tag.matchAll(/\b(fill|stroke)="([^"]+)"/g)){
     if(color==='none'||color==='transparent')continue;
     if(color==='#d8c46b'){
       assert.match(tag,/^<circle\b/);assert.equal(attr,'fill');
       assert.ok(Number(tag.match(/\br="([^"]+)"/)[1])<=3,label+' eye size');
     }else assert.ok(charcoal.has(color),label+' escaped paint '+color);
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
 assert.doesNotMatch(out,/#f80|orange|rgb\(|rgba\(|hsl\(|fill:red|#ffaa00/);
 assert.match(out,/fill="none" stroke="transparent"/);
 assert.equal((out.match(/#d8c46b/g)||[]).length,1,'only eye keeps amber');
});
test('observed variant cards render the requested skin, including the red fox regression',()=>{
 const badges=source.slice(source.indexOf('function specialBadges('),source.indexOf('\nfunction ',source.indexOf('function specialBadges(')+1));
 const state={specialFound:Object.fromEntries(Object.entries(api.SPECIES).map(([id,sp])=>[id,Object.fromEntries(sp.special.map(v=>[v,true]))]))};
 const specialBadges=vm.runInNewContext(variant+badges+'\n;specialBadges',{SPECIES:api.SPECIES,state,getSpriteMarkup:api.getSpriteMarkup});
 for(const [id,sp] of Object.entries(api.SPECIES))for(const label of sp.special.filter(v=>/mel[aá]n/i.test(v)))assert.ok(specialBadges(id).includes(api.getSpriteMarkup(id,'melanico')),id);
 assert.ok(specialBadges('zorro_rojo').includes(api.getSpriteMarkup('zorro_rojo','melanico')));
 // Cuaderno renders the observed cards; Campo uses the same label conversion.
 assert.match(source,/specialBadges\(id\)/);
 assert.match(source,/getSpriteMarkup\(primary\.id,variantToSkin\(primary\.variant\)\)/);
});
