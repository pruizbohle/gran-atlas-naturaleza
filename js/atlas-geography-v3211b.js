/* Cartographic cells are independent of saved region IDs. Pointy axial hexagons.
 * Geographic row masks are intentionally stylized; north is up. No game rules here.
 */
(function(root){
'use strict';
const radius=46,dx=Math.sqrt(3)*radius,dy=1.5*radius,padding=22;
const directions=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
const point=(q,r)=>({x:dx*(q+r/2),y:dy*r});
const vertices=(size=radius)=>Array.from({length:6},(_,i)=>{const a=(-90+i*60)*Math.PI/180;return [size*Math.cos(a),size*Math.sin(a)];});
const polygon=(size=radius)=>vertices(size).map(p=>p.join(',')).join(' ');
// Offset-row columns are converted once to axial coordinates; cells never derive from HX.
const masks={
 Europa:['3','0,3','2-4','1-3','2'],
 Asia:['2-5','1-5','0-5','0-4,6','1,3-4','2'],
 África:['0-3','0-4','1-4,6','1-3','1-3,5','2-3','2'],
 Norteamérica:['0-2','1-4','1-4','2-3','4']
};
// name, offset column, row, geographic rationale. These associations are visual only.
const anchors={
 Europa:[
 ['Islas Británicas',0,1,'Islas al noroeste de Francia, separadas del continente.'],
 ['Escandinavia',3,0,'Península septentrional, al norte de Europa central y del Báltico.'],
 ['Alpes',2,3,'Arco montañoso al norte de Italia y al sur de Europa central.'],
 ['Europa Occidental',2,2,'Francia y su entorno, al este de las islas y al norte de Iberia.'],
 ['Europa Central',3,2,'Al este de Francia, al norte de los Alpes y al oeste de Europa oriental.'],
 ['Península Ibérica',1,3,'Península suroccidental, al sur de Francia.'],
 ['Europa Oriental',4,2,'Llanuras orientales, al este de Europa central.'],
 ['Península Itálica',2,4,'Península mediterránea bajo los Alpes, al oeste de los Balcanes.'],
 ['Región del mar Báltico',3,1,'Cuenca al este de Escandinavia y al noreste de Europa central.'],
 ['Balcanes',3,3,'Sureste europeo, al este de Italia y al sur de Europa oriental.']
 ],
 Asia:[
 ['Cáucaso',0,2,'Entre mar Negro y Caspio, al noreste de Anatolia.'],
 ['Anatolia',0,3,'Extremo occidental de Asia, al oeste de Irán.'],
 ['Siberia Occidental',2,1,'Franja norte, al este de los Urales y al oeste de Siberia central.'],
 ['Siberia Central',3,1,'Franja norte entre Siberia occidental y oriental.'],
 ['Mongolia',2,2,'Franja de Mongolia al sur de Siberia y al oeste del Gobi y China.'],
 ['Montes Urales',1,1,'Borde occidental de Siberia, al noroeste de Asia central.'],
 ['Siberia Oriental',4,1,'Franja nororiental, al este de Siberia central.'],
 ['Kamchatka',5,1,'Península del Pacífico nororiental, al norte de Japón.'],
 ['Desierto de Gobi',3,2,'Franja del Gobi entre Mongolia y China septentrional, en la escala simplificada.'],
 ['Himalaya',3,4,'Al sur de Asia central y del Tíbet, al norte de India.'],
 ['Península Arábiga',1,4,'Península suroccidental, al sur de Mesopotamia.'],
 ['Mesopotamia',1,3,'Al sureste de Anatolia, al oeste de Irán y al norte de Arabia.'],
 ['Meseta de Irán',2,3,'Entre Mesopotamia y Asia central, al noroeste de India.'],
 ['Meseta del Tíbet',3,3,'Al norte del Himalaya y al oeste de China.'],
 ['Estepas de Asia Central',1,2,'Al sur de Siberia y al oeste de Mongolia.'],
 ['China Septentrional',4,2,'Al sur del Gobi y al oeste de Corea.'],
 ['Subcontinente Indio',2,5,'Proyección meridional al sur del Himalaya.'],
 ['China Meridional',4,3,'Al sur de China septentrional y al noreste del Sudeste Asiático.'],
 ['Península de Corea',5,2,'Costa oriental al este de China, al oeste de Japón.'],
 ['Sudeste Asiático',4,4,'Al sur de China y al este de India.'],
 ['Archipiélago Japonés',6,3,'Islas separadas al este de Corea y al sur de Kamchatka.']
 ],
 África:[
 ['Magreb',1,0,'Noroeste mediterráneo, al este de la celda del Atlas.'],
 ['Montañas del Atlas',0,0,'Cordillera del Magreb: celda propia en el extremo noroeste.'],
 ['Desierto del Sáhara',2,0,'Gran franja septentrional, al norte del Sahel y del Congo.'],
 ['Valle del Nilo',3,0,'Noreste africano, al norte de Etiopía y del África oriental.'],
 ['Sahel occidental',1,1,'Franja bajo el Sahara occidental y sobre los bosques occidentales.'],
 ['Sahel oriental',2,1,'Continuación oriental del Sahel, bajo el Sahara y al oeste de Etiopía.'],
 ['Bosques de África occidental',0,1,'Bosques atlánticos al oeste de la cuenca del Congo.'],
 ['Cuenca del Congo',2,2,'Centro ecuatorial, al sur del Sahel y al oeste de los Grandes Lagos.'],
 ['Bosques de Gabón',1,2,'Bosques atlánticos al oeste de la cuenca del Congo.'],
 ['Tierras altas de Etiopía',3,1,'Noreste elevado, al oeste del Cuerno de África.'],
 ['Cuerno de África',4,1,'Proyección oriental al océano Índico, al este de Etiopía.'],
 ['Sabana de África oriental',3,2,'África centro-oriental: celda propia junto a la cuenca del Congo.'],
 ['Grandes Lagos africanos',2,3,'África centro-oriental: celda propia junto a la cuenca del Congo.'],
 ['Lagos del Rift',4,2,'África centro-oriental: celda propia junto a la cuenca del Congo.'],
 ['Bosques de miombo',1,3,'Interior austral: posición aproximada, con una celda propia para esta región.'],
 ['Humedales de Bangweulu',3,4,'Interior austral: posición aproximada, con una celda propia para esta región.'],
 ['Delta del Okavango',2,4,'Interior austral: posición aproximada, con una celda propia para esta región.'],
 ['Kalahari y sabana austral',2,5,'Interior austral: posición aproximada, con una celda propia para esta región.'],
 ['Desierto del Namib',1,4,'Interior austral: posición aproximada, con una celda propia para esta región.'],
 ['Lowveld y Kruger',3,5,'Sureste africano, al este del interior austral.'],
 ['Costa de Mozambique',3,3,'Sureste africano, al este del interior austral.'],
 ['Costa del Cabo',2,6,'Extremo meridional, bajo el interior austral.'],
 ['Madagascar',5,4,'Isla del Índico separada del continente, frente al sureste africano.'],
 ['Islas Seychelles y Aldabra',6,2,'Islas del Índico separadas del continente y de Madagascar, al noreste.']
 ],
 Norteamérica:[
 ['Alaska',0,0,'Extremo noroccidental de Norteamérica.'],
 ['Columbia Británica',1,1,'Costa occidental canadiense, al sureste de Alaska.'],
 ['Bosques boreales de Canadá',2,0,'Celda original conservada; vínculo jugable AM-02.'],
 ['Montañas Rocosas',2,1,'Celda original conservada; vínculo jugable AM-02.'],
 ['Grandes Llanuras',3,1,'Celda original conservada; vínculo jugable AM-02.'],
 ['Yukón',1,0,'Celda original conservada; vínculo jugable AM-02.'],
 ['Región de los Grandes Lagos',4,1,'Celda original conservada; vínculo jugable AM-02.'],
 ['Costa del Pacífico',1,2,'Celda original conservada; vínculo jugable AM-02.'],
 ['Bosques del este norteamericano',4,2,'Celda original conservada; vínculo jugable AM-02.'],
 ['Desierto de Sonora',2,2,'Celda original conservada; vínculo jugable AM-02.'],
 ['Sierra Madre',2,3,'Celda original conservada; vínculo jugable AM-02.'],
 ['Península de Yucatán',3,3,'Celda original conservada; vínculo jugable AM-02.'],
 ['Costa del golfo de México',3,2,'Celda original conservada; vínculo jugable AM-02.'],
 ['América Central',4,4,'Celda original conservada; vínculo jugable AM-02.']
 ]
};
const northAmericanSourceCells=[{"name":"Alaska","sourceId":"HX-01-05","column":0,"row":0,"shortLabel":"Alaska"},{"name":"Columbia Británica","sourceId":"HX-02-02","column":1,"row":1,"shortLabel":"Columbia Británica"},{"name":"Bosques boreales de Canadá","sourceId":"HX-02-03","column":2,"row":0,"shortLabel":"Canadá boreal"},{"name":"Montañas Rocosas","sourceId":"HX-02-04","column":2,"row":1,"shortLabel":"Rocosas"},{"name":"Grandes Llanuras","sourceId":"HX-02-05","column":3,"row":1,"shortLabel":"Llanuras"},{"name":"Yukón","sourceId":"HX-02-06","column":1,"row":0,"shortLabel":"Yukón"},{"name":"Región de los Grandes Lagos","sourceId":"HX-03-02","column":4,"row":1,"shortLabel":"G. Lagos"},{"name":"Costa del Pacífico","sourceId":"HX-03-03","column":1,"row":2,"shortLabel":"Pacífico"},{"name":"Bosques del este norteamericano","sourceId":"HX-03-04","column":4,"row":2,"shortLabel":"Bosques este"},{"name":"Desierto de Sonora","sourceId":"HX-03-05","column":2,"row":2,"shortLabel":"Sonora"},{"name":"Sierra Madre","sourceId":"HX-04-02","column":2,"row":3,"shortLabel":"Sierra Madre"},{"name":"Península de Yucatán","sourceId":"HX-04-03","column":3,"row":3,"shortLabel":"Yucatán"},{"name":"Costa del golfo de México","sourceId":"HX-04-04","column":3,"row":2,"shortLabel":"Golfo México"},{"name":"América Central","sourceId":"HX-05-04","column":4,"row":4,"shortLabel":"A. Central"}];
function columns(row){return row.split(',').flatMap(part=>{const [a,b]=part.split('-').map(Number);return Array.from({length:(b??a)-a+1},(_,i)=>a+i);});}
function terrain(continent,c,r){if(continent==='África')return r<=2?'desierto':r<=3?'estepa':r<=5?'selva':r<=7?'sabana':'desierto';if(continent==='Asia')return r<2?'tundra':r<4?'bosque':r<7?'estepa':r>9?'selva':'montana';if(continent==='Norteamérica')return r<3?'tundra':r<6?'bosque':r<8?'pradera':'desierto';return r<3?'tundra':r>7?'mediterraneo':'bosque';}
function layout(continent,regions=[]){
 const rows=masks[continent]||[],bindings=anchors[continent]||[],index=new Map(),cells=[];
 rows.forEach((row,r)=>columns(row).forEach(c=>{const q=c-(r-(r&1))/2,p=point(q,r),cell={cellId:continent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')+'-'+c+'-'+r,continent,q,r,column:c,terrain:terrain(continent,c,r),regionIds:[],playable:false,kind:continent==='Norteamérica'||!anchors[continent]?'reserved':'cartographic',x:p.x+padding,y:p.y+padding};cells.push(cell);index.set(c+','+r,cell);}));
 const origin={x:cells.length?padding+dx/2-Math.min(...cells.map(c=>c.x)):0,y:cells.length?padding+radius-Math.min(...cells.map(c=>c.y)):0};for(const c of cells){c.x+=origin.x;c.y+=origin.y;}
 const positions={};for(const region of regions){const anchor=bindings.find(a=>a[0]===region.name);if(!anchor)throw Error('Missing geographic anchor: '+region.name);const [,c,r,reason]=anchor,cell=index.get(c+','+r);if(!cell)throw Error('Geographic anchor outside mask: '+region.name);cell.regionIds.push(region.id);cell.playable=true;cell.kind='playable';cell.terrain=region.habitats[0];positions[region.id]={cellId:cell.cellId,q:cell.q,r:cell.r,x:cell.x,y:cell.y,reason};}
 for(const cell of cells){if(!cell.playable&&continent==='Asia'){cell.kind='ice';cell.terrain='hielo';}if(continent==='Norteamérica'){const original=northAmericanSourceCells.find(s=>s.column===cell.column&&s.row===cell.r);if(!original)throw Error('North American source cell missing');cell.sourceId=original.sourceId;cell.label=original.name;cell.shortLabel=original.shortLabel;}}
 return {cells,positions,origin,board:{width:Math.max(0,...cells.map(c=>c.x))+dx/2+padding,height:Math.max(0,...cells.map(c=>c.y))+radius+padding},radius};
}
function audit(continent,regions=[]){const mesh=layout(continent,regions),index=new Map(mesh.cells.map(c=>[c.q+','+c.r,c])),pairs=[],edgeErrors=[];for(const cell of mesh.cells)for(const[dq,dr]of directions){const other=index.get((cell.q+dq)+','+(cell.r+dr));if(!other||other.cellId<=cell.cellId)continue;const distance=Math.hypot(cell.x-other.x,cell.y-other.y),error=Math.abs(distance-dx);const av=vertices().map(([x,y])=>[cell.x+x,cell.y+y]),bv=vertices().map(([x,y])=>[other.x+x,other.y+y]),distances=av.flatMap(a=>bv.map(b=>Math.hypot(a[0]-b[0],a[1]-b[1]))).sort((a,b)=>a-b),sharedVertices=av.filter(a=>bv.some(b=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8)).length,edgeError=distances[1];pairs.push({a:cell.cellId,b:other.cellId,distance,error,sharedVertices,edgeError});if(error>1e-8||edgeError>1e-8||sharedVertices!==2)edgeErrors.push({a:cell.cellId,b:other.cellId,error,edgeError,sharedVertices});}return {continent,cells:mesh.cells.length,playableCells:mesh.cells.filter(c=>c.playable).length,regions:regions.length,additionalCells:mesh.cells.filter(c=>!c.playable).length,groupedCells:mesh.cells.filter(c=>c.regionIds.length>1).length,groupedRegions:mesh.cells.filter(c=>c.regionIds.length>1).reduce((n,c)=>n+c.regionIds.length,0),radius,neighborDistance:dx,neighborPairs:pairs.length,maxError:Math.max(0,...pairs.map(p=>p.error)),maxEdgeError:Math.max(0,...pairs.map(p=>p.edgeError)),edgeErrors,pairs};}
const api=Object.freeze({radius,dx,dy,directions,point,vertices,polygon,layout,audit,anchors,northAmericanSourceCells});root.AtlasGeography=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
