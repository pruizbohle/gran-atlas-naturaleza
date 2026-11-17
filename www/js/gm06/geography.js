/* Stable ID-based axial cartography for the opt-in GM-06 candidate. */
(function(root){'use strict';
const base=root.AtlasGeography, coords={"Europa": {"HX-01-09": [0, 1], "HX-01-11": [3, 0], "HX-02-09": [1, 3], "HX-02-10": [1, 2], "HX-02-11": [2, 2], "HX-02-12": [0, 3], "HX-03-09": [3, 2], "HX-03-10": [0, 4], "HX-03-11": [3, 1], "HX-03-12": [2, 3]}, "Asia": {"HX-03-13": [-1, 2], "HX-03-15": [-1, 3], "HX-02-13": [2, 1], "HX-03-14": [3, 1], "HX-04-13": [1, 2], "HX-02-15": [1, 1], "HX-03-16": [4, 1], "HX-03-18": [5, 1], "HX-04-14": [2, 2], "HX-04-15": [1, 4], "HX-03-17": [-1, 4], "HX-04-12": [0, 3], "HX-04-16": [1, 3], "HX-04-17": [2, 3], "HX-04-18": [0, 2], "HX-05-15": [3, 2], "HX-05-16": [0, 5], "HX-05-17": [3, 3], "HX-06-16": [4, 2], "HX-06-17": [2, 4], "HX-06-18": [5, 3], "gm06_sonda": [2, 6], "gm06_wallacea": [4, 6]}, "África": {"HX-06-09": [1, 0], "HX-07-10": [2, 2], "HX-08-11": [1, 2], "HX-06-11": [3, 0], "HX-07-08": [1, 1], "HX-08-08": [0, 1], "HX-09-11": [1, 3], "HX-10-10": [0, 5], "HX-11-11": [-1, 6], "HX-09-14": [3, 4], "HX-07-12": [4, 1], "HX-10-09": [-1, 5], "HX-08-10": [0, 2], "HX-07-13": [3, 1], "HX-11-08": [-2, 5], "HX-06-08": [0, 0], "HX-09-09": [0, 4], "HX-10-12": [2, 3], "HX-08-12": [3, 2], "HX-07-14": [5, 2], "HX-09-12": [0, 3], "HX-11-10": [1, 5], "HX-06-07": [2, 0], "HX-07-11": [2, 1], "gm06_rojo": [4, 0]}, "Norteamérica": {"HX-01-05": [0, 0], "HX-02-02": [1, 1], "HX-02-03": [2, 0], "HX-02-04": [2, 1], "HX-02-05": [3, 1], "HX-02-06": [1, 0], "HX-03-02": [4, 1], "HX-03-03": [0, 2], "HX-03-04": [3, 2], "HX-03-05": [1, 2], "HX-04-02": [1, 3], "HX-04-03": [2, 3], "HX-04-04": [2, 2], "HX-05-04": [2, 4], "gm06_hudson": [3, -1], "gm06_labrador": [4, -1], "gm06_atlantico": [5, 0], "gm06_antillas": [5, 3]}, "Sudamérica": {"sa_caribe_sudamericano": [0, 0], "sa_llanos_del_orinoco": [1, 0], "sa_andes_del_norte": [-1, 1], "sa_amazonia": [0, 1], "sa_cerrado_brasileno": [1, 1], "sa_andes_centrales": [-1, 2], "sa_pantanal": [0, 2], "sa_desierto_de_atacama": [-2, 3], "sa_pampas": [-1, 3], "sa_patagonia_y_tierra_del_fuego": [-2, 5], "gm06_darien": [-1, 0], "gm06_galapagos": [-4, 2], "gm06_humboldt": [-2, 2], "gm06_bosques": [-2, 4]}, "Oceanía": {"oc_nueva_guinea": [1, -2], "oc_costa_nordeste_australiana": [1, 0], "oc_norte_tropical_australiano": [0, 0], "oc_desierto_australiano": [0, 1], "oc_tasmania": [0, 3], "oc_australia_occidental": [-1, 1], "oc_australia_oriental": [1, 1], "oc_nueva_zelanda": [3, 3], "gm06_melanesia": [4, 1]}}, decorations={"Europa": [], "Asia": [{"q": 2, "r": 0, "kind": "ice", "terrain": "hielo"}, {"q": 3, "r": 0, "kind": "ice", "terrain": "hielo"}, {"q": 4, "r": 0, "kind": "ice", "terrain": "hielo"}, {"q": 5, "r": 0, "kind": "ice", "terrain": "hielo"}], "África": [], "Norteamérica": [], "Sudamérica": [], "Oceanía": [], "Polos": [], "Océanos": []};
if(!base)throw Error('GM06 requires base cartography');
function layout(continent,regions=[]){
 if(!coords[continent])return base.layout(continent,regions);
 const occupied=new Set(),raw=[];
 for(const region of regions){
  const p=coords[continent][region.id];if(!p)throw Error('GM06 missing stable coordinate: '+region.id);
  const [q,r]=p,key=q+','+r;if(occupied.has(key))throw Error('GM06 overlapping cells: '+key);occupied.add(key);
  raw.push({regionId:region.id,q,r,label:region.name,shortLabel:region.name,terrain:region.habitats[0],regionIds:[region.id],playable:true,kind:'playable',...base.point(q,r)});
 }
 for(const c of decorations[continent]||[])if(!occupied.has(c.q+','+c.r))raw.push({...c,regionIds:[],playable:false,...base.point(c.q,c.r)});
 const padding=22,origin={x:padding+base.dx/2-Math.min(...raw.map(c=>c.x)),y:padding+base.radius-Math.min(...raw.map(c=>c.y))},positions={};
 const cells=raw.map(c=>{const cell={...c,cellId:'gm06-'+continent+'-'+c.q+'-'+c.r,continent,column:c.q+(c.r-(c.r&1))/2,sourceId:c.regionId,x:c.x+origin.x,y:c.y+origin.y};if(c.regionId)positions[c.regionId]={cellId:cell.cellId,q:cell.q,r:cell.r,x:cell.x,y:cell.y,reason:'Retícula axial vinculada a ID estable GM-06'};return cell;});
 return {cells,positions,origin,board:{width:Math.max(...cells.map(c=>c.x))+base.dx/2+padding,height:Math.max(...cells.map(c=>c.y))+base.radius+padding},radius:base.radius};
}
function audit(continent,regions=[]){
 if(!coords[continent])return base.audit(continent,regions);
 const m=layout(continent,regions),ix=new Map(m.cells.map(c=>[c.q+','+c.r,c])),pairs=[],edgeErrors=[];
 for(const a of m.cells)for(const[dq,dr]of base.directions){const z=ix.get((a.q+dq)+','+(a.r+dr));if(!z||z.cellId<=a.cellId)continue;
  const av=base.vertices().map(([x,y])=>[a.x+x,a.y+y]),bv=base.vertices().map(([x,y])=>[z.x+x,z.y+y]);
  const sharedVertices=av.filter(v=>bv.some(w=>Math.hypot(v[0]-w[0],v[1]-w[1])<1e-7)).length,error=Math.abs(Math.hypot(a.x-z.x,a.y-z.y)-base.dx),edgeError=av.flatMap(v=>bv.map(w=>Math.hypot(v[0]-w[0],v[1]-w[1]))).sort((a,b)=>a-b)[1];
  const p={a:a.cellId,b:z.cellId,sharedVertices,error,edgeError};pairs.push(p);if(error>1e-7||edgeError>1e-7||sharedVertices!==2)edgeErrors.push(p);
 }
 return {continent,cells:m.cells.length,regions:regions.length,playableCells:regions.length,additionalCells:m.cells.length-regions.length,groupedCells:0,groupedRegions:0,neighborPairs:pairs.length,maxError:Math.max(0,...pairs.map(p=>p.error)),maxEdgeError:Math.max(0,...pairs.map(p=>p.edgeError)),edgeErrors,pairs};
}
root.AtlasGM06GeographyBase=base;root.AtlasGeography=Object.freeze({...base,layout,audit,gm06Coordinates:coords});
})(globalThis);
