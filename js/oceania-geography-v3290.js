/* GM-02B candidate: eight axial cells, one per audited region. Not loaded by production. */
(function(root){'use strict';
const base=root.AtlasGeography||(typeof module==='object'&&module.exports?require('./southamerica-geography-v3230.js'):null);
if(!base)throw Error('Oceania requires the existing Atlas geometry');
// Axial q/r are a compact visual composition, independent of source HX identifiers.
const cells=Object.freeze([
  [
    "oc_nueva_guinea",
    1,
    -2,
    "N. Guinea",
    "Isla al norte de Australia; separación deliberada."
  ],
  [
    "oc_costa_nordeste_australiana",
    1,
    0,
    "Nordeste",
    "Litoral nororiental de Australia."
  ],
  [
    "oc_norte_tropical_australiano",
    0,
    0,
    "Norte",
    "Franja tropical norte."
  ],
  [
    "oc_desierto_australiano",
    0,
    1,
    "Interior",
    "Interior árido australiano."
  ],
  [
    "oc_tasmania",
    0,
    3,
    "Tasmania",
    "Isla al sur de Australia; no pegada al continente."
  ],
  [
    "oc_australia_occidental",
    -1,
    1,
    "Occidente",
    "Flanco occidental australiano."
  ],
  [
    "oc_australia_oriental",
    1,
    1,
    "Oriente",
    "Flanco oriental australiano."
  ],
  [
    "oc_nueva_zelanda",
    3,
    3,
    "N. Zelanda",
    "Islas al sureste; separación deliberada."
  ]
].map(c=>Object.freeze(c)));
function layout(continent,regions=[]){
 if(continent!=='Oceanía')return base.layout(continent,regions);
 const padding=22,raw=cells.map(([regionId,q,r,shortLabel,reason])=>({regionId,q,r,shortLabel,reason,...base.point(q,r)}));
 const origin={x:padding+base.dx/2-Math.min(...raw.map(c=>c.x)),y:padding+base.radius-Math.min(...raw.map(c=>c.y))},positions={};
 const mesh=raw.map(c=>{const region=regions.find(r=>r.id===c.regionId);const cell={cellId:'oceania-'+c.regionId,continent,q:c.q,r:c.r,column:c.q+(c.r-(c.r&1))/2,x:c.x+origin.x,y:c.y+origin.y,sourceId:c.regionId,shortLabel:c.shortLabel,label:region?.name||c.shortLabel,terrain:region?.habitats[0]||'bosque',regionIds:region?[region.id]:[],playable:!!region,kind:region?'playable':'reserved'};if(region)positions[region.id]={cellId:cell.cellId,q:cell.q,r:cell.r,x:cell.x,y:cell.y,reason:c.reason};return cell;});
 for(const r of regions)if(!positions[r.id])throw Error('Unknown Oceanian region: '+r.id);
 return {cells:mesh,positions,origin,board:{width:Math.max(...mesh.map(c=>c.x))+base.dx/2+padding,height:Math.max(...mesh.map(c=>c.y))+base.radius+padding},radius:base.radius};
}
function audit(continent,regions=[]){
 if(continent!=='Oceanía')return base.audit(continent,regions);
 const mesh=layout(continent,regions),index=new Map(mesh.cells.map(c=>[c.q+','+c.r,c])),pairs=[],edgeErrors=[];
 for(const a of mesh.cells)for(const[dq,dr]of base.directions){const b=index.get((a.q+dq)+','+(a.r+dr));if(!b||b.cellId<=a.cellId)continue;const av=base.vertices().map(([x,y])=>[a.x+x,a.y+y]),bv=base.vertices().map(([x,y])=>[b.x+x,b.y+y]),distance=Math.hypot(a.x-b.x,a.y-b.y),error=Math.abs(distance-base.dx),sharedVertices=av.filter(v=>bv.some(w=>Math.hypot(v[0]-w[0],v[1]-w[1])<1e-8)).length,edgeError=av.flatMap(v=>bv.map(w=>Math.hypot(v[0]-w[0],v[1]-w[1]))).sort((a,b)=>a-b)[1],pair={a:a.cellId,b:b.cellId,distance,error,sharedVertices,edgeError};pairs.push(pair);if(error>1e-8||edgeError>1e-8||sharedVertices!==2)edgeErrors.push(pair);}
 return {continent,cells:mesh.cells.length,playableCells:mesh.cells.filter(c=>c.playable).length,regions:regions.length,additionalCells:mesh.cells.filter(c=>!c.playable).length,groupedCells:0,groupedRegions:0,radius:base.radius,neighborDistance:base.dx,neighborPairs:pairs.length,maxError:Math.max(0,...pairs.map(p=>p.error)),maxEdgeError:Math.max(0,...pairs.map(p=>p.edgeError)),edgeErrors,pairs};
}
const api=Object.freeze({...base,layout,audit,oceanianCells:cells});root.AtlasGeography=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
