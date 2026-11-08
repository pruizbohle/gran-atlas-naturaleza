/* Cartographic cells are independent of saved region IDs. Pointy axial hexagons.
 * Geographic row masks are intentionally stylized; north is up. No game rules here.
 */
(function(root){
'use strict';
const radius=46,dx=Math.sqrt(3)*radius,dy=1.5*radius,padding=62;
const directions=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
const point=(q,r)=>({x:dx*(q+r/2),y:dy*r});
const vertices=(size=radius)=>Array.from({length:6},(_,i)=>{const a=(-90+i*60)*Math.PI/180;return [size*Math.cos(a),size*Math.sin(a)];});
const polygon=(size=radius)=>vertices(size).map(p=>p.join(',')).join(' ');
// Offset-row columns are converted once to axial coordinates; cells never derive from HX.
const masks={
 Europa:['10-11','9-11','8-11,13-15','8-15','5,9-16','3,5,8-16','3,7-16','6-16','5-7,9-11,13-15','5-7,10-11,14','11-12'],
 Asia:['4-13','3-15','2-17','2-17','1-16,18','0-15,18','0-15','1-4,6-15,17','1-3,6-10,12-14,17','2-3,7-8,11-13,16','7,12,15','11-12,14-15','11,13-16'],
 África:['2-7','1-8','0-8','0-8','1-10','2-7,9','3-7,11','3-6,9','3-6,9','3-5,8','4'],
 Norteamérica:['4-10,14-15','0-10,14-16','0-12,14-15','1-12,14','3-12','4-12','5-12','6-12','6-11,13','6,8-10,13','7,9-11','11-12','12-13'],
 // Reserved templates make future binding possible without inventing playable regions.
 Sudamérica:['2-5','1-6','1-7','2-7','2-6','3-6','3-5','3-4','3-4','3','3'],
 Oceanía:['1-3','0-4','0-5,8','1-4,8','3,7'],
 Polos:['2-5','1-6','0-7','1-6','2-5']
};
// name, offset column, row, geographic rationale. These associations are visual only.
const anchors={
 Europa:[
 ['Islas Británicas',5,4,'Islas al noroeste de Francia, separadas del continente.'],
 ['Escandinavia',10,2,'Península septentrional, al norte de Europa central y del Báltico.'],
 ['Alpes',10,7,'Arco montañoso al norte de Italia y al sur de Europa central.'],
 ['Europa Occidental',8,6,'Francia y su entorno, al este de las islas y al norte de Iberia.'],
 ['Europa Central',11,6,'Al este de Francia, al norte de los Alpes y al oeste de Europa oriental.'],
 ['Península Ibérica',6,8,'Península suroccidental, al sur de Francia.'],
 ['Europa Oriental',15,6,'Llanuras orientales, al este de Europa central.'],
 ['Península Itálica',10,8,'Península mediterránea bajo los Alpes, al oeste de los Balcanes.'],
 ['Región del mar Báltico',12,4,'Cuenca al este de Escandinavia y al noreste de Europa central.'],
 ['Balcanes',13,8,'Sureste europeo, al este de Italia y al sur de Europa oriental.']
 ],
 Asia:[
 ['Cáucaso',2,5,'Entre mar Negro y Caspio, al noreste de Anatolia.'],
 ['Anatolia',1,6,'Extremo occidental de Asia, al oeste de Irán.'],
 ['Siberia Occidental',6,2,'Franja norte, al este de los Urales y al oeste de Siberia central.'],
 ['Siberia Central',10,2,'Franja norte entre Siberia occidental y oriental.'],
 ['Mongolia',11,4,'Al sur de Siberia central y al norte del Gobi y China.'],
 ['Montes Urales',3,3,'Borde occidental de Siberia, al noroeste de Asia central.'],
 ['Siberia Oriental',14,2,'Franja nororiental, al este de Siberia central.'],
 ['Kamchatka',18,4,'Península del Pacífico nororiental, al norte de Japón.'],
 ['Desierto de Gobi',11,5,'Al sur de Mongolia y al norte de China.'],
 ['Himalaya',8,7,'Al sur de Asia central y del Tíbet, al norte de India.'],
 ['Península Arábiga',2,9,'Península suroccidental, al sur de Mesopotamia.'],
 ['Mesopotamia',2,7,'Al sureste de Anatolia, al oeste de Irán y al norte de Arabia.'],
 ['Meseta de Irán',4,7,'Entre Mesopotamia y Asia central, al noroeste de India.'],
 ['Meseta del Tíbet',9,6,'Al norte del Himalaya y al oeste de China.'],
 ['Estepas de Asia Central',7,5,'Al sur de Siberia y al oeste de Mongolia.'],
 ['China Septentrional',13,6,'Al sur del Gobi y al oeste de Corea.'],
 ['Subcontinente Indio',7,9,'Proyección meridional al sur del Himalaya.'],
 ['China Meridional',13,8,'Al sur de China septentrional y al noreste del Sudeste Asiático.'],
 ['Península de Corea',15,6,'Costa oriental al este de China, al oeste de Japón.'],
 ['Sudeste Asiático',12,10,'Al sur de China y al este de India.'],
 ['Archipiélago Japonés',17,7,'Islas separadas al este de Corea y al sur de Kamchatka.']
 ],
 África:[
 ['Magreb',2,0,'Noroeste mediterráneo; comparte sector con la cordillera del Atlas.'],
 ['Montañas del Atlas',2,0,'Cordillera del Magreb; sector compartido sin fusionar regiones.'],
 ['Desierto del Sáhara',4,2,'Gran franja septentrional, al norte del Sahel y del Congo.'],
 ['Valle del Nilo',7,1,'Noreste africano, al norte de Etiopía y del África oriental.'],
 ['Sahel occidental',2,3,'Franja bajo el Sahara occidental y sobre los bosques occidentales.'],
 ['Sahel oriental',6,3,'Continuación oriental del Sahel, bajo el Sahara y al oeste de Etiopía.'],
 ['Bosques de África occidental',1,4,'Costa ecuatorial occidental, al sur del Sahel occidental.'],
 ['Cuenca del Congo',4,5,'Centro ecuatorial, al sur del Sahel y al oeste de los Grandes Lagos.'],
 ['Bosques de Gabón',2,5,'Costa atlántica ecuatorial, al oeste de la cuenca del Congo.'],
 ['Tierras altas de Etiopía',8,3,'Noreste elevado, al oeste del Cuerno de África.'],
 ['Cuerno de África',10,4,'Proyección oriental al océano Índico, al este de Etiopía.'],
 ['Sabana de África oriental',7,5,'Al sur de Etiopía y al este de la cuenca del Congo.'],
 ['Grandes Lagos africanos',6,6,'África centro-oriental; sector compartido con los lagos del Rift.'],
 ['Lagos del Rift',6,6,'Cadena lacustre del África oriental; sin fusionar datos con Grandes Lagos.'],
 ['Bosques de miombo',4,6,'Bosques al sur del Congo, al oeste de los lagos orientales.'],
 ['Humedales de Bangweulu',5,7,'Zambia, al sur de los Grandes Lagos y al noreste del Okavango.'],
 ['Delta del Okavango',4,7,'Botsuana septentrional, al norte del Kalahari y al este de Namibia.'],
 ['Kalahari y sabana austral',4,8,'Interior austral, al este del Namib y al norte del Cabo.'],
 ['Desierto del Namib',3,9,'Franja atlántica del suroeste, al oeste del Kalahari.'],
 ['Lowveld y Kruger',5,9,'Sureste austral, al este del Kalahari y al norte del Cabo.'],
 ['Costa de Mozambique',6,8,'Costa del Índico al este de Bangweulu y del interior austral.'],
 ['Costa del Cabo',4,10,'Extremo meridional, bajo el interior austral.'],
 ['Madagascar',9,8,'Isla separada frente al sureste africano.'],
 ['Islas Seychelles y Aldabra',11,6,'Islas del Índico al noreste de Madagascar, separadas del continente.']
 ],
 Norteamérica:[
 ['Alaska',1,2,'Extremo noroccidental de Norteamérica.'],
 ['Columbia Británica',4,4,'Costa occidental canadiense, al sureste de Alaska.']
 ]
};
function columns(row){return row.split(',').flatMap(part=>{const [a,b]=part.split('-').map(Number);return Array.from({length:(b??a)-a+1},(_,i)=>a+i);});}
function terrain(continent,c,r){if(continent==='África')return r<=2?'desierto':r<=3?'estepa':r<=5?'selva':r<=7?'sabana':'desierto';if(continent==='Asia')return r<2?'tundra':r<4?'bosque':r<7?'estepa':r>9?'selva':'montana';if(continent==='Norteamérica')return r<3?'tundra':r<6?'bosque':r<8?'pradera':'desierto';return r<3?'tundra':r>7?'mediterraneo':'bosque';}
function layout(continent,regions=[]){
 const rows=masks[continent]||[],bindings=anchors[continent]||[],index=new Map(),cells=[];
 rows.forEach((row,r)=>columns(row).forEach(c=>{const q=c-(r-(r&1))/2,p=point(q,r),cell={cellId:continent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')+'-'+c+'-'+r,continent,q,r,column:c,terrain:terrain(continent,c,r),regionIds:[],playable:false,kind:continent==='Norteamérica'||!anchors[continent]?'reserved':'cartographic',x:p.x+padding,y:p.y+padding};cells.push(cell);index.set(c+','+r,cell);}));
 const origin={x:cells.length?padding+dx/2-Math.min(...cells.map(c=>c.x)):0,y:cells.length?padding+radius-Math.min(...cells.map(c=>c.y)):0};for(const c of cells){c.x+=origin.x;c.y+=origin.y;}
 const positions={};for(const region of regions){const anchor=bindings.find(a=>a[0]===region.name);if(!anchor)throw Error('Missing geographic anchor: '+region.name);const [,c,r,reason]=anchor,cell=index.get(c+','+r);if(!cell)throw Error('Geographic anchor outside mask: '+region.name);cell.regionIds.push(region.id);cell.playable=true;cell.kind='playable';cell.terrain=region.habitats[0];positions[region.id]={cellId:cell.cellId,q:cell.q,r:cell.r,x:cell.x,y:cell.y,reason};}
 return {cells,positions,origin,board:{width:Math.max(0,...cells.map(c=>c.x))+dx/2+padding,height:Math.max(0,...cells.map(c=>c.y))+radius+padding},radius};
}
function audit(continent,regions=[]){const mesh=layout(continent,regions),index=new Map(mesh.cells.map(c=>[c.q+','+c.r,c])),pairs=[],edgeErrors=[];for(const cell of mesh.cells)for(const[dq,dr]of directions){const other=index.get((cell.q+dq)+','+(cell.r+dr));if(!other||other.cellId<=cell.cellId)continue;const distance=Math.hypot(cell.x-other.x,cell.y-other.y),error=Math.abs(distance-dx);const av=vertices().map(([x,y])=>[cell.x+x,cell.y+y]),bv=vertices().map(([x,y])=>[other.x+x,other.y+y]),distances=av.flatMap(a=>bv.map(b=>Math.hypot(a[0]-b[0],a[1]-b[1]))).sort((a,b)=>a-b),sharedVertices=av.filter(a=>bv.some(b=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8)).length,edgeError=distances[1];pairs.push({a:cell.cellId,b:other.cellId,distance,error,sharedVertices,edgeError});if(error>1e-8||edgeError>1e-8||sharedVertices!==2)edgeErrors.push({a:cell.cellId,b:other.cellId,error,edgeError,sharedVertices});}return {continent,cells:mesh.cells.length,playableCells:mesh.cells.filter(c=>c.playable).length,regions:regions.length,additionalCells:mesh.cells.filter(c=>!c.playable).length,groupedCells:mesh.cells.filter(c=>c.regionIds.length>1).length,groupedRegions:mesh.cells.filter(c=>c.regionIds.length>1).reduce((n,c)=>n+c.regionIds.length,0),radius,neighborDistance:dx,neighborPairs:pairs.length,maxError:Math.max(0,...pairs.map(p=>p.error)),maxEdgeError:Math.max(0,...pairs.map(p=>p.edgeError)),edgeErrors,pairs};}
const api=Object.freeze({radius,dx,dy,directions,point,vertices,polygon,layout,audit,anchors});root.AtlasDenseGeography=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
