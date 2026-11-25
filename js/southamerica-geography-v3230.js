/* AM-04: ten axial cells, one per region. Existing continents delegate unchanged. */
(function(root){'use strict';
const base=root.AtlasGeography||(typeof module==='object'&&module.exports?require('./atlas-geography-v3211b.js'):null);
if(!base)throw Error('South America requires the existing Atlas geometry');
// Axial q/r are a compact visual composition, independent of source HX identifiers.
const cells=Object.freeze([
 ['sa_caribe_sudamericano',0,0,'Caribe','Costa norte.'],
 ['sa_llanos_del_orinoco',1,0,'Orinoco','Llanuras al este del Caribe y al norte de las cuencas.'],
 ['sa_andes_del_norte',-1,1,'Andes norte','Borde noroccidental; incluye vertientes y piedemonte.'],
 ['sa_amazonia',0,1,'Amazonía','Masa tropical central y norte, al este de los Andes.'],
 ['sa_cerrado_brasileno',1,1,'Cerrado','Cuencas y sabanas centro-orientales, al este de Amazonía.'],
 ['sa_andes_centrales',-1,2,'Andes centrales','Cordillera occidental central.'],
 ['sa_pantanal',0,2,'Pantanal','Interior centro-sur, al este de los Andes y al sur del Cerrado.'],
 ['sa_desierto_de_atacama',-2,3,'Atacama','Flanco árido occidental, bajo los Andes centrales.'],
 ['sa_pampas',-1,3,'Pampas','Llanuras del sureste, al este de Atacama.'],
 ['sa_patagonia_y_tierra_del_fuego',-2,4,'Patagonia','Extremo austral estrecho.']
].map(c=>Object.freeze(c)));
function layout(continent,regions=[]){
 if(continent!=='Sudamérica')return base.layout(continent,regions);
 const padding=22,raw=cells.map(([regionId,q,r,shortLabel,reason])=>({regionId,q,r,shortLabel,reason,...base.point(q,r)}));
 const origin={x:padding+base.dx/2-Math.min(...raw.map(c=>c.x)),y:padding+base.radius-Math.min(...raw.map(c=>c.y))},positions={};
 const mesh=raw.map(c=>{const region=regions.find(r=>r.id===c.regionId);const cell={cellId:'sudamerica-'+c.regionId,continent,q:c.q,r:c.r,column:c.q+(c.r-(c.r&1))/2,x:c.x+origin.x,y:c.y+origin.y,sourceId:c.regionId,shortLabel:c.shortLabel,label:region?.name||c.shortLabel,terrain:region?.habitats[0]||'bosque',regionIds:region?[region.id]:[],playable:!!region,kind:region?'playable':'reserved'};if(region)positions[region.id]={cellId:cell.cellId,q:cell.q,r:cell.r,x:cell.x,y:cell.y,reason:c.reason};return cell;});
 for(const r of regions)if(!positions[r.id])throw Error('Unknown South American region: '+r.id);
 return {cells:mesh,positions,origin,board:{width:Math.max(...mesh.map(c=>c.x))+base.dx/2+padding,height:Math.max(...mesh.map(c=>c.y))+base.radius+padding},radius:base.radius};
}
function audit(continent,regions=[]){
 if(continent!=='Sudamérica')return base.audit(continent,regions);
 const mesh=layout(continent,regions),index=new Map(mesh.cells.map(c=>[c.q+','+c.r,c])),pairs=[],edgeErrors=[];
 for(const a of mesh.cells)for(const[dq,dr]of base.directions){const b=index.get((a.q+dq)+','+(a.r+dr));if(!b||b.cellId<=a.cellId)continue;const av=base.vertices().map(([x,y])=>[a.x+x,a.y+y]),bv=base.vertices().map(([x,y])=>[b.x+x,b.y+y]),distance=Math.hypot(a.x-b.x,a.y-b.y),error=Math.abs(distance-base.dx),sharedVertices=av.filter(v=>bv.some(w=>Math.hypot(v[0]-w[0],v[1]-w[1])<1e-8)).length,edgeError=av.flatMap(v=>bv.map(w=>Math.hypot(v[0]-w[0],v[1]-w[1]))).sort((a,b)=>a-b)[1],pair={a:a.cellId,b:b.cellId,distance,error,sharedVertices,edgeError};pairs.push(pair);if(error>1e-8||edgeError>1e-8||sharedVertices!==2)edgeErrors.push(pair);}
 return {continent,cells:mesh.cells.length,playableCells:mesh.cells.filter(c=>c.playable).length,regions:regions.length,additionalCells:mesh.cells.filter(c=>!c.playable).length,groupedCells:0,groupedRegions:0,radius:base.radius,neighborDistance:base.dx,neighborPairs:pairs.length,maxError:Math.max(0,...pairs.map(p=>p.error)),maxEdgeError:Math.max(0,...pairs.map(p=>p.edgeError)),edgeErrors,pairs};
}
const api=Object.freeze({...base,layout,audit,southAmericanCells:cells});root.AtlasGeography=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
