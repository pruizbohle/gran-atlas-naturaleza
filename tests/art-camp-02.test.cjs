'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
require('../www/art-camp-02/assets.js');
require('../www/js/mec02-camp.js');
require('../www/js/campamento-perfil-ui-v3430.js');
require('../www/js/mec02-camp-ui.js');

const art = globalThis.AtlasCampArt;
const rules = globalThis.AtlasCampMEC02;
const ui = globalThis.AtlasCampMEC02UI;
const camp = globalThis.AtlasCampProfile3430;

test('ART-CAMP-02 conserva las 25 ranuras MEC-02 y añade cinco etapas visuales', () => {
  assert.equal(Object.keys(art.entries).length,30);
  assert.deepEqual(art.zones.map(zone=>zone.id),['shipyard','caravan','workshop','excavations','surveys','central-camp']);
  for (const [id, reference] of Object.entries(rules.ART)) {
    const entry = art.entries[id];
    assert.equal(entry.sector,reference.facility,id);
    assert.equal(entry.level,reference.level,id);
    assert.equal(entry.name,rules.stageOf(entry.sector,entry.level).name,id);
  }
  assert.equal(rules.facility('central-camp'),null);
  const integrity = require('../www/atlas-integrity.json').files;
  for (const path of art.files) {
    assert.ok(fs.statSync('www/' + path).isFile(),path);
    assert.ok(integrity[path],path);
  }
});

test('ART-CAMP-02 muestra en el plano y la ficha la misma variante del nivel vigente', () => {
  const model = level => Object.fromEntries(rules.FACILITIES.map(f=>[f.id,{artLevel:level,kind:'ready',label:'Disponible'}]));
  for (let level = 1; level <= 5; level++) {
    const map = camp.camp(model(level),'');
    for (const f of rules.FACILITIES) {
      const entry = art.stage(f.id,level);
      const card = ui.card({id:f.id,artRef:entry.id,functions:[],art:'ICONO-DE-RESERVA'});
      if (entry.file) {
        for (const size of [384,768]) {
          assert.ok(map.includes(art.src(entry,size)),entry.id);
          assert.ok(card.includes(art.src(entry,size)),entry.id);
        }
      } else {
        assert.ok(card.includes('ICONO-DE-RESERVA'),entry.id);
      }
    }
    assert.ok(!/central-camp-[2-5]-/.test(map));
    assert.ok(map.includes('data-cp-shop'));
  }
});

test('ART-CAMP-02 permite una combinación mixta y restaura cada selector', () => {
  const vm = require('node:vm');
  const nodes = new Map();
  const create = tag => ({
    tag, children:[], events:{}, dataset:{}, attributes:{}, value:'1', style:{setProperty(key,value){this[key]=value;}},
    append(...items){this.children.push(...items);},
    replaceChildren(...items){this.children=items;},
    add(item){this.children.push(item);},
    addEventListener(name,fn){this.events[name]=fn;},
    setAttribute(name,value){this.attributes[name]=value;}
  });
  const document = {
    createElement:create,
    getElementById(id){
      if(!nodes.has(id))nodes.set(id,create(id));
      return nodes.get(id);
    }
  };
  function Option(text,value) { Object.assign(this,{text,value:String(value)}); }
  vm.runInNewContext(fs.readFileSync('www/art-camp-02/lab.js','utf8'),{document,Option,AtlasCampArt:art});
  const get = id => document.getElementById(id);
  assert.equal(get('matrix').children.flatMap(group=>group.children[1].children).length,30);
  get('map-tab').events.click();
  assert.equal(get('composition').hidden,false);
  const values = ['5','2','3','1','4','5'];
  const selects = get('levels').children.map(label=>label.children[0]);
  for(const [index,select] of selects.entries()){
    select.value=values[index];
    select.events.change();
  }
  assert.deepEqual(get('map').children.map(layer=>layer.dataset.ref),art.zones.map((z,i)=>z.id+'-'+values[i]));
  const mapLayers = [...get('map').children];
  for (const [index,select] of selects.entries()) {
    for (let level = 1; level <= 5; level++) {
      const before = mapLayers.map(layer=>layer.children[0]);
      select.value = String(level);
      select.events.change();
      assert.deepEqual(get('map').children,mapLayers);
      const entry = art.stage(art.zones[index].id,level);
      assert.equal(mapLayers[index].dataset.ref,entry.id);
      assert.equal(mapLayers[index].children[0].tag,entry.file?'img':'span');
      for (const [other,layer] of mapLayers.entries()) {
        if (other !== index) assert.equal(layer.children[0],before[other]);
      }
    }
  }
  get('viewport').events.change({target:{value:'mobile'}});
  assert.equal(get('map').dataset.viewport,'mobile');
  get('scale').events.input({target:{value:'150'}});
  assert.equal(get('map').style['--zoom'],1.5);
  get('reset').events.click();
  assert.ok(selects.every(select=>select.value==='1'));
  assert.deepEqual(get('map').children.map(layer=>layer.dataset.ref),art.zones.map(z=>z.id+'-1'));
});

test('ART-CAMP-03 mide y encaja las treinta etapas junto a cualquier nivel de los otros sectores', () => {
  const stages = Object.values(art.entries);
  const integrity = require('../www/atlas-integrity.json').files;
  assert.equal(art.backdrop.status,'definitivo');
  assert.ok(integrity['img/campamento-art-camp-03.webp']);
  const boxes = stages.map(entry=>{
    const zone = art.zones.find(item=>item.id===entry.sector);
    const measure = art.layout.measures[entry.id];
    const anchor = art.layout.zones[zone.id];
    const f = art.frame(zone,entry);
    assert.ok(entry.file && measure.label && measure.metres>0 && measure.pixels>0,entry.id);
    const pixelsPerMetre = f.width * art.layout.sceneWidth / 100 * measure.pixels / 384 / measure.metres;
    assert.ok(Math.abs(pixelsPerMetre-art.layout.pixelsPerMetre*anchor.depth)<.0001,entry.id);
    const b = art.footprint(zone,entry);
    assert.ok(b.left>=0 && b.top>=0 && b.right<=100 && b.bottom<=100,entry.id);
    assert.ok(b.right<=45 || b.left>=55,entry.id+' invade el camino');
    return {entry,b};
  });
  for (const [i,{entry,b}] of boxes.entries()) {
    for (const other of boxes.slice(i+1)) {
      if (entry.sector===other.entry.sector) continue;
      const c=other.b;
      assert.ok(b.right<=c.left || c.right<=b.left || b.bottom<=c.top || c.bottom<=b.top,entry.id+' vs. '+other.entry.id);
    }
  }
});
